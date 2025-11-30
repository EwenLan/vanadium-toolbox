import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { NavLink, Outlet, useLocation } from 'react-router';
import '../styles/groupoptions.css';

const { Content, Sider } = Layout;

const items2: MenuProps['items'] = [
    {
        key: "1",
        label: <NavLink to="/home/nav1">Nav 1</NavLink>,
    },
    {
        key: "2",
        label: <NavLink to="/home/nav2">Nav 2</NavLink>,
    },
    {
        key: "3",
        label: <NavLink to="/home/nav3">Nav 3</NavLink>,
    },
]

export default function GroupOptions() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation();

    // 路由路径到标题的映射
    const pathTitleMap: Record<string, string> = {
        '/home': 'Home',
        '/home/nav1': 'Nav 1',
        '/home/nav2': 'Nav 2',
        '/home/nav3': 'Nav 3'
    };

    // 生成面包屑导航项
    const generateBreadcrumbItems = () => {
        const path = location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        const breadcrumbItems = [];
        let currentPath = '';

        // 添加Home路径（如果路径不为空）
        if (pathParts.length > 0) {
            currentPath = '/' + pathParts[0];
            breadcrumbItems.push({
                title: pathTitleMap[currentPath] || pathParts[0],
                href: currentPath
            });
        }

        // 添加后续路径段
        if (pathParts.length > 1) {
            pathParts.slice(1).forEach((part) => {
                currentPath = currentPath + '/' + part;
                breadcrumbItems.push({
                    title: pathTitleMap[currentPath] || part,
                    href: currentPath
                });
            });
        }

        return breadcrumbItems;
    };

    const breadcrumbItems = generateBreadcrumbItems();

    return (
        <>
            <Sider width={200} style={{ background: colorBgContainer }} className="group-options-sider">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    className="group-options-menu"
                    items={items2}
                />
            </Sider>
            <Layout className="group-options-layout">
                <Breadcrumb
                    items={breadcrumbItems.length > 0 ? breadcrumbItems : [{ title: 'Home' }]}
                    className="group-options-breadcrumb"
                />
                <Content
                    style={{
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                    className="group-options-content"
                >
                    <Outlet />
                </Content>
            </Layout>
        </>
    )
}