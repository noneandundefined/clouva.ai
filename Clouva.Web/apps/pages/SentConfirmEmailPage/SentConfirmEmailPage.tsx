import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/constants';
import { basicAuthConfirmPending } from '@/rest/authAPI';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const SentConfirmEmailPage = () => {
	const { t } = useTranslation();
	const location = useLocation();

	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const [checking, setChecking] = useState(true);

	const email = (searchParams.get('email') || (location.state?.email as string | undefined))?.trim();

	useEffect(() => {
		let cancelled = false;

		const verifyAccess = async () => {
			if (!email) {
				navigate(ROUTES.HOME, { replace: true });
				return;
			}

			try {
				const { pending } = await basicAuthConfirmPending(email);
				if (cancelled) return;

				if (!pending) {
					navigate(ROUTES.HOME, { replace: true });
					return;
				}
			} catch {
				if (!cancelled) {
					navigate(ROUTES.HOME, { replace: true });
				}

				return;
			} finally {
				if (!cancelled) {
					setChecking(false);
				}
			}
		};

		verifyAccess();

		return () => {
			cancelled = true;
		};
	}, [email, navigate]);

	if (checking) {
		return (
			<main className="min-h-screen flex flex-col py-[1.5rem] md:py-[2rem] px-[1rem] md:px-[5rem]">
				<div className="h-full flex flex-1 items-center justify-center">
					<p className="text-sm text-gray-500">{t('message.loading')}</p>
				</div>
			</main>
		);
	}

	return (
		<main className="min-h-screen flex flex-col py-[1.5rem] md:py-[2rem] px-[1rem] md:px-[5rem]">
			<div className="h-full flex flex-1 items-center justify-center">
				<div className="flex flex-col items-center max-w-[25rem] w-full space-y-5">
					<img src="/Clouva.Icon.jpg" alt={t('label.web-title')} width="100px" />

					<p className="text-center font-medium text-[1.4rem]">{t('message.email-confirmation')}</p>
					<p className="text-center">{t('message.email-confirmation-link-sent')}</p>

					{email && <p className="text-center text-sm text-gray-600">{email}</p>}
				</div>
			</div>
		</main>
	);
};

export default SentConfirmEmailPage;
