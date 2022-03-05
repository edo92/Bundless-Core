import * as path from 'path';
import * as fse from 'fs-extra';
import BundlerCore, { CoreOptions } from './core';

export class Target {
    static NODE_12 = 'node12';
    static NODE_14 = 'node14';
}

export interface IBundler {
    buildAndArchive(zipName?: string): Promise<void>;
}

export default class Bundler implements IBundler {
    private readonly outDir: string;

    constructor(private bundleOpts: CoreOptions) {
        this.outDir = bundleOpts.outDir || 'bundle.out';
    }

    private createOutDir(outDir: string): void {
        const exist = fse.existsSync(outDir);
        if (!exist) fse.mkdirSync(outDir);
    }

    private outFileDir(zipName?: string): string {
        this.createOutDir(this.outDir);
        const zipfile = zipName || 'archive.zip';
        return path.join(this.outDir, zipfile);
    }

    public async buildAndArchive(zipName?: string): Promise<void> {
        const bundler = new BundlerCore(this.bundleOpts);
        const res = await bundler.build();
        const zip = await bundler.archive(res.bundle);
        bundler.writeFile(this.outFileDir(zipName), zip);
    }
}
