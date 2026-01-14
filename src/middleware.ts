import { defineMiddleware } from "astro:middleware";
import { defaultLang } from './i18n/ui';

export const onRequest = defineMiddleware((context, next) => {
    const pathname = context.url.pathname;

    // Common language detection logic
    // Only check headers if we are going to perform a locale-dependent redirect
    // This avoids "Astro.request.headers" warnings on prerendered pages

    // Check if the path is the root
    if (pathname === '/' || pathname === '') {
        const acceptLanguage = context.request.headers.get("accept-language");
        let preferredLang = defaultLang;
        if (acceptLanguage && acceptLanguage.includes('zh')) {
            preferredLang = 'zh';
        }
        return context.redirect(`/${preferredLang}`);
    }

    // Check if the path is /blog or /blog/... (unlocalized)
    if (pathname === '/blog' || pathname.startsWith('/blog/')) {
        const acceptLanguage = context.request.headers.get("accept-language");
        let preferredLang = defaultLang;
        if (acceptLanguage && acceptLanguage.includes('zh')) {
            preferredLang = 'zh';
        }
        return context.redirect(`/${preferredLang}${pathname}`);
    }

    return next();
});
