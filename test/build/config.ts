import * as path from 'path';

export class Mock {
    static get libaryName(): string {
        return 'short-unique-id';
    }

    static get baseDir(): string {
        return path.join(__dirname, '../', 'mock');
    }

    static get entryPath(): string {
        return path.join(this.baseDir, 'module');
    }

    static get outFile(): string {
        return path.join(this.baseDir, 'index.js');
    }
}
