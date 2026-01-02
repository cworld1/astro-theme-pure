import { defineMiddleware } from "astro:middleware";
import { defaultLang, languages } from './i18n/ui';

export const onRequest = defineMiddleware((context, next) => {
    const pathname = context.url.pathname;

    // Check if the path is the root
    if (pathname === '/' || pathname === '') {
        const acceptLanguage = context.request.headers.get("accept-language");
        // Simple logic to match "zh" or "en"
        // If zh is present and weighted higher or first, use it.
        // This is a naive implementation.
        let preferredLang = defaultLang;

        if (acceptLanguage) {
            if (acceptLanguage.includes('zh')) {
                preferredLang = 'zh';
            }
        }

        return context.redirect(`/${preferredLang}`);
    }

    return next();
});
