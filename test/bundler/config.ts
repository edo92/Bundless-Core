import path from 'path';

export class Mock {
    static get entry(): string {
        return path.resolve('test/mock/module');
    }

    static get outdir(): string {
        return 'bundle.out';
    }

    static get outfile(): string {
        return 'utilx';
    }

    static get zipFile(): string {
        return path.join(this.outdir, `${this.outfile}.zip`);
    }
}
