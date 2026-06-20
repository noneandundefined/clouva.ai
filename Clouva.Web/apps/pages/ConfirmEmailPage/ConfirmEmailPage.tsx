import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { basicAuthConfirmEmail } from '@/rest/authAPI';
import { CACHEKEYs } from '@/constants/CacheKeys.constants';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { clearRedirectUrl, getRedirectUrl } from '@/utils/ReturnUrlUtils';

type errorTypeConfirm = 'invalid' | 'error';

const ConfirmEmailPage = () => {
	const { t } = useTranslation();

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [isProcessing, setIsProcessing] = useState(true);
	const [errorTypeConfirm, setErrorTypeConfirm] = useState<errorTypeConfirm>();

	useEffect(() => {
		const confirmEmail = async () => {
			try {
				const exp = searchParams.get('exp');
				const sig = searchParams.get('sig');
				const uuid = searchParams.get('uuid');

				if (!exp || !sig || !uuid) {
					setErrorTypeConfirm('invalid');
					setIsProcessing(false);
					return;
				}

				const response = await basicAuthConfirmEmail(exp, sig, uuid);
				if (response.status === 'success') {
					localStorage.setItem(CACHEKEYs.L_SESSION, response.message);

					const returnUrl = searchParams.get('returnUrl') ?? getRedirectUrl();

					if (returnUrl) {
						clearRedirectUrl();
						navigate(returnUrl, { replace: true });
						return;
					}

					navigate('/', { replace: true });
					return;
				}

				setErrorTypeConfirm(response.status === 'invalid' ? 'invalid' : 'error');
			} catch {
				setErrorTypeConfirm('error');
			} finally {
				setIsProcessing(false);
			}
		};

		confirmEmail();
	}, [navigate, searchParams]);

	return (
		<main className="min-h-screen flex items-center justify-center px-4">
			{/* {isProcessing && <p>{t('message.confirm-email-processing')}</p>} */}

			{!isProcessing && errorTypeConfirm === 'invalid' && <p>{t('message.mail-confirmation')}</p>}

			{!isProcessing && errorTypeConfirm === 'error' && <p>{t('message.something-went-wrong')}</p>}
		</main>
	);
};

export default ConfirmEmailPage;
