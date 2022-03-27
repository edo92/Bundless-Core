import * as fs from 'fs-extra';
import { Mock } from './config';
import Archive, { IArchive } from '../../src/lib/archive';

describe('Archive Module', () => {
    let content: string;
    let archive: IArchive;

    beforeAll(() => {
        content = 'this is string content';
        archive = new Archive(Mock.config);
    });

    describe('Archive Method', () => {
        let archiveMethod: jest.SpyInstance;

        beforeAll(() => {
            archiveMethod = jest.spyOn(archive, 'archive');
        });

        it('content archive', () => {
            archive.archive(content);
            expect(archiveMethod).toHaveBeenCalled();
            expect(fs.existsSync(Mock.zipOutput)).toBe(true);
        });

        it('remove archive', () => {
            archive.removeZip();
            expect(fs.existsSync(Mock.zipOutput)).toBe(false);
        });
    });

    describe('Manual Archive', () => {
        let addMethod: jest.SpyInstance;
        let writeMethod: jest.SpyInstance;

        beforeAll(() => {
            addMethod = jest.spyOn(archive, 'addFile');
            writeMethod = jest.spyOn(archive, 'writeFile');
        });

        it('add and write methods', () => {
            expect(addMethod).not.toHaveBeenCalled();
            expect(writeMethod).not.toHaveBeenCalled();
        });

        it('add and write content', () => {
            archive.addFile(content);
            archive.writeFile();
            expect(addMethod).toHaveBeenCalled();
            expect(writeMethod).toHaveBeenCalled();
            expect(fs.existsSync(Mock.zipOutput)).toBe(true);
            archive.removeZip();
        });

        it('add buffer and write', () => {
            archive.addFile(Buffer.from(content));
            archive.writeFile();
            expect(addMethod).toHaveBeenCalled();
            expect(writeMethod).toHaveBeenCalled();
            expect(fs.existsSync(Mock.zipOutput)).toBe(true);
            archive.removeZip();
        });
    });

    describe('Extract Archive', () => {
        let extractMethod: jest.SpyInstance;

        beforeAll(() => {
            extractMethod = jest.spyOn(archive, 'extract');
        });

        it('extract', () => {
            archive.extract(Mock.modulePath);
            expect(extractMethod).toHaveBeenCalled();
            expect(fs.existsSync(Mock.modulePath)).toBe(true);
            expect(fs.existsSync(Mock.moduleIndex)).toBe(true);
        });

        it('extract content', () => {
            const fileContent = fs.readFileSync(Mock.moduleIndex);
            expect(fileContent.toString()).toBe(content);
        });

        it('remove extracted', () => {
            fs.removeSync(Mock.modulePath);
            expect(fs.existsSync(Mock.modulePath)).toBe(false);
        });
    });

    // TODO: test wrap option which wraps in directory if true
    // describe("test wrap option",()=>{})
});
