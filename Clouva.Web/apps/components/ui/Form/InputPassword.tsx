import Eye from '@/components/@icons/eye';
import { forwardRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EyeOff from '@/components/@icons/eye-off';

interface InputPasswordProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
}

const InputPassword = forwardRef<HTMLInputElement, InputPasswordProps>(({ label, error, ...props }, ref) => {
	const { t } = useTranslation();

	const [showPassword, setShowPassword] = useState(false);

	return (
		<div className="w-full">
			<div className="relative">
				<input
					ref={ref}
					{...props}
					aria-invalid={!!error}
					type={showPassword ? 'text' : 'password'}
					className={`px-3 pr-10 ${error && 'border-red-500 focus:border-red-500'} ${props.className || ''}`}
				/>

				<span
					role="button"
					tabIndex={0}
					aria-label={showPassword ? t('label.hide-password') : t('label.show-password')}
					onClick={() => setShowPassword((prev) => !prev)}
					onKeyDown={(e) => e.key === 'Enter' && setShowPassword((prev) => !prev)}
					className="cursor-pointer absolute right-3 top-[50%] -translate-y-1/2"
				>
					{showPassword ? <EyeOff size={17} fill="#999" /> : <Eye size={17} fill="#999" />}
				</span>
			</div>

			{error && <span className="text-sm text-red-500">{error}</span>}
		</div>
	);
});

export default InputPassword;
