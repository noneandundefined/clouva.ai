import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locale/languages/en-us.json';
import ru from '@/locale/languages/ru-ru.json';

const resources = {
	en: {
		translation: en,
	},
	ru: {
		translation: ru,
	},
};

const savedLang = localStorage.getItem('lang');
const browserLang = navigator.language.slice(0, 2);
const defaultLang = 'en';

i18n.use(initReactI18next).init({
	resources,
	lng: savedLang || (['en', 'ru'].includes(browserLang) ? browserLang : defaultLang),
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
