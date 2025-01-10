for file in ./docs/img/**; do
  codec=$(mediainfo --Inform="Video;%CodecID%" "$file")
  if [ "$codec" = "hvc1" ]; then
    echo "Invalid codec for $file"
    echo "Convert it to avc1 with:"
    echo "ffmpeg -i $file -c:v libx264 -c:a copy ${file%.*}_avc1.${file##*.}"
    echo "rm $file"
    echo "mv $output_file $file"
  fi
done