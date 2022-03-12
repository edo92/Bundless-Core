import path from 'path';
import { Archive } from './lib/archive';
import { Tempdir } from './lib/tempdir';
import { Installer } from './lib/installer';
import { Builder, BuilderOptions, IBundle } from './lib/build';

interface BundlerOpts extends BuilderOptions {
    name?: string;
    entry: string;
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

    public bundle(): void {
        this.install();
        const build = this.build();
        this.archive(build.bundle);
        this.tempdir.delete();
    }

    private install(): void {
        const installer = new Installer();
        installer.install(this.tempdir.dirpath);
    }

    private build(): IBundle {
        const builder = new Builder(this.opts);
        return builder.build(this.tempdir.dirpath);
    }

    private archive(bundle: string): void {
        new Archive({
            outdir: this.outdir,
            zipFilename: this.outfile,
        }).archive(bundle);
    }
}
