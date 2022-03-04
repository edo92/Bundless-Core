interface Optionals {
    outDir?: string;
}

export interface CoreOptions extends Optionals {}

export default class Bundler {
    constructor(private coreOpts: CoreOptions) {}
}
