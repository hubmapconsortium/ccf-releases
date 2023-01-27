for f in *.svg; do perl -pe s/kidney-nephron/${f%.*}/g ../docs/2d-ftu/kidney-nephron.html > ../docs/2d-ftu/${f%.*}.html; done;
for f in 2d-ftu/*.html; do echo "        <li><a href=\"$f\" title=\"Opens detail page for organ\" target=\"_blank\">$f</a></li>"; done;

for f in *.csv; do perl -pe s/omap-kidney-codex/${f%.*}/g ../docs/omap/omap-kidney-codex.html > ../docs/omap/${f%.*}.html; done;
for f in omap/*.html; do echo "        <li><a href=\"$f\" title=\"Opens detail page for organ\" target=\"_blank\">$f</a></li>"; done;

for f in *.glb *.glb.zip; do perl -pe s/brain-female/${f%.*}/g ../docs/ref-organs/brain-female.html > ../docs/ref-organs/${f%.*}.html; done;
for f in ref-organs/*.html; do echo "        <li><a href=\"$f\" title=\"Opens detail page for organ\" target=\"_blank\">$f</a></li>"; done;

for f in *.csv; do perl -pe s/brain/${f%.*}/g ../docs/asct-b/brain.html > ../docs/asct-b/${f%.*}.html; done;
for f in asct-b/*.html; do echo "        <li><a href=\"$f\" title=\"Opens detail page for organ\" target=\"_blank\">$f</a></li>"; done;

node scratch/mk-ref-entity-ids-data.js >> reference-entity-ids.tsv

rm -rf test && mkdir test && for f in ../v1.2/markdown/*/*.md; do node md-to-doi-xml.js $f test/$(basename ${f%.*}).xml; cp $f test/$(basename $f); done;

rm -rf test && mkdir test && for f in ../v1.3/markdown/*/*.md; do node md-to-doi-xml.js $f test/$(basename ${f%.*}).xml; cp $f test/$(basename $f); done;

for f in $(cut -f 1 hubmap-ids.tsv | perl -pe 's/\..*$//g'); do 
    if [ ! -e ../v1.3/markdown/*/$f.md ]; then echo $f not ready;
    else cp ../v1.3/markdown/*/$f.md test && node md-to-doi-xml.js ../v1.3/markdown/*/$f.md test/$f.xml; fi;
done;


for f in $(cut -f 1 hubmap-ids.tsv | perl -pe 's/\..*$//g'); do 
    if [ ! -e ../v1.3/markdown/*/$f.md ]; then echo $f not ready;
    else node md-to-doi-xml.js ../v1.3/markdown/*/$f.md ../v1.3/xml/$f.xml; fi;
done; rm ../v1.3/xml/*.json
