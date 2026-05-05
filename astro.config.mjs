// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeAutoEmbed from './src/utils/rehypeAutoEmbed.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.sker.lol',
	base: '/',
	integrations: [mdx(), sitemap()],
	markdown: {
		rehypePlugins: [rehypeAutoEmbed],
	},
});
