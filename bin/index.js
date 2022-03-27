#!/usr/bin/env node
const { Bundler, Cli } = require('../dist');

(async function () {
    const cli = new Cli();
    const bundler = new Bundler(cli.values);
    await bundler.bundle();
})();
