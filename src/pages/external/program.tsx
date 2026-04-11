/**
 * 外部程序详情页面
 * 用于设置参数并运行外部程序
 */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Typography, Form, Input, InputNumber, Button, Spin, Alert, Card, Divider, Result } from 'antd';

import log from '../../utils/logger';
import { getExternalProgramById } from '../../utils/externalPrograms';
import { ExternalProgram, ProgramParameter } from '../../types/external-programs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

/**
 * 外部程序详情组件
 */
export default function ProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<ExternalProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    success: boolean;
    output: string;
    error: string;
  } | null>(null);

  /**
   * 加载程序配置
   */
  useEffect(() => {
    const loadProgram = async () => {
      if (!id) {
        setError('程序ID不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const programData = await getExternalProgramById(id);
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
        } else {
          setError('程序不存在');
        }
      } catch (err: any) {
        log.error(`Failed to load program: ${err.message}`);
        setError('加载程序失败');
      } finally {
        setLoading(false);
      }
    };

    loadProgram();
  }, [id, form]);

  /**
   * 处理表单提交
   */
  const handleSubmit = async (values: Record<string, any>) => {
    if (!program) return;

    try {
      setExecuting(true);
      setExecutionResult(null);

      log.info(`Executing program: ${program.name}`);
      
      // 构建命令参数
      const args: string[] = [];
      program.parameters.forEach(param => {
        const value = values[param.name];
        if (value !== undefined && value !== null) {
          args.push(value.toString());
        }
      });

      log.debug(`Command: ${program.path} ${args.join(' ')}`);

      // 检查是否在 Tauri 环境中运行
      const isTauri = typeof window !== 'undefined' && (window as any).__TAURI__ !== undefined;
      
      if (!isTauri) {
        setExecutionResult({
          success: false,
          output: '',
          error: '请在 Tauri 应用中运行此功能'
        });
        return;
      }
      
      // 调用后端API执行程序
      const { invoke } = await import('@tauri-apps/api/core');
      const result = await invoke('execute_program', {
        program: program.path,
        arguments: args
      });

      log.info(`Program executed successfully`);
      setExecutionResult({
        success: true,
        output: result as string,
        error: ''
      });
    } catch (err: any) {
      log.error(`Failed to execute program: ${err.message}`);
      setExecutionResult({
        success: false,
        output: '',
        error: err.message
      });
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>加载中...</div>
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
            >
              运行
            </Button>
          </Form.Item>
        </Form>
      </Card>
      
      {executionResult && (
        <Card title="运行结果">
          {executionResult.success ? (
            <Result
              status="success"
              title="执行成功"
              extra={
                <TextArea
                  value={executionResult.output}
                  rows={10}
                  readOnly
                  style={{ marginTop: '16px' }}
                />
              }
            />
          ) : (
            <Result
              status="error"
              title="执行失败"
              extra={
                <TextArea
                  value={executionResult.error}
                  rows={10}
                  readOnly
                  style={{ marginTop: '16px' }}
                />
              }
            />
          )}
        </Card>
      )}
    </div>
  );
}
