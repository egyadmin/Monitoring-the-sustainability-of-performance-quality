const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execSync } = require('child_process');

// Fast fallback: Use powershell if archiver doesn't exist?
// No, we can just use PowerShell's built-in ZipFile class.
const fsContent = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$source = "c:\\Users\\SAJCO\\Desktop\\ReadyCBAHI-Export-v3"
$destination = "c:\\Users\\SAJCO\\Desktop\\ReadyCBAHI-Replit.zip"

if (Test-Path $destination) { Remove-Item $destination }

$zip = [System.IO.Compression.ZipFile]::Open($destination, 'Create')

function AddDirInfo($dirPath, $basePath) {
    Get-ChildItem $dirPath -File | ForEach-Object {
        $relPath = Resolve-Path -Relative $_.FullName
        $relPath = $relPath -replace '^.\\', ''
        if ($relPath -notmatch "node_modules" -and $relPath -notmatch ".git" -and $relPath -notmatch ".zip") {
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relPath)
        }
    }
    Get-ChildItem $dirPath -Directory | ForEach-Object {
        if ($_.Name -ne "node_modules" -and $_.Name -ne ".git") {
            AddDirInfo $_.FullName $basePath
        }
    }
}

AddDirInfo $source $source
$zip.Dispose()
Write-Host "Project Zipped Successfully excluding node_modules"
`;
fs.writeFileSync('zip_maker.ps1', fsContent);
execSync('powershell -ExecutionPolicy Bypass -File zip_maker.ps1', { stdio: 'inherit' });
process.exit(0);
