import * as fs from 'fs';
import * as path from 'path';
import * as JSZip from 'jszip';
import * as esbuild from 'esbuild';

interface Optionals {
    file?: string;
    name?: string;
    wrap?: boolean;
    write?: boolean;
    outDir?: string;
    bundle?: boolean;
    minify?: boolean;
    metafile?: boolean;
    external?: string[];
    logLevel?: esbuild.LogLevel;
    platform?: 'node';
    target?: 'node12' | 'node14';
}

export interface CoreOptions extends Optionals {
    entryPoints: string[];
}

export interface IBuild {
    bundle: string;
}

class Defaults {
    static bundle = true;
    static write = false;
    static minify = true;
    static target = 'node14';
    static outDir = 'bundless';
    static outFile = 'index.js';
}

interface CoreProps {
    name?: string;
    file?: string;
    wrap?: boolean;
}

class Core {
    constructor(private opts: CoreProps) {}

    protected get outFile(): string {
        return this.opts.file || Defaults.outFile;
    }

    protected get outDir(): string {
        return (this.opts.wrap && this.opts.name) || '';
    }

    protected get wrapDir(): string {
        if (this.opts.wrap && !this.opts.name)
            throw new Error('wrap option requires name param');
        return path.join(this.outDir, this.outFile);
    }
}

export default class BundlerCore extends Core {
    constructor(private coreOpts: CoreOptions) {
        super(coreOpts);
    }

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
    public archive = async (build: IBuild): Promise<Buffer> => {
        const zip = new JSZip();
        zip.file(this.wrapDir, build.bundle);
        return await zip.generateAsync({ type: 'nodebuffer' });
    };

    /**
     *
     * @returns {string}
     */
    public async build(): Promise<IBuild> {
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
