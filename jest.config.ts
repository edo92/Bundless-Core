module.exports = {
    clearMocks: true,
    moduleFileExtensions: ['js', 'ts'],
    roots: ['./test'],
    testEnvironment: 'node',
    preset: 'ts-jest',
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    moduleNameMapper: {
        '/^Util/(.*)$/': './util',
        '/^lib/(.*)$/': './lib',
    },
    moduleDirectories: ['src', 'node_modules'],
};
