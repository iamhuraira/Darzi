# Locales — Urdu & English

Dual-language setup using `i18next` and `react-i18next`.

- **en.json** — English
- **ur.json** — Urdu (اردو)

Usage: `const { t } = useTranslation(['auth', 'common']);` then `t('auth:welcomeBack')`.

Language is stored in Zustand (`useAppStore`) and persisted to AsyncStorage. Toggle via the language button on Login, Signup, and Home screens.
