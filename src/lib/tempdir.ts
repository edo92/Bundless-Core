import * as path from 'path';
import * as fs from 'fs-extra';

export interface ITempdir {
    copy(): Tempdir;
    delete(): Tempdir;
    create(path: string): Tempdir;
}

export class Tempdir implements ITempdir {
    public dirpath: string;

    constructor(private entry: string) {
        if (!fs.existsSync(entry)) {
            throw new Error('Directory does not exist');
        }
    }

    public copy(): Tempdir {
        fs.copySync(this.entry, this.dirpath);
        return this;
    }

    public delete(): Tempdir {
        fs.removeSync(this.dirpath);
        return this;
    }

    public create(temppath: string): Tempdir {
        const tempdir = path.join(temppath, 'tempdir');
        this.dirpath = path.resolve(tempdir);
        return this;
    }
}
