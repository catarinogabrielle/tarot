import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { en, pt, es } from './translations';

const resources = {
    en_US: {
        translation: en,
    },
    pt_BR: {
        translation: pt,
    },
    es_ES: {
        translation: es,
    }
}

i18next.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    debug: false,
    lng: 'pt_BR',
    fallbackLng: 'en_US',
    resources,
})

export default i18next;