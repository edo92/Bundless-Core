import path from 'path';
import fse from 'fs-extra';
import BundlerCore, { CoreOptions } from './core';

export class Target {
    static NODE_12 = 'node12';
    static NODE_14 = 'node14';
}

export default class Bundler {
    public readonly outDir: string;

    constructor(private bundleOpts: CoreOptions) {
        this.outDir = bundleOpts.outDir || 'bundle.out';
    }

    private outFileDir(zipName?: string): string {
        this.deleteAndCreate(this.outDir);
        const zipfile = zipName || 'archive.zip';
        return path.join(this.outDir, zipfile);
    }

    private deleteAndCreate(outDir: string): void {
        const exist = fse.existsSync(outDir);
        if (exist) fse.removeSync(outDir);
        fse.mkdirSync(outDir);
    }

    public async buildAndArchive(zipName?: string): Promise<void> {
        const bundler = new BundlerCore(this.bundleOpts);
        const res = await bundler.build();
        const zip = await bundler.archive(res.bundle);
        bundler.writeFile(this.outFileDir(zipName), zip);
    }
}
