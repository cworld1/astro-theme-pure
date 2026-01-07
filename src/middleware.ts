import { defineMiddleware } from "astro:middleware";
import { defaultLang, languages } from './i18n/ui';

export const onRequest = defineMiddleware((context, next) => {
    const pathname = context.url.pathname;

    // Common language detection logic
    const acceptLanguage = context.request.headers.get("accept-language");
    let preferredLang = defaultLang;
    if (acceptLanguage && acceptLanguage.includes('zh')) {
        preferredLang = 'zh';
    }

    // Check if the path is the root
    if (pathname === '/' || pathname === '') {
        return context.redirect(`/${preferredLang}`);
    }

    // Check if the path is /blog or /blog/...
    if (pathname === '/blog' || pathname.startsWith('/blog/')) {
        return context.redirect(`/${preferredLang}${pathname}`);
    }

    return next();
});
