import TitledFunction from "../../templates/titledfunction";
import { useTranslation } from 'react-i18next';

export default function Nav3() {
    const { t } = useTranslation();
    return (
        <TitledFunction title={t('nav.nav3')}>
            Content
        </TitledFunction>
    )
}