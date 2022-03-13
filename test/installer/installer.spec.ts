import * as fs from 'fs-extra';
import { Mock } from './config';
import Installer, { IInstaller } from '../../src/lib/installer';

describe('Installer Module', () => {
    let installer: IInstaller;
    let method: jest.SpyInstance;

    beforeAll(() => {
        installer = new Installer({
            entry: Mock.modulePath,
        });
    });

    const isExist = (file: string, exist: boolean) => {
        const nodeModules = fs.existsSync(file);
        expect(nodeModules).toBe(exist);
    };

    describe('Module Instance', () => {
        it('none existing entry', () => {
            const entry = 'none/existing/module';
            const mock = () => new Installer({ entry });
            expect(mock).toThrow('Entry doesn`t exist');
        });

        it('module w/o package json', () => {
            const entry = Mock.emptyModule;
            const installer = new Installer({ entry });
            installer.install();
            expect(fs.existsSync(Mock.emptyModulePkg)).toBe(false);
            expect(fs.existsSync(Mock.emptyModuleLock)).toBe(false);
        });
    });

    describe('Install Method', () => {
        beforeAll(() => {
            method = jest.spyOn(installer, 'install');
        });

        it('install method', () => {
            installer.install();
            expect(method).toHaveBeenCalled();
        });

        it('node modules installed', () => {
            isExist(Mock.nodeModules, true);
        });

        it('package lock installed', () => {
            isExist(Mock.packageLock, true);
        });
    });

    describe('Clean Method', () => {
        beforeAll(() => {
            method = jest.spyOn(installer, 'clean');
        });

        it('clean cache', () => {
            installer.clean();
            expect(method).toHaveBeenCalled();
        });

        it('node modules removed', () => {
            isExist(Mock.nodeModules, false);
        });

        it('package lock removed', () => {
            isExist(Mock.packageLock, false);
        });
    });
});
