import path from 'path';
import fse from 'fs-extra';
import { CoreOptions } from './core';

export class Target {
    static NODE_12 = 'node12';
    static NODE_14 = 'node14';
}

export default class Bundler {
    public readonly outDir: string;

    constructor(private bundleOpts: CoreOptions) {
        this.outDir = bundleOpts.outDir || 'bundle.out';
    }

    public outFileDir(zipName?: string): string {
        this.deleteAndCreate(this.outDir);
        const zipfile = zipName || 'archive.zip';
        return path.join(this.outDir, zipfile);
    }

    public deleteAndCreate(outDir: string): void {
        const exist = fse.existsSync(outDir);
        if (exist) fse.removeSync(outDir);
        fse.mkdirSync(outDir);
    }
}
