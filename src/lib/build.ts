import * as fs from 'fs-extra';
import * as esTypes from 'esbuild';
import { buildSync } from 'esbuild';

export interface IBundle {
    bundle: string;
}

export interface BuilderOpts {
    outdir?: string;
    bundle?: boolean;
    minify?: boolean;
    external?: string[];
    format?: esTypes.Format;
    platform?: esTypes.Platform;
    logLevel?: esTypes.LogLevel;
    target?: 'node12' | 'node14' | 'esndext';
}

export interface IBuilder {
    build(entry: string): IBundle;
}

class Defaults {
    static minify: boolean = true;
    static bundle: boolean = true;
    static target: string = 'node14';
    static outdir: string = 'bundle.out';
    static format: esTypes.Format = 'cjs';
    static platform: esTypes.Platform = 'node';
    static logLevel: esTypes.LogLevel = 'silent';
}

class Builder implements IBuilder {
    constructor(private opts?: BuilderOpts) {}

    private validateEntry(path: string) {
        if (!fs.existsSync(path)) {
            throw new Error('Entry path doesn`t exist');
        }
    }

    public build(entry: string): IBundle {
        this.validateEntry(entry);

        const bundle = buildSync({
            write: false,
            entryPoints: [entry],
            absWorkingDir: process.cwd(),
            external: this.opts?.external,

            format: this.opts?.format || Defaults.format,
            target: this.opts?.target || Defaults.target,
            bundle: this.opts?.bundle || Defaults.bundle,
            minify: this.opts?.minify || Defaults.minify,
            outdir: this.opts?.outdir || Defaults.outdir,

            platform: this.opts?.platform || Defaults.platform,
            logLevel: this.opts?.logLevel || Defaults.logLevel,
        });
        return { bundle: bundle.outputFiles[0].text };
    }
}

export default Builder;
