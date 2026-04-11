/**
 * 导航页面3
 * 展示第三个导航页面的内容
 */
import TitledFunction from "../../templates/titledfunction";
import { useTranslation } from 'react-i18next';

/**
 * Nav3 组件
 * @returns 导航页面3内容
 */
export default function Nav3() {
    const { t } = useTranslation();
    return (
        <TitledFunction title={t('nav.nav3')}>
            Content
        </TitledFunction>
    )
}