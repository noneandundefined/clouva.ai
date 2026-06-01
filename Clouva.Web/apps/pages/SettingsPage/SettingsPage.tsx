import PageLayout from '../PageLayout';
import MoreSetting from '@/components/common/Settings/MoreSetting';
import AccountSetting from '@/components/common/Settings/AccountSetting';
import BillingSetting from '@/components/common/Settings/BillingSetting';
import DevicesSetting from '@/components/common/Settings/DevicesSetting';

const SettingsPage = () => {
	return (
		<PageLayout>
			<div className="space-y-5 pb-5">
				<AccountSetting />
				<BillingSetting />
				<DevicesSetting />
				<MoreSetting />
			</div>
		</PageLayout>
	);
};

export default SettingsPage;
