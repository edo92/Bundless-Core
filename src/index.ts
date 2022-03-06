import * as path from 'path';
import * as fs from 'fs-extra';
import BundlerCore, { CoreOptions } from './core';

export class Target {
    static NODE_12 = 'node12';
    static NODE_14 = 'node14';
}

export interface IBundler {
    buildAndArchive(zipName?: string): Promise<void>;
}

export class Bundler implements IBundler {
    private readonly outDir: string;

    constructor(private bundleOpts: CoreOptions) {
        this.outDir = bundleOpts.outDir || 'bundle.out';
    }

    private createOutDir(outDir: string): void {
        const exist = fs.existsSync(outDir);
        if (!exist) fs.mkdirSync(outDir);
    }

    private outFileDir(zipName?: string): string {
        this.createOutDir(this.outDir);
        const zipfile = zipName || 'archive.zip';
        return path.join(this.outDir, `${zipfile}.zip`);
    }

    public async buildAndArchive(zipName?: string): Promise<void> {
        const bundler = new BundlerCore(this.bundleOpts);

        const res = await bundler.build();
        const zip = await bundler.archive(res);
        bundler.writeFile(this.outFileDir(zipName), zip);
        fs.removeSync(bundler.tempdir);
    }
}
