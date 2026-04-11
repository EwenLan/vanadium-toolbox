/**
 * 外部程序列表页面
 * 展示所有支持的外部程序
 */
import { useEffect, useState } from 'react';
import { List, Card, Typography, Spin, Alert } from 'antd';
import { NavLink } from 'react-router';
import log from '../../utils/logger';
import { loadExternalProgramsConfig } from '../../utils/externalPrograms';
import { ExternalProgram } from '../../types/external-programs';

const { Title, Text, Paragraph } = Typography;

/**
 * 外部程序列表组件
 */
export default function ProgramsList() {
  const [programs, setPrograms] = useState<ExternalProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 加载外部程序配置
   */
  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const config = await loadExternalProgramsConfig();
        setPrograms(config.programs);
      } catch (err: any) {
        log.error(`Failed to load programs: ${err.message}`);
        setError('加载外部程序失败');
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '16px' }}>加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px' }}>
        <Alert
          message="错误"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <Title level={2}>外部程序</Title>
      <Paragraph>
        选择要执行的外部程序，进入详情页面后可以设置参数并运行。
      </Paragraph>
      
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={programs}
        renderItem={program => (
          <List.Item>
            <Card
              hoverable
              actions={[
                <NavLink key="run" to={`/external/program/${program.id}`}>
                  运行
                </NavLink>
              ]}
            >
              <Card.Meta
                title={<Text strong>{program.name}</Text>}
                description={
                  <div>
                    <Text type="secondary">{program.description}</Text>
                    <div style={{ marginTop: '8px' }}>
                      <Text style={{ fontSize: '12px' }}>参数: {program.parameters.length}</Text>
                    </div>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
}
