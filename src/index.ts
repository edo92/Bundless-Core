import * as path from 'path';
import { Tempdir } from './lib/tempdir';
import Builder, { BuilderOptions } from './lib/build';
import Archive from './lib/archive';
import Installer from './lib/installer';

interface BundlerOpts extends BuilderOptions {
    name: string;
}

export class Bundler {
    private tempdir: Tempdir;

    private get outfile(): string {
        return this.opts.name || 'archive';
    }

    private get outdir(): string {
        return this.opts.outdir || 'bundle.out';
    }

    constructor(private opts: BundlerOpts) {
        this.tempdir = new Tempdir(opts.entry);
        this.tempdir.create(this.outdir).copy();
    }

    public async bundle(): Promise<void> {
        // Install dps if package.json exist
        await Installer({ tempdir: this.tempdir.dirpath });

        // Build and return bundle string
        const build = await Builder({
            ...this.opts,
            entry: this.tempdir.dirpath,
        });

        // Archive build outdir
        await Archive({
            outdir: this.outdir,
            zipFilename: this.outfile,
            content: build.bundle,
        });

        // Delete temporary directory
        this.tempdir.delete();
    }
}

new Bundler({
    name: 'mymodulename',
    outdir: 'bundle.out',
    entry: path.resolve('test/mock/module'),
}).bundle();
