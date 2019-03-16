module.exports = {
    norpc: true,
    copyPackages: ['@aragon/os'],
    buildDirPath: '/build/contracts',
    skipFiles: [
        'Migrations.sol',
        'test/Spoof.sol',
    ]
}