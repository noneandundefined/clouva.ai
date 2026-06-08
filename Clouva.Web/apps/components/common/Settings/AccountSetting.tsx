import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { GUInput } from '@/components/ui/Input/GUInput';
import { useHandleServer } from '@/hooks/Server/useHandleServer';
import { ValidationEmailSchema } from '@/utils/ValidationSchema';
import { basicUserLoginState, basicUserProfileUpdate } from '@/rest/userAPI';
import type { UserMeUpdateRequest } from '@/interface/user/userMeUpdateRequest.interface';

interface EmailChangeFormValues {
	email: string;
}

const AccountSetting = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { data: user, loading, reload } = useHandleServer(['respUserLoginState'], basicUserLoginState);

	const [showEmailChange, setShowEmailChange] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<UserMeUpdateRequest>({
		mode: 'onChange',
		defaultValues: {
			first_name: null,
			last_name: null,
		},
	});

	const emailForm = useForm<EmailChangeFormValues>({
		mode: 'onChange',
		defaultValues: {
			email: '',
		},
	});

	useEffect(() => {
		if (user) {
			reset({
				first_name: user.first_name,
				last_name: user.last_name,
			});
		}
	}, [user, reset]);

	const onSubmitProfile = handleSubmit(async (data) => {
		await basicUserProfileUpdate({
			first_name: data.first_name?.trim() || null,
			last_name: data.last_name?.trim() || null,
		});

		await reload();
		queryClient.invalidateQueries({ queryKey: ['respUserLoginState'] });
	});

	const onSubmitEmailChange = emailForm.handleSubmit(async (_) => {
		// await basicUserEmailChangeRequest(data.email.trim());
		setShowEmailChange(false);
		emailForm.reset();
	});

	if (loading && !user) {
		return (
			<div className="my-4 space-y-2">
				<p className="text-sm text-[#555]">{t('message.loading')}</p>
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div>
				<h2 className="text-md md:text-lg font-semibold">{t('label.settings-account')}</h2>
			</div>

			<form onSubmit={onSubmitProfile} className="bg-white border border-[#e5e7eb] rounded-[0.6rem] space-y-5 p-5">
				<div className="flex flex-col space-y-2 sm:flex-row sm:items-center">
					<div className="w-full sm:w-[40%] md:w-[50%] text-sm">
						<p>{t('label.email')}</p>
					</div>

					<div className="flex-1 space-y-2">
						<p className="text-sm">{user?.email}</p>

						{user?.can_change_email && !showEmailChange && (
							<button type="button" onClick={() => setShowEmailChange(true)} className="text-sm text-[#555] underline hover:text-[#111]">
								{t('label.settings-change-email')}
							</button>
						)}

						{user?.can_change_email && showEmailChange && (
							<div className="space-y-2">
								<p className="text-xs text-[#888]">{t('message.email-change-hint')}</p>

								<GUInput
									type="email"
									placeholder={t('label.settings-new-email')}
									className="!h-[2rem] !rounded-[6px]"
									{...emailForm.register('email', ValidationEmailSchema<EmailChangeFormValues, 'email'>(t))}
									error={emailForm.formState.errors.email?.message}
								/>

								<div className="flex gap-2">
									<button
										type="button"
										disabled={emailForm.formState.isSubmitting}
										onClick={onSubmitEmailChange}
										className="rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-[5px] text-[14px] text-[#111] transition hover:bg-[#fafafa] disabled:opacity-50"
									>
										{emailForm.formState.isSubmitting ? t('message.loading') : t('label.confirm')}
									</button>
									<button
										type="button"
										onClick={() => {
											setShowEmailChange(false);
											emailForm.reset();
										}}
										className="rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-[5px] text-[14px] text-[#555] transition hover:bg-[#fafafa]"
									>
										{t('label.close')}
									</button>
								</div>
							</div>
						)}
					</div>
				</div>

				<div className="flex flex-col space-y-2 sm:flex-row sm:items-center">
					<div className="w-full sm:w-[40%] md:w-[50%] text-sm">
						<p>{t('label.first-name')}</p>
					</div>

					<div className="flex-1">
						<GUInput
							type="text"
							className="!h-[2rem] !rounded-[6px]"
							{...register('first_name')}
							error={errors.first_name?.message}
						/>
					</div>
				</div>

				<div className="flex flex-col space-y-2 sm:flex-row sm:items-center">
					<div className="w-full sm:w-[40%] md:w-[50%] text-sm">
						<p>{t('label.last-name')}</p>
					</div>

					<div className="flex-1">
						<GUInput
							type="text"
							className="!h-[2rem] !rounded-[6px]"
							{...register('last_name')}
							error={errors.last_name?.message}
						/>
					</div>
				</div>

				<div className="mt-4 flex justify-end">
					<button
						type="submit"
						disabled={isSubmitting}
						className="rounded-[8px] border border-[#e6e6e6] bg-white px-3 py-[5px] text-[14px] text-[#111] transition hover:bg-[#fafafa] disabled:opacity-50"
					>
						{isSubmitting ? t('message.loading') : t('label.save')}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AccountSetting;
