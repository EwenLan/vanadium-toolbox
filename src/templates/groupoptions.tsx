/**
 * 分组选项布局组件
 * 提供侧边栏导航和面包屑功能
 */
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { NavLink, Outlet, useLocation } from 'react-router';
import '../styles/groupoptions.css';
import { getHomeRouteChildren, getRouteTitle } from '../utils/routeUtils';

const { Content, Sider } = Layout;

/**
 * 生成分组选项组件
 * 包含侧边栏导航和面包屑导航
 */
export default function GroupOptions() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const location = useLocation();

    /**
     * 生成面包屑导航项
     */
    const generateBreadcrumbItems = (): { title: string; href: string }[] => {
        const path = location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        const breadcrumbItems: { title: string; href: string }[] = [];

        pathParts.forEach((_, index) => {
            const currentPath = '/' + pathParts.slice(0, index + 1).join('/');
            const title = getRouteTitle(currentPath);
            breadcrumbItems.push({
                title: title,
                href: currentPath
            });
        });

        return breadcrumbItems;
    };

    /**
     * 生成导航菜单项
     */
    const generateMenuItems = (): MenuProps['items'] => {
        const children = getHomeRouteChildren();
        return children
            .filter(route => route.element && !route.redirect)
            .map((route, index) => ({
                key: (index + 1).toString(),
                label: route.label ? <NavLink to={`/home/${route.path}`}>{route.label}</NavLink> : route.path
            }));
    };

    const breadcrumbItems = generateBreadcrumbItems();
    const menuItems = generateMenuItems();

    return (
        <>
            <Sider width={200} style={{ background: colorBgContainer }} className="group-options-sider">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    defaultOpenKeys={['sub1']}
                    className="group-options-menu"
                    items={menuItems}
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
