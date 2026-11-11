import vikeReact from 'vike-react/config';
import type { Config } from 'vike/types';
export default {
  extends: [vikeReact],
  prerender: true,
  clientRouting: false,
  trailingSlash: true,
  title: 'AI Powerup',
  prefetchStaticAssets: false,
} satisfies Config;
