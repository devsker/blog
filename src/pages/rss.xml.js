import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');
	const basePath = import.meta.env.BASE_URL;
	const withBase = (path) => `${basePath.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: new URL(withBase('/'), context.site),
		items: posts.map((post) => ({
			...post.data,
			link: `posts/${post.id}/`,
		})),
	});
}
