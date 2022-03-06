import * as path from 'path';
import * as fs from 'fs-extra';

export class Tempdir {
    public dirpath: string;

    constructor(private entry: string) {
        if (!fs.existsSync(entry)) {
            console.log("------",entry)
            throw new Error('Directory does not exist');
        }
    }

    public create(temppath: string): Tempdir {
        const tempdir = path.join(temppath, 'tempdir');
        this.dirpath = path.resolve(tempdir);
        return this;
    }

    public copy(): Tempdir {
        fs.copySync(this.entry, this.dirpath);
        return this;
    }

    public delete(): Tempdir {
        fs.removeSync(this.dirpath);
        return this;
    }
}
