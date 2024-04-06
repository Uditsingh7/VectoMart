// This file, typically named jest.config.js or jest.config.ts, is used to configure Jest, 
// the testing framework for JavaScript and TypeScript projects. 
// It specifies various settings and options that Jest should use when running tests.

module.exports = {
    "preset": "ts-jest", // indicates `ts-jest` as the preset (a configuration pack) should be used
    "testEnvironment": "node",
    "clearMocks": true,  // automatically clear mock calls and instances between every test
    "coverageDirectory": "coverage",  // directory where Jest will output coverage reports
    "collectCoverage": true,    // instructs Jest to collect code coverage and generate a report
    "collectCoverageFrom": [
        "src/**/*.ts",
        "!src/**/*.test.ts",
        "!**/node_modules/**"
    ]
}

