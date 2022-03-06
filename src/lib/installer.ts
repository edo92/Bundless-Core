import * as path from 'path';
import * as fs from 'fs-extra';
import * as cp from 'child_process';

interface InstallerOpts {
    tempdir: string;
}

export default function Installer(opts: InstallerOpts) {
    const pkg = path.join(opts.tempdir, 'package.json');

    if (fs.existsSync(pkg)) {
        cp.execSync(`npm install --production --prefix ${opts.tempdir}`);
    }
}
