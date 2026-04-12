/**
 * 应用导航栏组件
 * 提供顶部导航菜单、主题切换和语言选择功能
 */
import type { MenuProps } from 'antd';
import { Layout, Menu, Select, Switch } from 'antd';
import { NavLink, Outlet } from 'react-router';
import { useTranslation } from 'react-i18next';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import log from '../utils/logger';
import '../styles/appnavigator.css';

const { Header } = Layout;

/**
 * 导航栏组件属性
 */
interface AppNavigatorProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: string;
  changeLanguage: (language: string) => void;
}

/**
 * 应用导航栏组件
 * @param props 组件属性
 * @returns 导航栏组件
 */
export default function AppNavigator({ isDarkMode, toggleTheme, language, changeLanguage }: AppNavigatorProps) {
    const { t } = useTranslation();

    /**
     * 处理语言切换
     */
    const handleLanguageChange = async (value: string) => {
        log.debug(`User action: change language to ${value}`);
        changeLanguage(value);
    };

    /**
     * 处理主题切换
     */
    const handleThemeToggle = async () => {
        log.debug(`User action: toggle theme to ${!isDarkMode ? 'dark' : 'light'}`);
        toggleTheme();
    };

    /**
     * 处理导航点击
     */
    const handleNavClick = async (key: string) => {
        let route = '';
        switch (key) {
            case '1':
                route = '/home/nav1';
                break;
            case '2':
                route = '/external';
                break;
            case '3':
                route = '/about';
                break;
            default:
                route = '/home/nav1';
        }
        log.debug(`User action: navigate to ${route}`);
    };

    const items1: MenuProps['items'] = [
        {
            key: "1",
            label: <NavLink to="/home/nav1">{t('nav.home')}</NavLink>,
            onClick: () => handleNavClick('1'),
        },
        {
            key: "2",
            label: <NavLink to="/external">{t('nav.external')}</NavLink>,
            onClick: () => handleNavClick('2'),
        },
        {
            key: "3",
            label: <NavLink to="/about">{t('nav.about')}</NavLink>,
            onClick: () => handleNavClick('3'),
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
                            onChange={handleThemeToggle}
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