import * as path from 'path';
import * as fs from 'fs-extra';
import JSZip from 'jszip';

interface ArchiveOpts {
    outdir: string;
    content: string;
    zipFilename: string;
}

export default async function archive(opts: ArchiveOpts): Promise<void> {
    const zip = new JSZip();

    /**
     *
     * Create out file if not exist
     */
    const exist = fs.existsSync(opts.outdir);
    if (!exist) fs.mkdirSync(opts.outdir);

    /**
     *
     * Add file to zip
     */
    const zipOutFile = path.join(opts.zipFilename, 'index.js');
    zip.file(zipOutFile, opts.content);

    /**
     *
     * Generate content buffer
     */
    const contentBuff = await zip.generateAsync({
        type: 'nodebuffer',
    });

    /**
     *
     * Write content buffer to file
     */
    const filepath = path.join(opts.outdir, `${opts.zipFilename}.zip`);
    fs.promises.writeFile(filepath, contentBuff);
}
