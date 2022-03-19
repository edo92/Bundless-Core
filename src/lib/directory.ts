import path from 'path';
import * as fs from 'fs-extra';

export interface IDirectory {
    /**
     *
     * directory path location
     * where temporary directory is
     */
    readonly location: string;

    /**
     *
     * create temporary directory
     */
    create(): IDirectory;

    /**
     *
     * copy entry path source code
     * to temporary directory
     */
    copy(): IDirectory;

    /**
     *
     * delete temporary directory
     */
    delete(): IDirectory;
}

export interface DirectoryOpts {
    /**
     *
     * module extry directory path
     */
    entry: string;

    /**
     *
     * out directory path
     */
    outdir: string;

    /**
     *
     * out file name prefix
     */
    prefix?: string;
}

class Directory implements IDirectory {
    public location: string;

    private get moduleName(): string {
        const dirname = path.basename(this.opts.entry);
        const prefix = this.opts.prefix || '.asset';
        return `${prefix}-${dirname}`;
    }

    constructor(private readonly opts: DirectoryOpts) {
        if (!fs.existsSync(this.opts.entry)) {
            throw new Error('Entry doesn`t exist');
        }
    }

    public delete(): IDirectory {
        this.validate('Directory doesn`t exist');
        fs.removeSync(this.location);
        return this;
    }

    public copy(): IDirectory {
        this.validate('Call create method first');
        fs.copySync(this.opts.entry, this.location);
        return this;
    }

    public create(): IDirectory {
        const dirname = this.moduleName;
        const { outdir } = this.opts;
        this.location = path.join(outdir, dirname);
        return this;
    }

    private validate(message: string) {
        if (!this.location) throw new Error(message);
    }
}

export default Directory;
