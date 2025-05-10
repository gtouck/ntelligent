// index.js

import { createI18n } from 'vue-i18n';
import elEnLocale from 'element-plus/es/locale/lang/en';
import elZhLocale from 'element-plus/es/locale/lang/zh-cn';
import enLocale from './en';
import zhLocale from './zh-cn';

import { useStore } from 'vuex';

const messages = {
  en: {
    ...enLocale,
    ...elEnLocale,
  },
  'zh-cn': {
    ...zhLocale,
    ...elZhLocale,
  },
};

export const getLocale = () => {
  // 获取缓存
  const storLanguage = localStorage.getItem('language');
  // 存在返回当前语言
  if (storLanguage) return storLanguage;
  // 不存在 获取系统语言
  const language = (navigator.language || navigator.browserLanguage).toLowerCase();
  const locales = Object.keys(messages);
  for (const locale of locales) {
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }

  // 默认返回简体中文
  return 'zh-cn';
};
const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: getLocale(),
  messages: messages,
});
export default i18n;
