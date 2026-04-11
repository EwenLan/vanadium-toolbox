/**
 * 带标题的功能容器组件
 * 为子内容提供统一的标题展示
 */
import { Typography } from "antd"
const { Title } = Typography

/**
 * 带标题的功能容器组件属性
 */
interface TitledFunctionProps {
    title: string;
    children: React.ReactNode;
}

/**
 * 带标题的功能容器组件
 * @param props 组件属性
 * @returns 带标题的内容容器
 */
export default function TitledFunction({ title, children }: TitledFunctionProps) {
    return (
        <div>
            <Title>{title}</Title>
            {children}
        </div>
    )
}