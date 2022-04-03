module.exports = {
    preset: 'ts-jest',
    transform: {
        '\\.ts?$': [
            'esbuild-jest',
            {
                loaders: {
                    '.spec.js': 'jsx',
                    '.js': 'jsx',
                },
            },
        ],
    },
};
