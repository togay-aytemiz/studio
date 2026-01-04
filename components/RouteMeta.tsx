import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type MetaConfig = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogLocale: string;
  ogImage: string;
};

type RouteMetaConfig = {
  home: MetaConfig;
  validate: MetaConfig;
};

const META_BY_LANG: Record<'tr' | 'en', RouteMetaConfig> = {
  tr: {
    home: {
      title: 'Agens | Ürün odaklı web, mobil ve AI tabanlı yazılımlar',
      description: 'Agens, girişimciler, startup ekipleri ve yazılım ekibi olmayan KOBİ’ler için web, mobil ve AI tabanlı yazılımlar geliştirir.',
      ogTitle: 'Agens – Yazılım geliştirme partneriniz',
      ogDescription: 'Web, mobil ve AI tabanlı yazılımlar geliştiriyoruz. Fikri olan girişimciler ve ekipler için sağlam ürünler.',
      ogLocale: 'tr_TR',
      ogImage: 'https://www.agens.studio/OG.webp'
    },
    validate: {
      title: 'Fikir Doğrulama | AI destekli teknik fizibilite – Agens',
      description: 'Fikrini yaz, AI destekli fikir asistanı teknik fizibiliteyi, MVP kapsamını ve geliştirme yol haritasını analiz etsin.',
      ogTitle: 'AI Fikir Asistanı – Fikrini doğrula',
      ogDescription: 'Fikrini yaz, AI destekli sistem teknik fizibiliteyi, MVP süresini ve geliştirme aşamalarını analiz etsin.',
      ogLocale: 'tr_TR',
      ogImage: 'https://www.agens.studio/og-validate-tr.webp'
    }
  },
  en: {
    home: {
      title: 'Agens | Product focused web, mobile and AI powered software',
      description: 'Agens is a boutique technology partner building web, mobile, and AI powered software for entrepreneurs and startups.',
      ogTitle: 'Agens – Your software development partner',
      ogDescription: 'We build web, mobile, and AI powered software for entrepreneurs, startups, and teams without in house developers.',
      ogLocale: 'en_US',
      ogImage: 'https://www.agens.studio/OG-en.webp'
    },
    validate: {
      title: 'Idea Validation | AI powered technical feasibility – Agens',
      description: 'Describe your idea and get an AI powered technical feasibility, MVP scope, and development roadmap.',
      ogTitle: 'AI Idea Validator – Validate your product idea',
      ogDescription: 'Describe your idea and get an AI powered analysis including technical feasibility, MVP scope, and next steps.',
      ogLocale: 'en_US',
      ogImage: 'https://www.agens.studio/og-validate-en.webp'
    }
  }
};

const upsertMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
  let element = document.head.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const upsertLinkTag = (rel: string, href: string) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
};

const RouteMeta = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  const isEnglishRoute = location.pathname.startsWith('/en');
  const isValidateRoute = location.pathname.endsWith('/validate');
  const lang = isEnglishRoute ? 'en' : 'tr';
  const meta = isValidateRoute ? META_BY_LANG[lang].validate : META_BY_LANG[lang].home;
  const canonical = `https://www.agens.studio${location.pathname === '/' ? '' : location.pathname}`;

  useEffect(() => {
    const currentLang = (i18n.resolvedLanguage || i18n.language || 'tr').split('-')[0];
    if (currentLang !== lang) {
      i18n.changeLanguage(lang);
    }
    document.documentElement.lang = lang;
  }, [i18n, lang]);

  useEffect(() => {
    document.title = meta.title;
    upsertMetaTag('name', 'description', meta.description);
    upsertMetaTag('property', 'og:title', meta.ogTitle);
    upsertMetaTag('property', 'og:description', meta.ogDescription);
    upsertMetaTag('property', 'og:locale', meta.ogLocale);
    upsertMetaTag('property', 'og:url', canonical);
    upsertMetaTag('property', 'og:image', meta.ogImage);
    upsertMetaTag('name', 'twitter:title', meta.ogTitle);
    upsertMetaTag('name', 'twitter:description', meta.ogDescription);
    upsertMetaTag('name', 'twitter:image', meta.ogImage);
    upsertLinkTag('canonical', canonical);
  }, [canonical, meta]);

  return null;
};

export default RouteMeta;
