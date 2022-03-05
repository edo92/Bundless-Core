import { Command, Option } from 'commander';

export class Cli {
    private commander: Command;

    public get options() {
        return this.commander.parse().opts();
    }

    constructor() {
        this.commander = new Command();
        this.register();
    }

    private register(): void {
        this.commander.addOption(new Option('-e, --entryPoints [string...]', 'entry points'));
        this.commander.addOption(new Option('-n, --name <string>', 'archive zip fie name'));
        this.commander.addOption(new Option('-o, --outDir <string>', 'out directory'));
        this.commander.addOption(new Option('-m, --minify <boolean>', 'minify module'));
        this.commander.addOption(
            new Option('-ex, --external [string...]', 'external modules')
        );
    }
}
