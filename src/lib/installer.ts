import * as cp from 'child_process';

export function Installer(dirpath: string) {
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

    cp.spawnSync(cmd, ['install'], {
        cwd: dirpath,
    });
}
