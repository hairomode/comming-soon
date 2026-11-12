import type { PageContextServer } from 'vike/types';
import { escapeInject, dangerouslySkipEscape } from 'vike/server';
import { renderVerifyDocument } from '../../../src/certificate';
import { loadVerifyMessages } from '../../../src/verify-messages';

/** Unprefixed `/v/:id` — the URL printed on the PDF QR code; always English. */
export async function onRenderHtml(pageContext: PageContextServer) {
  const { id } = pageContext.routeParams as { id: string };
  const base = import.meta.env.BASE_URL || '/';
  const messages = await loadVerifyMessages('en');
  const html = renderVerifyDocument(id, 'en', base, messages);
  return escapeInject`<!DOCTYPE html>${dangerouslySkipEscape(html)}`;
}
