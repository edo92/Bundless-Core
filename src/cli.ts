import { Command, Option } from 'commander';

export class Cli extends Command {
    public get values(): Record<string, string | string[]> {
        return this.parse().opts();
    }

    constructor() {
        super();
        this.register();
    }

    private register(): void {
        this.addOption(new Option('-e, --entry <string>', 'entry path'));
        this.addOption(new Option('-f, --file <string>', 'out file name'));
        this.addOption(new Option('-o, --outdir <string>', 'out directory'));
        this.addOption(new Option('-m, --minify <boolean>', 'minify module'));
        this.addOption(new Option('-n, --name <string>', 'archive zip fie name'));
        this.addOption(new Option('-ex, --external [string...]', 'external modules'));
    }
}
