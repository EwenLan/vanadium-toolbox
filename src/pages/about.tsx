import { useTranslation } from 'react-i18next';
import { theme } from 'antd';
const { useToken } = theme;

export default function About() {
    const { t } = useTranslation();
    const { token } = useToken();
    return (
        <div>
            <h1 style={{ color: token.colorTextHeading }}>{t('about.title')}</h1>
            <p style={{ color: token.colorText }}>{t('about.description')}</p>
        </div>
    )
}
