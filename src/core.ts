import path from 'path';
import * as fs from 'fs';
import JSZip from 'jszip';
import * as esbuild from 'esbuild';

interface Optionals {
    logLevel?: esbuild.LogLevel;
    write?: boolean;
    outDir?: string;
    bundle?: boolean;
    minify?: boolean;
    metafile?: boolean;
    external?: string[];
    platform?: 'node';
    target?: 'node12' | 'node14';
}

export interface CoreOptions extends Optionals {
    entryPoints: string[];
}

class Defaults {
    static bundle = true;
    static write = false;
    static minify = true;
    static target = 'node14';
    static outDir = 'bundless';
}

export default class BundlerCore {
    constructor(private coreOpts: CoreOptions) {}

    /**
     *
     * @param zipName
     * @param buff
     */
    public writeFile(zipName: string, buff: Buffer): void {
        fs.promises.writeFile(zipName, buff);
    }

    /**
     *
     * @param bundle
     * @returns {Buffer}
     */
    public archive = async (bundle: string): Promise<Buffer> => {
        const zip = new JSZip();
        zip.file('index.js', bundle);
        return await zip.generateAsync({ type: 'nodebuffer' });
    };

    /**
     *
     * @returns {string}
     */
    public async build(): Promise<{ bundle: string }> {
        const res = await esbuild.build({
            platform: this.coreOpts.platform || 'node',
            logLevel: this.coreOpts.logLevel || 'silent',

            write: false,
            absWorkingDir: process.cwd(),
            external: this.coreOpts.external,
            metafile: this.coreOpts.metafile,

            minify: this.coreOpts.bundle || Defaults.minify,
            bundle: this.coreOpts.bundle || Defaults.bundle,
            target: this.coreOpts.target || Defaults.target,
            outdir: this.coreOpts.outDir || Defaults.outDir,

            entryPoints: this.coreOpts.entryPoints.map((entry) => path.resolve(entry)),
        });

        return { bundle: res.outputFiles[0].text };
    }
}
