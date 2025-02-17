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
    exit 1
  fi

  imageencode=$(mediainfo --Inform="Video;%ChromaSubsampling%" "$file")

  if [ "$imageencode" != "4:2:0" ]; then
    # Construct the output file name
    output_file="${file%.*}_420.${file##*.}"
    echo "Invalid ChromaSubsampling for $file"
    echo "Convert it to yuv420p with:"
    echo "ffmpeg -i ${file} -c:v libx264 -pix_fmt yuv420p -c:a copy ${output_file}"
    echo "rm $file"
    echo "mv $output_file $file"
    exit 1
  fi


done
