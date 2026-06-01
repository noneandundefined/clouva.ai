import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GUInput } from '../ui/Input/GUInput';
import { useTranslation } from 'react-i18next';
import GUIButton from '../ui/Button/GUIButton';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/constants';
import InputPassword from '../ui/Input/InputPassword';
import { basicAuthCheck, basicAuthSignIn } from '@/rest/authAPI';
import { buildSentConfirmEmailPath } from '@/utils/SignupSearchParamsUtils';
import type { AuthSigninRequest } from '@/interface/auth/authSigninRequest.interface';
import { ValidationEmailSchema, ValidationPasswordSchema } from '@/utils/ValidationSchema';

type ModalAuthProps = {
	onSuccess?: () => void;
};

const ModalAuth: React.FC<ModalAuthProps> = ({ onSuccess }) => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const [showPassword, setShowPassword] = useState<boolean>(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<AuthSigninRequest>({
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmitSignin = async (data: AuthSigninRequest) => {
		const result = await basicAuthSignIn(data);

		onSuccess?.();

		if (result.status === 'sent') {
			navigate(`${ROUTES.AUTH_SENT_CONFIRM_EMAIL}?${buildSentConfirmEmailPath(data.email)}`);
			return;
		}

		navigate(ROUTES.HOME);
	};

	const onSubmitCheck = async (data: AuthSigninRequest) => {
		const response = await basicAuthCheck(data.email);

		if (response === 'signup') {
			const params = new URLSearchParams();

			params.set('email', data.email.trim());

			navigate(`${ROUTES.AUTH_CREATE_ACCOUNT}?${params.toString()}`);
			return;
		}

		setShowPassword(true);
	};

	return (
		<form className="space-y-5">
			<p className="flex justify-center text-[2rem]">{t('message.login-or-signup')}</p>

			<GUInput type="email" placeholder={t('label.email')} {...register('email', ValidationEmailSchema<AuthSigninRequest, 'email'>(t))} error={errors.email?.message} />

			{showPassword && <InputPassword placeholder={t('label.password')} {...register('password', ValidationPasswordSchema<AuthSigninRequest, 'password'>(t))} error={errors.password?.message} />}

			<GUIButton type="submit" onClick={handleSubmit(showPassword ? onSubmitSignin : onSubmitCheck)}>
				{t('label.continue')}
			</GUIButton>
		</form>
	);
};

export default ModalAuth;
