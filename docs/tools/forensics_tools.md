---
title: Forensics Tools (CTFs)
layout: default
parent: Tools
---

### Forensics Tools

exiftool
`exiftool <filename>`


zsteg (only PNG)
```bash
zsteg -a <filename>
```

hexdump


strings
`strings <filename>`


file
`strings <filename>`


binwalk
```bash
binwalk -e filename

# if the above command produces a warning, use the below command instead
binwalk --dd=".*" filename
```


steghide (only JPG)
```bash
steghide extract -sf image.jpg
steghide info image.jpg
```

stegseek: A specialized tool that can quickly crack steghide passwords using a wordlist.


look at pictures in different ways
convert input_photo.jpg -monochrome output_photo_monochrome.jpg


## Resources:
https://en.wikipedia.org/wiki/List_of_file_signatures

https://asecuritysite.com/forensics/bmp?file=router.bmp
