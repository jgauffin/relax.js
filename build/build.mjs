import * as esbuild from 'esbuild';

const sharedConfig = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: false,
    external: [] //Object.keys(dependencies).concat(Object.keys(peerDependencies)),
};

esbuild.build({
    ...sharedConfig,
    platform: 'node', // for CJS
    outfile: 'dist/index.js'
});

esbuild.build({
    ...sharedConfig,
    outfile: 'dist/index.esm.js',
    platform: 'neutral', // for ESM
    format: 'esm'
});

esbuild.build({
    ...sharedConfig,
    outfile: 'dist/browser.js',
    platform: 'neutral', // for ESM
    format: 'iife'
});
