/**
 * 外部程序详情页面
 * 用于设置参数并运行外部程序
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Typography, Form, Input, InputNumber, Button, Spin, Alert, Card, Divider, Result } from 'antd';

import log from '../../utils/logger';
import { useExternalPrograms } from '../../utils/externalProgramsState';
import { getCurrentPlatform, buildCommandArgs } from '../../utils/externalPrograms';
import { ExternalProgram, ProgramParameter } from '../../types/external-programs';

// 导入 Tauri 事件系统
import { listen } from '@tauri-apps/api/event';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * 外部程序详情组件
 */
export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<ExternalProgram | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    success: boolean;
    stdout: string;
    stderr: string;
  } | null>(null);
  const [realtimeOutput, setRealtimeOutput] = useState<{
    stdout: string;
    stderr: string;
  }>({ stdout: '', stderr: '' });



  // 使用全局状态管理
  const { programs, loading: configLoading, error: configError } = useExternalPrograms();

  /**
   * 加载程序配置
   */
  useEffect(() => {
    if (!id) {
      setError('程序ID不存在');
      return;
    }

    // 从全局状态中获取程序配置
    const programData = programs.find(p => p.id === id);
    if (programData) {
      setProgram(programData);
      // 初始化表单默认值
      const initialValues: Record<string, any> = {};
      programData.parameters.forEach(param => {
        if (param.default !== undefined) {
          initialValues[param.name] = param.default;
        }
      });
      form.setFieldsValue(initialValues);
      setError(null);
    } else {
      setError('程序不存在');
    }
  }, [id, form, programs]);

  /**
   * 监听程序输出事件
   */
  useEffect(() => {
    const setupEventListeners = async () => {
      try {
        // 监听程序输出事件
        const unsubscribe = await listen('program-output', (event) => {
          const payload = event.payload as any;
          log.info(`Received program output: ${JSON.stringify(payload)}`);
          
          if (payload.done) {
            // 程序执行完成
            setExecuting(false);
            // 直接使用payload中的输出，而不是依赖realtimeOutput
            setExecutionResult({
              success: payload.success,
              stdout: payload.stdout || '',
              stderr: payload.stderr || ''
            });
          } else {
            // 实时更新输出
            setRealtimeOutput(prev => ({
              stdout: prev.stdout + (payload.stdout ? payload.stdout + '\n' : ''),
              stderr: prev.stderr + (payload.stderr ? payload.stderr + '\n' : '')
            }));
          }
        });

        return unsubscribe;
      } catch (error) {
        log.warn(`Failed to set up event listeners: ${error}`);
      }
    };

    const unsubscribe = setupEventListeners();

    return () => {
      if (unsubscribe) {
        unsubscribe.then((fn) => {
          if (fn) {
            fn();
          }
        });
      }
    };
  }, []); // 移除realtimeOutput依赖，避免监听器被频繁重置

  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: Record<string, any>) => {
    if (!program) return;

    try {
      setExecuting(true);
      setExecutionResult(null);
      setRealtimeOutput({ stdout: '', stderr: '' }); // 重置实时输出

      log.info(`Executing program: ${program.name}`);

      // 获取当前平台类型
      const platform = await getCurrentPlatform();
      log.info(`Detected platform: ${platform}`);

      // 构建参数字典
      const paramValues: Record<string, string | number> = {};
      program.parameters.forEach(param => {
        const value = values[param.name];
        if (value !== undefined && value !== null) {
          paramValues[param.name] = value;
        }
      });

      // 使用模板方式构建命令参数
      const args = buildCommandArgs(program.platformArgs, platform, paramValues);

      log.debug(`Command: ${program.path} ${args.join(' ')}`);

      // 调用后端API执行程序
      try {
        log.info('Calling Tauri execute_program command');
        const { invoke } = await import('@tauri-apps/api/core');
        const { getCurrentWindow } = await import('@tauri-apps/api/window');
        const window = getCurrentWindow();
        
        // 注意：这里不再等待结果，因为我们通过事件系统接收实时输出
        // 程序执行完成后会通过事件通知我们
        invoke('execute_program', {
          program: program.path,
          arguments: args,
          window
        }).catch(err => {
          log.error(`Failed to execute program: ${err}`);
          setExecuting(false);
          setExecutionResult({
            success: false,
            stdout: '',
            stderr: err.message
          });
        });
      } catch (err: any) {
        log.error(`Failed to execute program: ${err.message}`);
        setExecuting(false);
        // 检查是否是因为不在 Tauri 环境中运行
        if (err.message.includes('__TAURI__') || err.message.includes('invoke') || err.message.includes('Failed to fetch')) {
          setExecutionResult({
            success: false,
            stdout: '',
            stderr: '请在 Tauri 应用中运行此功能'
          });
        } else {
          setExecutionResult({
            success: false,
            stdout: '',
            stderr: err.message
          });
        }
      }
    } catch (err: any) {
      log.error(`Error in handleSubmit: ${err.message}`);
      setExecuting(false);
      setExecutionResult({
        success: false,
        stdout: '',
        stderr: err.message
      });
    }
  };

  // 检查全局配置是否正在加载
  if (configLoading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>加载中...</div>
      </div>
    );
  }

  // 检查全局配置是否有错误
  if (configError) {
    return (
      <div style={{ padding: '40px' }}>
        <Alert
          message="错误"
          description={configError}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (error || !program) {
    return (
      <div style={{ padding: '40px' }}>
        <Alert
          message="错误"
          description={error || '程序不存在'}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <Title level={2}>{program.name}</Title>
      <Paragraph>{program.description}</Paragraph>
      
      <Divider />
      
      <Card title="参数设置" style={{ marginBottom: '24px' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {program.parameters.map((param: ProgramParameter) => (
            <Form.Item
              key={param.name}
              label={
                <span>
                  {param.label}
                  {param.required && <Text type="danger"> *</Text>}
                </span>
              }
              name={param.name}
              rules={[
                { required: param.required, message: `请输入${param.label}` }
              ]}
            >
              {param.type === 'string' ? (
                <Input placeholder={param.description} />
              ) : (
                <InputNumber placeholder={param.description} />
              )}
            </Form.Item>
          ))}
          
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={executing}
              style={{ marginRight: '8px' }}
              disabled={executing}
            >
              运行
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      {(executing || realtimeOutput.stdout || realtimeOutput.stderr) && (
        <Card title="运行结果">
          {executing ? (
            <div>
              {realtimeOutput.stdout && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>标准输出：</div>
                  <TextArea
                    value={realtimeOutput.stdout}
                    rows={5}
                    readOnly
                    style={{ marginBottom: '16px' }}
                  />
                </>
              )}
              {realtimeOutput.stderr && (
                <>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#faad14' }}>标准错误：</div>
                  <TextArea
                    value={realtimeOutput.stderr}
                    rows={5}
                    readOnly
                  />
                </>
              )}
            </div>
          ) : executionResult ? (
            executionResult.success ? (
              <Result
                status="success"
                title="执行成功"
                extra={
                  <div>
                    {executionResult.stdout && (
                      <>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>标准输出：</div>
                        <TextArea
                          value={executionResult.stdout}
                          rows={5}
                          readOnly
                          style={{ marginBottom: '16px' }}
                        />
                      </>
                    )}
                    {executionResult.stderr && (
                      <>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#faad14' }}>标准错误：</div>
                        <TextArea
                          value={executionResult.stderr}
                          rows={5}
                          readOnly
                        />
                      </>
                    )}
                  </div>
                }
              />
            ) : (
              <Result
                status="error"
                title="执行失败"
                extra={
                  <div>
                    {executionResult.stdout && (
                      <>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>标准输出：</div>
                        <TextArea
                          value={executionResult.stdout}
                          rows={5}
                          readOnly
                          style={{ marginBottom: '16px' }}
                        />
                      </>
                    )}
                    {executionResult.stderr && (
                      <>
                        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ff4d4f' }}>标准错误：</div>
                        <TextArea
                          value={executionResult.stderr}
                          rows={5}
                          readOnly
                        />
                      </>
                    )}
                  </div>
                }
              />
            )
          ) : null}
        </Card>
      )}
    </div>
  );
}
