import type { MenuProps } from 'antd';
import { Layout, Menu, Select, Switch } from 'antd';
import { NavLink, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import '../styles/appnavigator.css';

const { Header } = Layout;

interface AppNavigatorProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: string;
  changeLanguage: (language: string) => void;
}

export default function AppNavigator({ isDarkMode, toggleTheme, language, changeLanguage }: AppNavigatorProps) {
    const { t } = useTranslation();

    const handleLanguageChange = (value: string) => {
        changeLanguage(value);
    };

    const items1: MenuProps['items'] = [
        {
            key: "1",
            label: <NavLink to="/home/nav1">{t('nav.home')}</NavLink>,
        },
        {
            key: "2",
            label: <NavLink to="/about">{t('nav.about')}</NavLink>,
        },
    ];

    return (
        <Layout>
            <Header className="app-navigator-header" style={{ backgroundColor: isDarkMode ? '#001529' : '#ffffff', boxShadow: isDarkMode ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.15)' }}>

                <Menu
                    theme={isDarkMode ? "dark" : "light"}
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={items1}
                    className="app-navigator-menu"
                    style={{ backgroundColor: 'transparent' }}
                />
                <div className="header-controls">
                    <div className="theme-toggle">
                        <Switch
                            checked={isDarkMode}
                            onChange={toggleTheme}
                            checkedChildren={<MoonOutlined />}
                            unCheckedChildren={<SunOutlined />}
                            style={{ color: isDarkMode ? '#1890ff' : '#1890ff' }}
                        />
                    </div>
                    <div className="language-selector">
                        <Select
                            value={language}
                            style={{ width: 120 }}
                            onChange={handleLanguageChange}
                            options={[
                                { value: 'zh-CN', label: t('language.zh-CN') },
                                { value: 'en-US', label: t('language.en-US') },
                            ]}
                        />
                    </div>
                </div>
            </Header>
            <Layout>
                <Outlet />
            </Layout>
        </Layout>
    );
}