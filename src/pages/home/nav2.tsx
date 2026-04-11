import TitledFunction from "../../templates/titledfunction";
import { useTranslation } from 'react-i18next';

export default function Nav2() {
    const { t } = useTranslation();
    return (
        <TitledFunction title={t('nav.nav2')}>
            Content
        </TitledFunction>
    )
}