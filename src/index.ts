import path from 'path';
import Archive from './lib/archive';
import Builder, { BuilderSpecs, IBuild } from './lib/build';
import Directory, { IDirectory } from './lib/directory';
import Installer from './lib/installer';

export interface IBundler {
    /**
     *
     * absolute path
     * location where bundle is stored
     */
    readonly location: string;

    /**
     *
     * ection to bundle source
     */
    bundle(): void;
}

export interface BundlerOpts {
    /**
     *
     * bundle name that produce <name.zip>
     */
    name?: string;

    /**
     *
     * entry directory to source code
     */
    entry: string;

    /**
     *
     * out directory name where bundle stored
     */
    outdir?: string;

    /**
     *
     * builder options only for builder lib
     */
    readonly builder?: BuilderSpecs;
}

enum Defaults {
    outfile = 'archive',
    outdir = 'bundle.out',
}

export class Bundler implements IBundler {
    public tempDirectory: IDirectory;

    private get outdir(): string {
        return this.opts.outdir || Defaults.outdir;
    }

    private get outfile(): string {
        return this.opts.name || Defaults.outfile;
    }

    private get entryPath(): string {
        path.resolve(this.opts.entry);
        return this.opts.entry;
    }

    public get location(): string {
        const outfile = `${this.outfile}.zip`;
        return path.join(this.outdir, outfile);
    }

    constructor(private readonly opts: BundlerOpts) {
        this.directory();
    }

    public bundle(): void {
        this.install();
        const build = this.build();
        this.archive(build.bundle);
        this.tempDirectory.delete();
    }

    private install(): void {
        new Installer({
            entry: this.tempDirectory.location,
        }).install();
    }

    private build(): IBuild {
        return new Builder({
            outdir: this.outdir,
            ...this.opts.builder,
        }).build(this.tempDirectory.location);
    }

    private archive(bundle: string): void {
        new Archive({
            outdir: this.outdir,
            zipFilename: this.outfile,
        }).archive(bundle);
    }

    private directory(): void {
        this.tempDirectory = new Directory({
            outdir: this.outdir,
            entry: this.entryPath,
        });
        this.tempDirectory.create().copy();
    }
}
