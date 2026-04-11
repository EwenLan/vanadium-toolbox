import { useTranslation } from 'react-i18next';
import { theme } from 'antd';
const { useToken } = theme;

export default function About() {
    const { t } = useTranslation();
    const { token } = useToken();
    return (
        <div style={{ padding: '40px 60px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: token.colorTextHeading, marginBottom: '20px' }}>{t('about.title')}</h1>
            <p style={{ color: token.colorText, lineHeight: '1.6' }}>{t('about.description')}</p>
        </div>
    )
}
