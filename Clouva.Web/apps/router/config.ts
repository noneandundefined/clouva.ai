import { lazy } from 'react';
import { ROUTES } from '@/constants/constants';
import type { JSX, LazyExoticComponent } from 'react';

/** Clouva */
const Clouva = lazy(() => import('@/pages/ClouvaPage/index'));
const Home = lazy(() => import('@/pages/HomePage/index'));
const Settings = lazy(() => import('@/pages/SettingsPage/index'));

/** Auth */
const ConfirmEmail = lazy(() => import('@/pages/ConfirmEmailPage/index'));
const AccountCreate = lazy(() => import('@/pages/AccountCreatePage/index'));
const AuthorizeDevice = lazy(() => import('@/pages/AuthorizeDevicePage/index'));
const SentConfirmEmail = lazy(() => import('@/pages/SentConfirmEmailPage/index'));

/** SUBs */
const Pricing = lazy(() => import('@/pages/PricingPage/index'));

export interface CustomRouteConfig {
	path: string;
	title?: string;
	loginRequired?: boolean;
	redirectIfLogged?: boolean;
	component: LazyExoticComponent<() => JSX.Element>;
}

const config: CustomRouteConfig[] = [
	/** CLOUVA */
	{
		path: ROUTES.HOME,
		loginRequired: false,
		redirectIfLogged: false,
		title: 'meta.Home.title',
		component: Home,
	},
	{
		path: ROUTES.CLOUVA,
		loginRequired: false,
		redirectIfLogged: false,
		title: 'meta.Clouva.title',
		component: Clouva,
	},
	{
		path: ROUTES.CLOUVA_SETTINGs,
		loginRequired: true,
		redirectIfLogged: false,
		title: 'meta.Settings.title',
		component: Settings,
	},
	/** AUTH */
	{
		path: ROUTES.AUTH_AUTHORIZE_DEVICE,
		loginRequired: false,
		redirectIfLogged: false,
		title: 'meta.AuthorizeDevice.title',
		component: AuthorizeDevice,
	},
	{
		path: ROUTES.AUTH_CREATE_ACCOUNT,
		loginRequired: false,
		redirectIfLogged: true,
		title: 'meta.CreateAccount.title',
		component: AccountCreate,
	},
	{
		path: ROUTES.AUTH_SENT_CONFIRM_EMAIL,
		loginRequired: false,
		redirectIfLogged: false,
		title: 'meta.SentConfirmEmail.title',
		component: SentConfirmEmail,
	},
	{
		path: ROUTES.AUTH_CONFIRM_EMAIL,
		loginRequired: false,
		redirectIfLogged: true,
		title: 'meta.ConfirmEmail.title',
		component: ConfirmEmail,
	},
	/** SUBs */
	{
		path: ROUTES.CLOUVA_PRICING,
		loginRequired: true,
		redirectIfLogged: false,
		title: 'meta.Pricing.title',
		component: Pricing,
	},
];

export default config;
