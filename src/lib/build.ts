import * as fs from 'fs-extra';
import * as esTypes from 'esbuild';
import { buildSync } from 'esbuild';

export interface IBuild {
    bundle: string;
}

export interface BuilderSpecs {
    /**
     *
     * @default {true}
     * To bundle a file means to inline any imported dependencies into the file itself.
     */
    bundle?: boolean;

    /**
     *
     * @default {true}
     */
    minify?: boolean;

    /**
     *
     * External dependencies which will be provided by runtime
     */
    external?: string[];

    /**
     *
     * @default {cjs}
     * output format
     */
    format?: esTypes.Format;

    /**
     *
     * @default {node14}
     * Platform type such as node, etc..
     */
    platform?: esTypes.Platform;

    /**
     *
     * Target nodejs type
     */
    target?: 'node12' | 'node14' | 'esndext';
}

export interface BuilderOpts extends BuilderSpecs {
    /**
     *
     * Directory where builder will place output file
     */
    outdir?: string;

    /**
     *
     * Specify log level such as warning, error, etc..
     */
    logLevel?: esTypes.LogLevel;
}

export interface IBuilder {
    /**
     *
     * Build execution
     */
    build(entry: string): IBuild;
}

class Defaults {
    static minify = true;
    static bundle = true;
    static target = 'node14';
    static outdir = 'bundle.out';
    static format: esTypes.Format = 'cjs';
    static platform: esTypes.Platform = 'node';
    static logLevel: esTypes.LogLevel = 'silent';
}

class Builder implements IBuilder {
    constructor(private readonly opts?: BuilderOpts) {}

    private validateEntry(path: string) {
        if (!fs.existsSync(path)) {
            throw new Error('Entry path doesn`t exist');
        }
    }

    public build(entry: string): IBuild {
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
