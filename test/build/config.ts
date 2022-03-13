import * as path from 'path';

export class Mock {
    static get libaryName(): string {
        return 'short-unique-id';
    }

    static get mockDir(): string {
        return path.join(__dirname, '../', 'mock');
    }

    static get entryPath(): string {
        return path.join(this.mockDir, 'module');
    }

    static get outFile(): string {
        return path.join(this.entryPath, 'index.js');
    }
}
