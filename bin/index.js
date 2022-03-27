#!/usr/bin/env node
const { Cli } = require('../dist/cli');
const { Bundler } = require('../dist/index.js');

(async function () {
    const cli = new Cli();
    const bundler = new Bundler(cli.values);
    await bundler.bundle();
})();
