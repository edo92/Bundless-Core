import * as path from 'path';

export class Mock {
    static get outdir(): string {
        return path.join(__dirname);
    }

    static get zipFilename(): string {
        return 'myModule';
    }

    static get modulePath(): string {
        return path.join(__dirname, 'modules');
    }

    static get moduleIndex(): string {
        return path.join(this.modulePath, this.zipFilename, 'index.js');
    }

    static get zipOutput(): string {
        return path.join(__dirname, `${this.zipFilename}.zip`);
    }

    static get zipFilePath(): string {
        return path.join(this.outdir, this.zipOutput);
    }

    static get config() {
        return {
            outdir: this.outdir,
            zipFilename: this.zipFilename,
        };
    }
}
