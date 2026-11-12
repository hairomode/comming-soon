import type { PageContextServer } from 'vike/types';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import { renderVerifyDocument } from '../../src/certificate';
import { loadVerifyMessages } from '../../src/verify-messages';
import type { Locale } from '../../src/localization';

export async function onRenderHtml(pageContext: PageContextServer) {
  const { locale, id } = pageContext.routeParams as { locale: Locale; id: string };
  const base = import.meta.env.BASE_URL || '/';
  const messages = await loadVerifyMessages(locale);
  const html = renderVerifyDocument(id, locale, base, messages);
  return escapeInject`<!DOCTYPE html>${dangerouslySkipEscape(html)}`;
}
