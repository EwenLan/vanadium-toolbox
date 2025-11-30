import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { NavLink, Outlet } from 'react-router';
import '../styles/appnavigator.css';

const { Header } = Layout;

const items1: MenuProps['items'] = [
    {
        key: "1",
        label: <NavLink to="/home/nav1">Home</NavLink>,
    },
    {
        key: "2",
        label: <NavLink to="/about">About</NavLink>,
    },
]
export default function AppNavigator() {
    return (
        <Layout>
            <Header className="app-navigator-header">
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={items1}
                    className="app-navigator-menu"
                />
            </Header>
            <Layout>
                <Outlet />
            </Layout>
        </Layout>
    );
}