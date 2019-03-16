module.exports = {
    norpc: true,
    copyPackages: ['@aragon/os'],
    buildDirPath: '/build/contracts',
    skipFiles: [
        'misc/Migrations.sol',
        'test/Spoof.sol',
    ]
}