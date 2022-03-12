import * as path from 'path';
import * as fs from 'fs-extra';
import adminZip from 'adm-zip';

interface ArchiveOpts {
    outdir: string;
    zipFilename: string;
}

interface IArchive {
    archive(content: string): void;
}
export class Archive implements IArchive {
    private zip: adminZip;

    private get outFile(): string {
        return path.join(this.opts.zipFilename, 'index.js');
    }

    private get outDir(): string {
        const { outdir, zipFilename } = this.opts;
        return path.join(outdir, zipFilename);
    }

    constructor(private opts: ArchiveOpts) {
        this.zip = new adminZip();
    }

    public archive(content: string): void {
        this._addFile(content);
        this._writeFile();
        this._removeBase();
    }

    private _writeFile(): void {
        this.zip.writeZip(`${this.outDir}.zip`);
    }

    private _addFile(content: string): void {
        const buff = Buffer.from(content);
        this.zip.addFile(this.outFile, buff);
    }

    private _removeBase(): void {
        setTimeout(() => {
            fs.removeSync(this.outDir);
        }, 500);
    }
}
