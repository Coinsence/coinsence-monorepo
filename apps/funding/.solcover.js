module.exports = {
    norpc: true,
    copyPackages: ['@aragon/os'],
    buildDirPath: '/build/contracts',
    testCommand: '../node_modules/.bin/aragon contracts test --network coverage',
    skipFiles: [
        'misc/Migrations.sol',
        'test/Spoof.sol',
    ]
}