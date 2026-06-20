import { useEffect } from 'react';
import PageLayout from '../PageLayout';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/constants';
import { basicAuthSignUp } from '@/rest/authAPI';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InputPassword from '@/components/ui/Input/InputPassword';
import type { AuthSignupRequest } from '@/interface/auth/authSignupRequest.interface';
import { ValidationEmailSchema, ValidationPasswordSchema } from '@/utils/ValidationSchema';
import { buildSentConfirmEmailPath, readSignupFormFromSearchParams, writeSignupFormToSearchParams } from '@/utils/SignupSearchParamsUtils';

import { GUInput } from '@/components/ui/Input/GUInput';
import GUIButton from '@/components/ui/Button/GUIButton';

const AccountCreatePage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [searchParams, setSearchParams] = useSearchParams();

	const {
		register,
		setValue,
		watch,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthSignupRequest>({
		mode: 'onChange',
		defaultValues: {
			first_name: null,
			last_name: null,
			email: '',
			password: '',
		},
	});

	useEffect(() => {
		const fromUrl = readSignupFormFromSearchParams(searchParams);

		if (fromUrl.email) setValue('email', fromUrl.email);
		if (fromUrl.first_name) setValue('first_name', fromUrl.first_name);
		if (fromUrl.last_name) setValue('last_name', fromUrl.last_name);
	}, [searchParams, setValue]);

	useEffect(() => {
		const subscription = watch((values) => {
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev);
					writeSignupFormToSearchParams(next, values);
					return next;
				},
				{ replace: true }
			);
		});

		return () => subscription.unsubscribe();
	}, [watch, setSearchParams]);

	const onSubmit = async (data: AuthSignupRequest) => {
		await basicAuthSignUp(data);

		const query = buildSentConfirmEmailPath(data.email);
		navigate(`${ROUTES.AUTH_SENT_CONFIRM_EMAIL}?${query}`);
	};

	return (
		<PageLayout>
			<div className="h-full flex flex-1 items-center justify-center">
				<form className="flex flex-col max-w-[90%] sm:max-w-[22rem] w-full space-y-5">
					<p className="text-center font-medium text-[1.4rem]">{t('message.create-account')}</p>
					<p className="text-center text-[1rem]">{t('message.signup-hint')}</p>

					<GUInput type="email" placeholder={t('label.email')} {...register('email', ValidationEmailSchema<AuthSignupRequest, 'email'>(t))} error={errors.email?.message} />

					<div className="flex gap-4">
						<GUInput type="text" placeholder={t('label.first-name')} {...register('first_name')} error={errors.first_name?.message} />

						<GUInput type="text" placeholder={t('label.last-name')} {...register('last_name')} error={errors.last_name?.message} />
					</div>

					<InputPassword placeholder={t('label.password')} {...register('password', ValidationPasswordSchema<AuthSignupRequest, 'password'>(t))} error={errors.password?.message} />

					<GUIButton type="submit" onClick={handleSubmit(onSubmit)}>
						{t('label.continue')}
					</GUIButton>
				</form>
			</div>
		</PageLayout>
	);
};

export default AccountCreatePage;
