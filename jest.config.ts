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
    setupFilesAfterEnv: ['./jest.setup.ts'], // Atualizado para setupFilesAfterEnv

    verbose: true,
};

export default config;
