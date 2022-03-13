import * as path from 'path';
import * as fs from 'fs-extra';
import { Mock } from './config';
import Directory, { IDirectory } from '../../src/lib/directory';

describe('Instance', () => {
    it('none existing instance entry path', () => {
        const config = {
            outdir: '/',
            entry: '/path/doesnt/exist',
        };
        const mock = () => new Directory(config);
        expect(mock).toThrow('Entry doesn`t exist');
    });
});

describe('Properties', () => {
    let directory: IDirectory;

    const property = (prop: string) => {
        return Object.keys(directory).includes(prop);
    };

    beforeAll(() => {
        directory = new Directory(Mock.config);
    });

    it('opts input properties', () => {
        expect(property('opts')).toBe(true);
    });

    it('location property', () => {
        expect(property('location')).toBe(false);
        directory.create();
        expect(property('location')).toBe(true);
    });

    it('prefix option', () => {
        const loc = directory.location.split('-');
        loc.pop();
        const prefix = path.basename(loc[loc.length - 1]);
        expect(`/${prefix}`).toBe(Mock.prefix);
    });
});

describe('Methods', () => {
    let directory: IDirectory;
    let method: jest.SpyInstance<IDirectory, []>;

    describe('Create Method', () => {
        beforeAll(() => {
            directory = new Directory(Mock.config);
            method = jest.spyOn(directory, 'create');
        });

        it('create method not been called', () => {
            expect(method).not.toHaveBeenCalled();
        });

        it('create method been called', () => {
            directory.create();
            expect(method).toHaveBeenCalled();
        });

        it('create method sets location property', () => {
            expect(typeof directory.location).toBe('string');
        });
    });

    describe('Copy Method', () => {
        beforeAll(() => {
            directory = new Directory(Mock.config);
            method = jest.spyOn(directory, 'copy');
        });

        it('outdir doesn`t exist', () => {
            expect(method).not.toHaveBeenCalled();
            expect(fs.existsSync(Mock.outdir)).toBe(false);
        });

        it('call copy method', () => {
            directory.create();
            directory.copy();
            expect(method).toHaveBeenCalled();
        });

        it('outdir exists/isDirectory', () => {
            expect(fs.existsSync(Mock.outdir)).toBe(true);
            expect(fs.lstatSync(Mock.outdir).isDirectory()).toBe(true);
        });

        it('module exist/isDirectory', () => {
            expect(fs.existsSync(Mock.outdir)).toBe(true);
            expect(fs.lstatSync(directory.location).isDirectory()).toBe(true);
        });

        it('file exist/isFile', () => {
            const filepath = path.join(directory.location, Mock.fileName);
            expect(fs.existsSync(filepath)).toBe(true);
            expect(fs.lstatSync(filepath).isFile()).toBe(true);
        });
    });

    describe('Delete Method', () => {
        let filepath: string;

        beforeAll(() => {
            directory = new Directory(Mock.config);
            method = jest.spyOn(directory, 'delete');
        });

        it('delete module is not called', () => {
            directory.create();
            directory.copy();
            filepath = path.join(directory.location, Mock.fileName);

            expect(method).not.toHaveBeenCalled();
            expect(fs.existsSync(filepath)).toBe(true);
        });

        it('delete module', () => {
            directory.delete();
            expect(fs.existsSync(filepath)).toBe(false);
        });

        it('delete out directory', () => {
            fs.removeSync(Mock.outdir);
            expect(fs.existsSync(Mock.outdir)).toBe(false);
        });
    });
});
