/**
 * 分组选项布局组件
 * 提供侧边栏导航和面包屑功能
 */
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, Spin } from 'antd';
import { NavLink, Outlet, useLocation } from 'react-router';
import '../styles/groupoptions.css';
import { getRouteChildren, getRouteTitle } from '../utils/routeUtils';
import { useExternalPrograms } from '../utils/externalProgramsState';

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
    const { programs, loading: configLoading } = useExternalPrograms();

    // 外部程序列表
    const externalPrograms = programs;

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
        const path = location.pathname;
        const parentPath = path.split('/')[1] || 'home';
        
        // 外部程序模块显示加载的外部程序列表
        if (parentPath === 'external') {
            return externalPrograms.map((program) => ({
                key: program.id,
                label: <NavLink to={`/external/${program.id}`}>{program.name}</NavLink>
            }));
        }
        
        // 其他模块从路由配置中获取
        const children = getRouteChildren(parentPath);
        
        return children
            .filter(route => route.element && !route.redirect)
            .map((route) => ({
                key: route.path,
                label: route.label ? <NavLink to={`/${parentPath}/${route.path}`}>{route.label}</NavLink> : route.path
            }));
    };

    /**
     * 获取当前选中的菜单项键
     */
    const getSelectedKey = (): string => {
        const path = location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        
        if (pathParts.length >= 2 && pathParts[0] === 'external') {
            // 外部程序模块，返回程序ID
            return pathParts[1];
        } else if (pathParts.length >= 2) {
            // 其他模块，返回子路径
            return pathParts[1];
        }
        
        return '1'; // 默认值
    };

    const breadcrumbItems = generateBreadcrumbItems();
    const menuItems = generateMenuItems();

    return (
        <>
            <Sider width={200} style={{ background: colorBgContainer }} className="group-options-sider">
                {configLoading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <Spin size="small" />
                        <div style={{ marginTop: '8px', fontSize: '12px' }}>加载中...</div>
                    </div>
                ) : (
                    <Menu
                        mode="inline"
                        selectedKeys={[getSelectedKey()]}
                        defaultOpenKeys={['sub1']}
                        className="group-options-menu"
                        items={menuItems}
                    />
                )}
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
