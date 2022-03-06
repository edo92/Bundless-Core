import * as fs from 'fs-extra';
import * as esTypes from 'esbuild';
import { buildSync } from 'esbuild';

export interface IBuild {
    bundle: string;
}

export interface BuilderOptions {
    entry: string;
    outdir?: string;
    bundle?: boolean;
    minify?: boolean;
    external?: string[];
    format?: esTypes.Format;
    platform?: esTypes.Platform;
    logLevel?: esTypes.LogLevel;
    target?: 'node12' | 'node14' | 'esndext';
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

export default function builder(opts: BuilderOptions): IBuild {
    if (!opts.entry && fs.existsSync(opts.entry)) {
        throw new Error('Entry directory does not exist');
    }

    const buildRes = buildSync({
        write: false,
        absWorkingDir: process.cwd(),
        external: opts.external,
        entryPoints: [opts.entry],

        format: opts.format || Defaults.format,
        target: opts.target || Defaults.target,
        bundle: opts.bundle || Defaults.bundle,
        minify: opts.minify || Defaults.minify,
        outdir: opts.outdir || Defaults.outdir,

        platform: opts.platform || Defaults.platform,
        logLevel: opts.logLevel || Defaults.logLevel,
    });
    return { bundle: buildRes.outputFiles[0].text };
}
