$url = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
$zipPath = "ffmpeg.zip"
$extractPath = "ffmpeg-temp"

Write-Host "Downloading FFmpeg using curl.exe..."
curl.exe -L -o $zipPath $url

Write-Host "Extracting FFmpeg..."
Expand-Archive -Path $zipPath -DestinationPath $extractPath -Force

$ffmpegExe = (Get-ChildItem -Path $extractPath -Recurse -Filter "ffmpeg.exe").FullName
Write-Host "Found ffmpeg at $ffmpegExe"

$videosDir = "public\assets\videos"
$videos = Get-ChildItem -Path $videosDir -Filter "*.mp4"

foreach ($video in $videos) {
    $inputFile = $video.FullName
    $tempFile = Join-Path $video.DirectoryName "cut_$($video.Name)"
    
    Write-Host "Cutting $($video.Name) to 30 seconds..."
    & $ffmpegExe -y -i $inputFile -t 30 -c copy $tempFile
    
    if (Test-Path $tempFile) {
        Remove-Item $inputFile
        Rename-Item $tempFile $inputFile
        Write-Host "Replaced $($video.Name) successfully."
    }
}

Write-Host "Cleaning up..."
Remove-Item $zipPath
Remove-Item $extractPath -Recurse -Force

Write-Host "Done!"
