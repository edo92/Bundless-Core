#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs-extra';
import unzip from 'extract-zip';
import * as cp from 'child_process';
import { Bundler } from '../dist/index';

describe('Bundle', () => {
    const outdir = path.resolve('bundle.out');
    const mockModule = path.join(__dirname, 'mock/module');
    const archivefile = 'myzipfile';

    beforeAll(() => {
        fs.removeSync(outdir);
        jest.setTimeout(1000);
    });

    it('Bundler bundle', async () => {
        const bundler = await new Bundler({
            outdir: outdir,
            entry: mockModule,
            name: archivefile,
        });

        await bundler.bundle();

        // Check archived zip exist
        const zipPath = path.join(outdir, `${archivefile}.zip`);
        expect(fs.existsSync(zipPath)).toBe(true);
    });

    it('Bundler files/outputs', async () => {
        // output zip file and inner main index.js file
        const zipPath = path.join(outdir, `${archivefile}.zip`);
        const zipMainFile = path.join(path.join(outdir, archivefile), 'index.js');

        // Unzip archive
        await unzip(zipPath, { dir: outdir });

        // Test archive and inner index file existance
        expect(fs.existsSync(`${zipPath}`)).toBe(true);
        expect(fs.existsSync(zipMainFile)).toBe(true);
    });

    it('Bundler module run', async () => {
        // Run module file (zip -> index.js)
        const outFileIdx = path.join(outdir, archivefile, 'index.js');
        const res = await cp.execSync(`node ${outFileIdx}`);

        // Split output string and split to test
        const result = res.toString().split(' ');

        // Test output content
        expect(result[0]).toBe('testing');
        expect(result[1].length).toBe(37);
    });
});
