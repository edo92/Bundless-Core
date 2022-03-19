import * as fs from 'fs-extra';
import { Mock } from './config';
import { Bundler, IBundler } from '../../src';

describe('Bundler Facade Module', () => {
    let bundler: IBundler;

    beforeEach(() => {
        bundler = new Bundler({
            entry: Mock.entry,
            outdir: Mock.outdir,
            name: Mock.outfile,
        });
    });

    it('Bundle Outdir', () => {
        bundler.bundle();
        fs.existsSync(Mock.outdir);
    });

    it('Bundle Outfile', () => {
        bundler.bundle();
        fs.existsSync(Mock.zipFile);
    });
});
