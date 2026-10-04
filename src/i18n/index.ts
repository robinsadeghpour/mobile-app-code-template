import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';
import de from './de.json';
import en from './en.json';

const localesMap = { en, de };

export const i18n = new I18n(localesMap);

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const systemLocale = getLocales()[0]?.languageCode;
i18n.locale = systemLocale && systemLocale in localesMap ? systemLocale : i18n.defaultLocale;
