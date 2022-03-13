import * as path from 'path';
import * as fs from 'fs-extra';
import * as cp from 'child_process';

export interface IInstaller {
    /**
     *
     * install npm deps. inside intry directory
     */
    install(): void;

    /**
     *
     * remove node_moduels and package-lock.json
     */
    clean(): void;
}

export interface InstallerOpts {
    /**
     *
     * entry directory where index and/or package.json
     */
    entry: string;
}

export enum Npm {
    os = 'npm',
    win = 'npm.cmd',
}

class Installer implements IInstaller {
    private get fileList(): string[] {
        return ['node_modules', 'package-lock.json'];
    }

    private get isWin(): boolean {
        const platform = process.platform;
        return platform === 'win32';
    }

    private get cmd(): string {
        return this.isWin ? Npm.win : Npm.os;
    }

    constructor(private opts: InstallerOpts) {
        if (!fs.existsSync(opts.entry)) {
            throw new Error('Entry doesn`t exist');
        }
    }

    public install(): void {
        if (!this.hasPackage()) return;
        cp.spawnSync(this.cmd, ['install'], {
            cwd: this.opts.entry,
        });
    }

    public clean(): void {
        this.fileList.forEach((file) => {
            this.removeFile(this.getModule(file));
        });
    }

    private removeFile(filePath: string): void {
        if (!fs.existsSync(filePath)) return;
        fs.removeSync(filePath);
    }

    private hasPackage(): boolean {
        const pkgFile = 'package.json';
        const pkg = this.getModule(pkgFile);
        return fs.existsSync(pkg);
    }

    private getModule(dir: string): string {
        return path.join(this.opts.entry, dir);
    }
}

export default Installer;
