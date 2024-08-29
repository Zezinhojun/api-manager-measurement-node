import type { Config } from 'jest';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    clearMocks: true,
    testMatch: [
        '**/tests/**/*.test.ts',
    ],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },

    verbose: true,
};

export default config;
