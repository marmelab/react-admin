checkCodecId() {
  codec=$(mediainfo --Inform="Video;%CodecID%" "$1")

  if [ "$codec" = "hvc1" ]; then
    # Construct the output file name
    output_file="${1%.*}_avc1.${1##*.}"
    echo "Invalid codec for $1"
    echo "Convert it to avc1 with:"
    echo "ffmpeg -i $1 -c:v libx264 -c:a copy ${output_file}"
    echo "rm $1"
    echo "mv $output_file $1"
    exit 1
  fi

}

checkChromaSubsampling() {
  imageencode=$(mediainfo --Inform="Video;%ChromaSubsampling%" "$1")

  if [ "$imageencode" = "4:4:4" ]; then
    # Construct the output file name
    output_file="${1%.*}_420.${1##*.}"
    echo "\nInvalid ChromaSubsampling for $1"

    echo "\nConvert it to yuv420p with:"
    case $2 in
    "mp4") echo "ffmpeg -i ${1} -c:v libx264 -pix_fmt yuv420p -c:a copy ${output_file}" ;;
    "webm") echo "ffmpeg -i ${1} -c:v libvpx-vp9 -pix_fmt yuv420p -c:a libopus -b:a 128k ${output_file}" ;;
    esac

    echo "\nThen replace the file with:"
    echo "rm $1 && mv $output_file $1\n"
    exit 1
  fi

}

for file in ./docs/img/**; do
  checkCodecId $file

  case "$file" in
  *.mp4) checkChromaSubsampling $file "mp4" ;;
  *.webm) checkChromaSubsampling $file "webm" ;;
  esac

done
