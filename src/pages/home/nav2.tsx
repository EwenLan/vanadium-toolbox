/**
 * 导航页面2
 * 展示第二个导航页面的内容
 */
import TitledFunction from "../../templates/titledfunction";
import { useTranslation } from 'react-i18next';

/**
 * Nav2 组件
 * @returns 导航页面2内容
 */
export default function Nav2() {
    const { t } = useTranslation();
    return (
        <TitledFunction title={t('nav.nav2')}>
            Content
        </TitledFunction>
    )
}