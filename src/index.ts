import Archive from './lib/archive';
import { Tempdir } from './lib/tempdir';
import { Installer } from './lib/installer';
import Builder, { BuilderOptions } from './lib/build';
import path from 'path';

interface BundlerOpts extends BuilderOptions {
    name: string;
}

export interface IBundler {
    bundle(): void;
}

export class Bundler implements IBundler {
    /**
     *
     * Path to temporary directory
     */
    private tempdir: Tempdir;

    /**
     *
     * Outfile name as zip file <name>.zip
     */
    private get outfile(): string {
        return this.opts.name || 'archive';
    }

    /**
     *
     * Directory where zip file will endup
     */
    private get outdir(): string {
        return this.opts.outdir || 'bundle.out';
    }

    /**
     *
     * Archived file absolute path
     */
    public get filepath(): string {
        const outfile = `${this.outfile}.zip`;
        return path.join(this.outdir, outfile);
    }

    /**
     *
     * Bundler instance
     * Init temporary directory control
     */
    constructor(private opts: BundlerOpts) {
        this.tempdir = new Tempdir(opts.entry);
        this.tempdir.create(this.outdir).copy();
    }

    /**
     *
     * Bundler logic
     */
    public bundle(): void {
        // Install dps if package.json exist
        Installer(this.tempdir.dirpath);

        // Build and return bundle string
        const build = Builder({
            ...this.opts,
            entry: this.tempdir.dirpath,
        });

        // Archive build outdir
        Archive({
            outdir: this.outdir,
            zipFilename: this.outfile,
            content: build.bundle,
        });

        // Delete temporary directory
        this.tempdir.delete();
    }
}
