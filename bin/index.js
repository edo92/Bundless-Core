#!/usr/bin/env node
const Bundler = require('../src');

const script = async () => {
    const bundler = new Bundler({
        entryPoints: ['lambdas/utilx'],
        outDir: 'bundler.out',
    });

    await bundler.buildAndArchive('utilx.zip');
};

script();
