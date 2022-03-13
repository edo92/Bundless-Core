import path from 'path';

export enum MockConfig {
    moduleName = 'module',
    filename = 'index.ts',
    outDir = 'bundle.out',
    entry = 'mock/module',
    prefix = '/.asset',
}

export class Mock {
    static get fileName() {
        return MockConfig.filename;
    }

    static get prefix() {
        return MockConfig.prefix;
    }

    static get filePath() {
        return path.join(this.outdir, MockConfig.filename);
    }

    static get outdir() {
        return path.join(__dirname, '../', MockConfig.outDir);
    }

    static get entryPath() {
        console.log('-----', path.join(__dirname, '../', MockConfig.entry));
        return path.join(__dirname, '../', MockConfig.entry);
    }

    static get config() {
        return {
            outdir: this.outdir,
            entry: this.entryPath,
            prefix: MockConfig.prefix,
        };
    }
}
