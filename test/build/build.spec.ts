import * as path from 'path';
import * as fs from 'fs-extra';

import { Mock } from './config';
import Installer, { IInstaller } from '../../src/lib/installer';
import Builder, { IBuilder } from '../../src/lib/build';

describe('Build Module', () => {
    let builder: IBuilder;
    let installer: IInstaller;

    beforeAll(() => {
        builder = new Builder();
        installer = new Installer({
            entry: Mock.entryPath,
        });
        installer.clean();
    });

    const fileList = () => {
        const list = ['node_modules', 'package-lock.json'];
        return list.map((file) => path.join(Mock.entryPath, file));
    };

    describe('Instance', () => {
        it('none existing entry', () => {
            const noneDirPath = 'none/existing/dirpath';
            const mock = () => builder.build(noneDirPath);
            expect(mock).toThrow('Entry path doesn`t exist');
        });

        it('build w/o install', () => {
            const mock = () => builder.build(Mock.entryPath);
            expect(mock).toThrow('ERROR: Could not resolve "short-unique-id"');
        });
    });

    describe('Methods', () => {
        describe('Build', () => {
            it('install method', () => {
                const method = jest.spyOn(installer, 'install');
                installer.install();
                expect(method).toHaveBeenCalled();
            });

            it('has been installed', () => {
                fileList().forEach((file) => {
                    expect(fs.existsSync(file)).toBe(true);
                });
            });

            it('build and output bundle', () => {
                const build = builder.build(Mock.entryPath);
                expect(typeof build.bundle).toBe('string');
            });
        });
    });

    describe('Bundle', () => {
        it('save bundle to js-file', () => {
            const build = builder.build(Mock.entryPath);
            fs.writeFileSync(Mock.outFile, build.bundle);
            expect(fs.existsSync(Mock.outFile)).toBe(true);
        });

        it('run built file', () => {
            const module = require(Mock.outFile);
            const lib = module.default.uuid(10);
            expect(lib.length).toBe(10);
            expect(typeof lib).toBe('string');
        });

        it('clean up', () => {
            installer.clean();
            fileList().forEach((file) => {
                expect(fs.existsSync(file)).toBe(false);
            });
            fs.removeSync(Mock.outFile);
            expect(fs.existsSync(Mock.outFile)).toBe(false);
        });
    });
});
