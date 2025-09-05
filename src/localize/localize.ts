import * as en from './languages/en.json';
import * as es from './languages/es.json';
import * as fr from './languages/fr.json';
import * as de from './languages/de.json';
import * as pt from './languages/pt.json';
import * as nl from './languages/nl.json';

const languages: any = {
  en,
  es,
  fr,
  de,
  pt,
  nl,
};

export function localize(string: string, search = '', replace = ''): string {
  // Prefer HA-provided language; fall back to document html lang or navigator
  let lang = 'en';
  try {
    const root: any =
      (document.querySelector('home-assistant') as any) ||
      (document.querySelector('hc-main') as any) ||
      (document.querySelector('home-assistant-main') as any);
    const hass = root?.hass;
    lang = (hass?.locale?.language ||
      hass?.language ||
      document.documentElement?.lang ||
      navigator.language ||
      'en') as string;
  } catch (_e) {
    lang = (document.documentElement?.lang || navigator.language || 'en') as string;
  }
  const raw = String(lang).replace(/['"]+/g, '').replace('-', '_');
  const base = raw.split('_')[0];
  const dict = languages[raw] || languages[base] || languages['en'];

  let translated: string | undefined;
  try {
    translated = string.split('.').reduce((o: any, i: string) => o?.[i], dict);
  } catch (_e) {
    translated = undefined;
  }
  if (translated === undefined) {
    translated = string.split('.').reduce((o: any, i: string) => o?.[i], languages['en']);
  }
  if (typeof translated !== 'string') translated = string;

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}
