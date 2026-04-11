import TitledFunction from "../../templates/titledfunction";
import { useTranslation } from 'react-i18next';

export default function Nav1() {
    const { t } = useTranslation();
    return (
        <TitledFunction title={t('nav.nav1')}>
            Content
        </TitledFunction>
    )
}