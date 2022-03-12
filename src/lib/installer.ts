import * as cp from 'child_process';

export class Installer {
    protected get command(): string {
        const platform = process.platform;
        const isWin = platform === 'win32';
        return isWin ? 'npm.cmd' : 'npm';
    }

    public install(entryPath: string): void {
        cp.spawnSync(this.command, ['install'], {
            cwd: entryPath,
        });
    }
}
