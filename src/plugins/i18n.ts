import i18n from 'i18next';
import resources from 'virtual:i18next-loader';

i18n.init({
	resources,
	fallbackLng: 'en',
	lng: 'en',
	preload: ['en'],
	defaultNS: 'translation',
});

export default i18n;
