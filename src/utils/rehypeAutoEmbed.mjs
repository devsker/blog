function isElement(node, tagName) {
	return node?.type === 'element' && node.tagName === tagName;
}

const SKIP_LINKIFY_TAGS = new Set(['a', 'code', 'pre', 'script', 'style', 'textarea']);
const BARE_LINK_REGEX =
	/(^|[\s([{<'"])((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}(?:\/[^\s<]*)?)/gi;

function getTextContent(node) {
	if (!node?.children) {
		return '';
	}

	return node.children
		.map((child) => {
			if (child.type === 'text') {
				return child.value;
			}

			return getTextContent(child);
		})
		.join('');
}

function getYouTubeEmbed(url) {
	if (!['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)) {
		return null;
	}

	let videoId = null;

	if (url.hostname === 'youtu.be') {
		videoId = url.pathname.slice(1);
	} else if (url.pathname === '/watch') {
		videoId = url.searchParams.get('v');
	} else if (url.pathname.startsWith('/embed/')) {
		videoId = url.pathname.split('/')[2];
	} else if (url.pathname.startsWith('/shorts/')) {
		videoId = url.pathname.split('/')[2];
	}

	if (!videoId) {
		return null;
	}

	return {
		title: 'YouTube video player',
		src: `https://www.youtube.com/embed/${videoId}`,
	};
}

function getSpotifyEmbed(url) {
	if (!['open.spotify.com', 'spotify.link'].includes(url.hostname)) {
		return null;
	}

	if (url.hostname === 'spotify.link') {
		return null;
	}

	const [, type, id] = url.pathname.split('/');
	if (!id || !['playlist', 'album'].includes(type)) {
		return null;
	}

	return {
		title: `Spotify ${type}`,
		src: `https://open.spotify.com/embed/${type}/${id}?utm_source=generator`,
	};
}

function getEmbedData(href) {
	try {
		const url = new URL(href);
		return getYouTubeEmbed(url) ?? getSpotifyEmbed(url);
	} catch {
		return null;
	}
}

function createEmbedNode(embed) {
	return {
		type: 'element',
		tagName: 'div',
		properties: { className: ['auto-embed'] },
		children: [
			{
				type: 'element',
				tagName: 'iframe',
				properties: {
					className: ['auto-embed__frame'],
					src: embed.src,
					title: embed.title,
					loading: 'lazy',
					allow:
						'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
					allowfullscreen: true,
					referrerpolicy: 'strict-origin-when-cross-origin',
				},
				children: [],
			},
		],
	};
}

function stripTrailingPunctuation(value) {
	return value.replace(/[),.;!?]+$/g, '');
}

function isLinkifiableUrl(value) {
	if (!value || value.includes('@')) {
		return false;
	}

	try {
		const url = new URL(`https://${value}`);
		return url.hostname.includes('.');
	} catch {
		return false;
	}
}

function createLinkNode(value) {
	return {
		type: 'element',
		tagName: 'a',
		properties: {
			href: `https://${value}`,
		},
		children: [{ type: 'text', value }],
	};
}

function linkifyTextNode(node) {
	if (node.type !== 'text') {
		return [node];
	}

	const matches = Array.from(node.value.matchAll(BARE_LINK_REGEX));
	if (matches.length === 0) {
		return [node];
	}

	const children = [];
	let cursor = 0;

	for (const match of matches) {
		const [, prefix, matchedValue] = match;
		const matchStart = match.index + prefix.length;
		const rawValue = matchedValue ?? '';
		const linkValue = stripTrailingPunctuation(rawValue);
		const trailing = rawValue.slice(linkValue.length);
		const matchEnd = matchStart + rawValue.length;

		if (!linkValue || !isLinkifiableUrl(linkValue)) {
			continue;
		}

		if (match.index > cursor) {
			children.push({ type: 'text', value: node.value.slice(cursor, match.index) });
		}

		if (prefix) {
			children.push({ type: 'text', value: prefix });
		}

		children.push(createLinkNode(linkValue));

		if (trailing) {
			children.push({ type: 'text', value: trailing });
		}

		cursor = matchEnd;
	}

	if (children.length === 0) {
		return [node];
	}

	if (cursor < node.value.length) {
		children.push({ type: 'text', value: node.value.slice(cursor) });
	}

	return children;
}

function transformNode(node, parentTagName = null) {
	if (!node?.children) {
		return;
	}

	node.children = node.children.flatMap((child) => {
		transformNode(child, child.tagName ?? parentTagName);

		if (child.type === 'text' && !SKIP_LINKIFY_TAGS.has(parentTagName ?? '')) {
			return linkifyTextNode(child);
		}

		if (!isElement(child, 'p') || child.children.length !== 1) {
			return [child];
		}

		const [anchor] = child.children;
		if (!isElement(anchor, 'a')) {
			return [child];
		}

		const href = anchor.properties?.href;
		if (typeof href !== 'string') {
			return [child];
		}

		const text = getTextContent(anchor).trim();
		if (text !== href.trim()) {
			return [child];
		}

		const embed = getEmbedData(href);
		if (!embed) {
			return [child];
		}

		return [createEmbedNode(embed)];
	});
}

export default function rehypeAutoEmbed() {
	return function transformer(tree) {
		transformNode(tree);
	};
}
