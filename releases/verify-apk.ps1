$ErrorActionPreference = "Stop"

$releaseDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$apkPath = Join-Path $releaseDirectory "Masaeedi-v1.2.3-universal.apk"
$sumsPath = Join-Path $releaseDirectory "SHA256SUMS.txt"

if (-not (Test-Path -LiteralPath $apkPath -PathType Leaf)) {
    throw "APK file not found: $apkPath"
}

if (-not (Test-Path -LiteralPath $sumsPath -PathType Leaf)) {
    throw "Checksum file not found: $sumsPath"
}

$checksumLine = Get-Content -LiteralPath $sumsPath -Encoding utf8 |
    Where-Object { $_ -match "Masaeedi-v1\.2\.3-universal\.apk$" } |
    Select-Object -First 1
if (-not $checksumLine) {
    throw "Checksum entry for Masaeedi-v1.2.3-universal.apk was not found."
}
$expectedHash = ($checksumLine -split "\s+")[0].ToUpperInvariant()
$actualHash = (Get-FileHash -LiteralPath $apkPath -Algorithm SHA256).Hash.ToUpperInvariant()

Write-Host "File:     $apkPath"
Write-Host "Expected: $expectedHash"
Write-Host "Actual:   $actualHash"

if ($actualHash -ne $expectedHash) {
    throw "APK verification failed. The SHA-256 hashes do not match."
}

Write-Host "Verification passed: the APK matches SHA256SUMS.txt." -ForegroundColor Green
