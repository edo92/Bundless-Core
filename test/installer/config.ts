import path from 'path';

export class Mock {
    static get basedir(): string {
        return path.join(__dirname, '../', 'mock');
    }

    static get modulePath(): string {
        return path.join(this.basedir, 'module');
    }

    static get nodeModules(): string {
        return path.join(this.modulePath, 'node_modules');
    }

    static get packageLock(): string {
        return path.join(this.modulePath, 'package-lock.json');
    }

    static get emptyModule(): string {
        return path.join(this.basedir, 'nodeDepModule');
    }

    static get emptyModulePkg(): string {
        return path.join(this.emptyModule, 'node_modules');
    }

    static get emptyModuleLock(): string {
        return path.join(this.emptyModule, 'package-lock.json');
    }
}
