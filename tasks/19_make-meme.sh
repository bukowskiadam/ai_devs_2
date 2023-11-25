#!/usr/bin/env sh

IMAGE=$1
TEXT=$2
OUTPUT=$3

convert -size 1080x1080 xc:black \
\( -resize 800x800 "$IMAGE" -gravity center \) \
-composite \( -size 1000x280 -background none -fill white -font Arial-Black -pointsize 40 -gravity center caption:"$TEXT" \) -gravity south \
-composite "$OUTPUT"
