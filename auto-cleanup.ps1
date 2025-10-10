# Auto-generated Cleanup Script
# Run this to fix identified issues

$projectRoot = "C:\Users\croes\Desktop\sama"
Set-Location $projectRoot

Write-Host "?? Starting Cleanup..." -ForegroundColor Cyan

# Delete test files
$testFiles = @()
foreach ($file in $testFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ? Deleted: $file" -ForegroundColor Green
    }
}

# Normalize asset filenames
if (Test-Path "assets") {
    Get-ChildItem "assets" | ForEach-Object {
        $newName = $_.Name.ToLower()
        if ($_.Name -ne $newName) {
            Rename-Item $_.FullName -NewName $newName
            Write-Host "  ? Renamed: $($_.Name) -> $newName" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "? Cleanup Complete!" -ForegroundColor Green
