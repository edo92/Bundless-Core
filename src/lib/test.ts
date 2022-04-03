import * as fs from 'fs-extra';
import { execSync } from 'child_process';

export interface TestOptions {
    entry: string;
    configPath?: string;
}

abstract class Testing {
    protected cmds: string[] = [];
    protected abstract setConfig(): void;
    protected abstract setRootDir(): void;

    constructor(protected readonly opts: TestOptions) {}

    private get commands(): string[] {
        return this.cmds.filter((cmd) => cmd.length);
    }

    public test(): void {
        this.initialize();
        this.execute();
    }

    private initialize(): void {
        this.setConfig();
        this.setRootDir();
    }

    private get specExist(): boolean {
        const list = fs.readdirSync(this.opts?.entry);
        return !list.every((el) => !el.includes('.spec'));
    }

    private execute(): void {
        if (!this.specExist) return;
        execSync(`npx jest ${this.commands.join(' ')}`);
    }
}

export default class JestTest extends Testing {
    protected setConfig(): void {
        if (!this.opts?.configPath) return;
        this.cmds.push(`-t --config=${this.opts.configPath}`);
    }

    protected setRootDir(): void {
        if (!this.opts?.entry) return;
        this.cmds.push(`--rootDir=${this.opts.entry}`);
    }
}
