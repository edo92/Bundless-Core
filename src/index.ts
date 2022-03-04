import BundlerCore from './core';

interface Optionals {
    outDir?: string;
}

export interface CoreOptions extends Optionals {}

export default class Bundler extends BundlerCore {
    public readonly outDir: string;

    constructor(bundleOpts: CoreOptions) {
        super(bundleOpts);
        this.outDir = bundleOpts.outDir || 'bundle.out';
    }
}
