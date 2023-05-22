import ru from './language-russian';
import en from './language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';

export const i18nProvider = polyglotI18nProvider(locale => 
    locale === 'ru' ? ru : en,
    'ru', // Default locale
    [
        { locale: 'en', name: 'English' },
        { locale: 'ru', name: 'Русский' }
    ],
   { allowMissing: true }
);