import { useState } from 'react';
import Modal from '../Modal/Modal';
import MenuHeader from './MenuHeader';
import { Link } from 'react-router-dom';
import ModalAuth from '../Modal/ModalAuth';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/constants';
import { basicUserLoginState } from '@/rest/userAPI';
import { useModalContext } from '@/context/useModalContext';
import { useHandleServer } from '@/hooks/Server/useHandleServer';
import { GITHUB_NAME_APP, GITHUB_SOURCE_CODE } from '@/constants/CompanyInfo.constants';

interface HeaderProps {
    showLogin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ showLogin = true }) => {
    const { t } = useTranslation();
    const { open } = useModalContext();

    const [openMenu, setOpenMenu] = useState<boolean>(false);

    const { data: respUserLoginState } = useHandleServer(['respUserLoginState'], basicUserLoginState);

    return (
        <header className="sticky top-0 z-50 shrink-0 h-[70px] w-full flex items-center justify-between text-md bg-[#f7f7f7]">
            {respUserLoginState && respUserLoginState.first_name ? (
                <div className="relative">
                    <div
                        className="cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu((prev) => !prev);
                        }}
                    >
                        <p>{`${respUserLoginState.first_name} ${respUserLoginState.last_name}`}</p>
                    </div>

                    {openMenu && respUserLoginState && <MenuHeader close={() => setOpenMenu(false)} user={respUserLoginState} />}
                </div>
            ) : (
                <Link to={ROUTES.CLOUVA} className="cursor-pointer">
                    {t('label.web-title')}
                </Link>
            )}

            <div className="flex items-center gap-[1.5rem] lg:gap-[3rem] text-sm font-normal">
                <a href={GITHUB_SOURCE_CODE} target="_blank" rel="noopener noreferrer" className="hidden sm:block text-[#777] hover:text-black cursor-pointer">{t('label.source-code')}</a>
                <Link to={ROUTES.CLOUVA_PRICING} className="text-[#777] hover:text-black cursor-pointer">
                    {t('label.subscriptions')}
                </Link>
                <a
                    href={`${GITHUB_SOURCE_CODE}/releases/latest/download/${GITHUB_NAME_APP}.exe`}
                    className="hidden sm:block text-[#777] hover:text-black cursor-pointer"
                >
                    {t('label.download-app')}
                </a>
            </div>

            {showLogin && !respUserLoginState && (
                <div className="flex items-center gap-3">
                    <div
                        className="bg-[#000000] hover:bg-[#373737] p-1 px-3 rounded-full active:scale-90 cursor-pointer"
                        onClick={() => {
                            open(
                                <Modal width="450px">
                                    <ModalAuth />
                                </Modal>
                            );
                        }}
                    >
                        <p className="text-sm text-white">{t('label.signin')}</p>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
