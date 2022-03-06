#!/usr/bin/env node
const { Cli } = require('../dist/cli');
const { Bundler } = require('../dist/index.js');

const script = async () => {
    const { options } = new Cli();
    const bundler = new Bundler(options);
    await bundler.bundle();
};

script();