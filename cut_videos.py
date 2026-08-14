import os
import subprocess
import imageio_ffmpeg

ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
video_dir = r"c:\Users\AMEER\Desktop\car accident detection\car-accident-detection\public\assets\videos"

for filename in os.listdir(video_dir):
    if filename.endswith(".mp4"):
        filepath = os.path.join(video_dir, filename)
        temp_filepath = os.path.join(video_dir, "cut_" + filename)
        
        cmd = [ffmpeg_exe, "-y", "-i", filepath, "-vcodec", "libx264", "-crf", "28", "-preset", "fast", temp_filepath]
        print(f"Compressing {filename}...")
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
        
        os.replace(temp_filepath, filepath)
        print(f"Finished {filename}.")
        
print("All videos successfully cut to 30 seconds!")
