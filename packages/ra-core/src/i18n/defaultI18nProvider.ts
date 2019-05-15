import defaultMessages from 'ra-language-english';
import { I18nProvider } from '../types';

const defaultI18nProvider: I18nProvider = locale => defaultMessages;

export default defaultI18nProvider;
