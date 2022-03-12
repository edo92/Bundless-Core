#!/usr/bin/env ts-node
import * as path from 'path';
import * as fs from 'fs-extra';
import unzip from 'extract-zip';

import { Builder } from '../dist/lib/build';
import { Archive } from '../dist/lib/archive';
import { Tempdir } from '../dist/lib/tempdir';

describe('Lib test', () => {
    const mockModule = path.join(__dirname, 'mock', 'module');
    const outdir = path.resolve('bundle.out');

    describe('Build Lib', () => {
        it('Entry point missing', () => {
            const Build = Builder as any;
            expect(() => Build({})).toThrow();
        });

        it('Entry point module', () => {
            const builder = new Builder({
                outdir: outdir,
                external: ['uuid'],
            });
            const build = builder.build(mockModule);
            expect(typeof build.bundle).toBe('string');
        });
    });

    describe('Tempdir Lib', () => {
        it('Module entry nonExist', () => {
            expect(() => new Tempdir('nonexisting-module')).toThrow();
        });

        it('Tempdir create', () => {
            const tempdir = new Tempdir(mockModule);
            tempdir.create(outdir);
            expect(typeof tempdir.dirpath).toBe('string');
        });

        it('Tempdir copy', () => {
            const tempdir = new Tempdir(mockModule);
            tempdir.create(outdir).copy();
            expect(fs.existsSync(tempdir.dirpath)).toBe(true);
        });
    });

    it('tempdir delete', () => {
        const tempdir = new Tempdir(mockModule);
        tempdir.create(outdir).copy();

        const [idx, pkg] = fs.readdirSync(tempdir.dirpath);
        expect(idx).toBe('index.ts');
        expect(pkg).toBe('package.json');
    });

    describe('Archive Module', () => {
        it('Ziped content', async () => {
            const bundle = 'Buffer stirng comes from builder';

            const archiver = new Archive({
                outdir: outdir,
                zipFilename: 'myzipfile',
            });
            archiver.archive(bundle);

            // Unzip outfile.zip
            await unzip(path.join(outdir, 'myzipfile.zip'), { dir: outdir });
            const content = fs.readFileSync(path.join(outdir, 'myzipfile', 'index.js'));

            // Match bundle output content with input bundle buffer content
            expect(content.toString()).toBe(bundle);
        });
    });
});
