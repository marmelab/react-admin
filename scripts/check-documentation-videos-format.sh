for file in ./docs/img/**; do
  codec=$(mediainfo --Inform="Video;%CodecID%" "$file")
  if [ "$codec" = "hvc1" ]; then
    # Construct the output file name
    output_file="${file%.*}_avc1.${file##*.}"
    echo "Invalid codec for $file"
    echo "Convert it to avc1 with:"
    echo "ffmpeg -i $file -c:v libx264 -c:a copy ${output_file}"
    echo "rm $file"
    echo "mv $output_file $file"
    exit 1;
  fi
done