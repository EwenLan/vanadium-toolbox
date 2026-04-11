/**
 * 导航页面1
 * 展示第一个导航页面的内容
 */
import TitledFunction from "../../templates/titledfunction";
import { useTranslation } from 'react-i18next';

/**
 * Nav1 组件
 * @returns 导航页面1内容
 */
export default function Nav1() {
    const { t } = useTranslation();
    return (
        <TitledFunction title={t('nav.nav1')}>
            Content
        </TitledFunction>
    )
}