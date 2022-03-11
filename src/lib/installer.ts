import * as path from 'path';
import * as fs from 'fs-extra';
import * as cp from 'child_process';

export class Installer {
    private cmd: string;

    constructor(private dirpath: string) {
        const platform = process.platform;
        this.cmd = platform === 'win32' ? 'npm.cmd' : 'npm';
    }

    public install(): void {
        cp.spawnSync(this.cmd, ['install --production'], {
            cwd: this.dirpath,
        });
    }
}
