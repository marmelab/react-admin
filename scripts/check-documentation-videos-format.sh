for file in ./docs/img/*; do
  codec=$(mediainfo --Inform="Video;%CodecID%" "$file")
  if [ "$codec" = "hvc1" ]; then
    # Construct the output file name
    output_file="${file%.*}_avc1.${file##*.}"
    # Convert the file to avc1 (H.264)
    ffmpeg -i "$file" -c:v libx264 -c:a copy "$output_file"
    rm $file
    mv $output_file $file
    echo "Fixed codec for $file"
  fi
done