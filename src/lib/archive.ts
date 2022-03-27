import * as path from 'path';
import * as fs from 'fs-extra';
import Zipper from 'adm-zip';

export interface IArchive {
    zipFile: string;
    writeFile(): void;
    removeZip(): void;
    extract(path: string): void;
    archive(content: string | Buffer): void;
    addFile(content: string | Buffer): void;
}

export interface ArchiveOpts {
    wrap?: boolean;
    outdir: string;
    zipFilename: string;
}

class Archive implements IArchive {
    private zip: Zipper;

    public get zipFile(): string {
        return `${this.outdir}.zip`;
    }

    private get outFile(): string {
        const file = this.opts.zipFilename;
        if (this.opts.wrap) return 'index.js';
        return path.join(file, 'index.js');
    }

    private get outdir(): string {
        const { outdir, zipFilename } = this.opts;
        return path.join(outdir, zipFilename);
    }

    constructor(private opts: ArchiveOpts) {
        this.zip = new Zipper();
    }

    public archive(content: string | Buffer): void {
        this.addFile(content);
        this.writeFile();
        this.removeBase();
    }

    public writeFile(): void {
        this.zip.writeZip(this.zipFile);
    }

    public removeZip(): void {
        if (!fs.existsSync(this.zipFile)) return;
        fs.removeSync(this.zipFile);
    }

    public addFile(content: string | Buffer): void {
        const buff = this.convertToBuff(content);
        this.zip.addFile(this.outFile, buff);
    }

    public extract(targetPath: string): void {
        return this.zip.extractAllTo(targetPath);
    }

    private convertToBuff(content: string | Buffer): Buffer {
        const isBuff = Buffer.isBuffer(content);
        return isBuff ? content : Buffer.from(content);
    }

    private removeBase(): void {
        fs.removeSync(this.outdir);
    }
}

export default Archive;
