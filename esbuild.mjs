import * as esbuild from 'esbuild';
import { mkdir } from 'fs/promises';

const isWatch = process.argv.includes('--watch');

/** @type {import('esbuild').BuildOptions} */
const extensionBuildOptions = {
	entryPoints: ['src/extension.ts'],
	bundle: true,
	outfile: 'out/extension.js',
	platform: 'node',
	format: 'cjs',
	external: ['vscode'],
	sourcemap: isWatch,
	minify: !isWatch,
	target: 'es2017',
	logLevel: 'info',
	tsconfig: 'src/tsconfig.json',
};

/** @type {import('esbuild').BuildOptions} */
const webviewBuildOptions = {
	entryPoints: ['web/main.ts'],
	bundle: true,
	outfile: 'media/out.min.js',
	platform: 'browser',
	format: 'iife',
	sourcemap: isWatch,
	minify: !isWatch,
	target: 'es2017',
	loader: { '.css': 'css' },
	logLevel: 'info',
	tsconfig: 'web/tsconfig.json',
};

async function build() {
	await Promise.all([
		mkdir('out', { recursive: true }),
		mkdir('media', { recursive: true }),
	]);

	if (isWatch) {
		const extensionCtx = await esbuild.context(extensionBuildOptions);
		const webviewCtx = await esbuild.context(webviewBuildOptions);
		await Promise.all([extensionCtx.watch(), webviewCtx.watch()]);
		console.log('[watch] watching for changes...');
	} else {
		await Promise.all([
			esbuild.build(extensionBuildOptions),
			esbuild.build(webviewBuildOptions),
		]);
	}
}

build().catch((error) => {
	console.error(error);
	process.exit(1);
});
