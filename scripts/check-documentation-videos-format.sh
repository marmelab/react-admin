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

  if [ "$imageencode" != "4:2:0" ]; then
    # Construct the output file name
    output_file="${1%.*}_420.${1##*.}"
    echo "Invalid ChromaSubsampling for $1"
    echo "Convert it to yuv420p with:"
    echo "ffmpeg -i ${1} -c:v libx264 -pix_fmt yuv420p -c:a copy ${output_file}"
    echo "rm $1"
    echo "mv $output_file $1"
    exit 1
  fi

}

for file in ./docs/img/**; do
  checkCodecId $file

  case "$file" in
  *.mp4) checkChromaSubsampling $file ;;
  *.webm) checkChromaSubsampling $file ;;
  *.gif) checkChromaSubsampling $file ;;
  esac

done
