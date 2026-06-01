import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { config } from '@/.config/config.client';

type PageMetaKey = 'Home' | 'Clouva' | 'CreateAccount' | 'SentConfirmEmail' | 'ConfirmEmail' | 'ConfirmEmailChange' | 'Pricing' | 'Settings' | 'AuthorizeDevice';

type PageMetaProps = {
	page: PageMetaKey;
	path: string;
};

const PageMeta = ({ page, path }: PageMetaProps) => {
	const { t } = useTranslation();

	const baseUrl = config.type.release === 'dev' ? config.links.URL_FRONTEND_DEV : config.links.URL_FRONTEND_PROD;
	const url = `${baseUrl}${path}`;
	const title = t(`meta.${page}.title`);
	const description = t(`meta.${page}.description`);
	const ogTitle = t(`meta.${page}.ogTitle`);

	return (
		<Helmet>
			<title>
				{title} - {t('label.web-title')}
			</title>
			<meta name="description" content={description} />
			<meta property="og:title" content={ogTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<link rel="canonical" href={url} />
		</Helmet>
	);
};

export default PageMeta;
