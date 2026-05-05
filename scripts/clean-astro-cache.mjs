import { existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const cacheDirs = ['.astro', 'node_modules/.astro'];

for (const dir of cacheDirs) {
	const target = resolve(process.cwd(), dir);
	if (existsSync(target)) {
		rmSync(target, { recursive: true, force: true });
	}
}
