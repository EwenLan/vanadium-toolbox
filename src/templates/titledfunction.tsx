import { Typography } from "antd"
const { Title } = Typography

export default function TitledFunction({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div>
            <Title>{title}</Title>
            {children}
        </div>
    )
}