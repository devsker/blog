import { createServer } from 'node:http';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const basePath = '/blog';
const outputRelativePath = 'og/homepage-og.png';
const outputDistPath = path.join(distDir, outputRelativePath);
const outputPublicPath = path.join(projectRoot, 'public', outputRelativePath);

const CONTENT_TYPES = {
	'.css': 'text/css; charset=utf-8',
	'.gif': 'image/gif',
	'.html': 'text/html; charset=utf-8',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.js': 'application/javascript; charset=utf-8',
	'.json': 'application/json; charset=utf-8',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.txt': 'text/plain; charset=utf-8',
	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
};

function resolveDistPath(urlPathname) {
	if (urlPathname === basePath || urlPathname === `${basePath}/`) {
		return path.join(distDir, 'index.html');
	}

	if (!urlPathname.startsWith(`${basePath}/`)) {
		return null;
	}

	const withoutBase = urlPathname.slice(basePath.length);
	const normalizedPath = withoutBase.replace(/^\//, '');
	const requestedPath = path.join(distDir, normalizedPath);
	return requestedPath;
}

async function readStaticFile(filePath) {
	const fileStats = await stat(filePath);
	if (fileStats.isDirectory()) {
		return readFile(path.join(filePath, 'index.html'));
	}
	return readFile(filePath);
}

function getContentType(filePath) {
	const extension = path.extname(filePath).toLowerCase();
	return CONTENT_TYPES[extension] ?? 'application/octet-stream';
}

async function main() {
	const server = createServer(async (req, res) => {
		try {
			const requestURL = new URL(req.url ?? '/', 'http://localhost');
			const resolvedPath = resolveDistPath(requestURL.pathname);
			if (!resolvedPath) {
				res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
				res.end('Not found');
				return;
			}

			const fileContents = await readStaticFile(resolvedPath);
			res.writeHead(200, { 'content-type': getContentType(resolvedPath) });
			res.end(fileContents);
		} catch {
			res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
			res.end('Not found');
		}
	});

	await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
	const address = server.address();
	if (!address || typeof address === 'string') {
		server.close();
		throw new Error('Failed to start local preview server for OG generation.');
	}

	const homepageURL = `http://127.0.0.1:${address.port}${basePath}/`;
	const browser = await chromium.launch({ headless: true });

	try {
		const context = await browser.newContext({
			colorScheme: 'dark',
			viewport: {
				width: 1200,
				height: 630,
			},
		});
		const page = await context.newPage();

		await page.goto(homepageURL, { waitUntil: 'networkidle' });
		await page.evaluate(() => {
			document.documentElement.style.zoom = '2';
		});
		await page.waitForTimeout(250);

		await mkdir(path.dirname(outputDistPath), { recursive: true });
		await page.screenshot({ path: outputDistPath, type: 'png' });

		await mkdir(path.dirname(outputPublicPath), { recursive: true });
		const generatedImage = await readFile(outputDistPath);
		await writeFile(outputPublicPath, generatedImage);
		await context.close();
	} finally {
		await browser.close();
		await new Promise((resolve) => server.close(resolve));
	}
}

main().catch((error) => {
	console.error('[og] Failed to generate homepage OG image.');
	console.error(error instanceof Error ? error.message : error);
	process.exit(1);
});
