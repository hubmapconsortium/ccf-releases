#!/bin/bash
set -e

# Move to the rel-tools dir
cd $(dirname "$0")

hraVersion=${hraVersion:=v2.0}
prevVersion=${prevVersion:=v1.4}

DO_NAMES=$(cut -f 3 ../reference-entity-ids.tsv | grep "/${hraVersion}/" | perl -pe 's/https\:\/\/.*\///g;s/.html//g;')

if [ "$1" == "clean" ]; then
  rm -r ../$hraVersion/{xml,docs}
  mkdir -p ../$hraVersion/{xml,docs}
fi

# Create docs index.html page
if [ "$1" != "hra-2" ]; then
    mkdir -p ../$hraVersion/docs/img
    perl -pe "s/\{VERSION\}/${hraVersion}/g" docs-index-template.html > ../$hraVersion/docs/index.html
    cp ../$prevVersion/docs/img/* ../$hraVersion/docs/img/
    cp ../$prevVersion/docs/styles.css ../$hraVersion/docs/
fi

for type in 2d-ftu asct-b vascular-geometry omap ref-organs; do
    if [ "$1" == "migrate" ]; then
        # Copy over old md for DOs that were not updated
        mkdir -p ../${hraVersion}/markdown/$type
        for f in ../${prevVersion}/markdown/$type/*.md; do
            n=`basename $f`
            if [ ! -e ../${hraVersion}/markdown/$type/$n ] && [ ! -e ../${hraVersion}/markdown/$type/${type}-${n} ] && [ ! -e ../${hraVersion}/markdown/$type/${type}-vh-${n} ]; then 
                cp $f ../${hraVersion}/markdown/$type/$n;
            fi
        done
    fi

    # Create doi xml files
    mkdir -p ../${hraVersion}/xml
    for f in $DO_NAMES; do 
        if [ -e ../${hraVersion}/markdown/$type/$f.md ]; then
            node md-to-doi-xml.js ../${hraVersion}/markdown/$type/$f.md ../${hraVersion}/xml/$f.xml
        fi
    done
    
    if [ "$1" != "hra-2" ]; then
        # Create html pages for DOs
        mkdir -p ../${hraVersion}/docs/$type
        for md in `ls ../${hraVersion}/markdown/$type/*.md`; do
            f=`basename ${md%.*}`
            perl -pe "s/\{DO_NAME\}/${f}/g;s/\{DO_TYPE\}/${type}/g" index-template.html > ../${hraVersion}/docs/$type/$f.html
        done

        # create html entries for DOs in the main index page
        files=""
        for f in ../${hraVersion}/docs/$type/*.html; do
            n=${type}/$(basename $f)
            files=$(echo -e "${files}\n        <li><a href=\"${n}\" title=\"Opens detail page for organ\" target=\"_blank\">${n}</a></li>")
        done

        # Replace and output updated docs page
        INDEX=$(cat ../${hraVersion}/docs/index.html)
        python3 -c "print(\"\"\"${INDEX}\"\"\".replace('{${type}_FILES}',\"\"\"${files}\"\"\"))" > ../${hraVersion}/docs/index.html
    fi
done

node ./mk-hra-metadata.js $hraVersion

# for f in *.svg; do perl -pe s/kidney-nephron/${f%.*}/g ../docs/2d-ftu/kidney-nephron.html > ../docs/2d-ftu/${f%.*}.html; done;
# for f in 2d-ftu/*.html; do echo "        <li><a href=\"$f\" title=\"Opens detail page for organ\" target=\"_blank\">$f</a></li>"; done;

# for f in *.csv; do perl -pe s/omap-kidney-codex/${f%.*}/g ../docs/omap/omap-kidney-codex.html > ../docs/omap/${f%.*}.html; done;
# for f in omap/*.html; do echo "        <li><a href=\"$f\" title=\"Opens detail page for organ\" target=\"_blank\">$f</a></li>"; done;

# for f in *.glb *.glb.zip; do perl -pe s/brain-female/${f%.*}/g ../docs/ref-organs/brain-female.html > ../docs/ref-organs/${f%.*}.html; done;
# for f in ref-organs/*.html; do echo "        <li><a href=\"$f\" title=\"Opens detail page for organ\" target=\"_blank\">$f</a></li>"; done;

# for f in *.csv; do perl -pe s/brain/${f%.*}/g ../docs/asct-b/brain.html > ../docs/asct-b/${f%.*}.html; done;
# for f in asct-b/*.html; do echo "        <li><a href=\"$f\" title=\"Opens detail page for organ\" target=\"_blank\">$f</a></li>"; done;

# node scratch/mk-ref-entity-ids-data.js >> reference-entity-ids.tsv

# rm -rf test && mkdir test && for f in ../${hraVersion}/markdown/*/*.md; do node md-to-doi-xml.js $f test/$(basename ${f%.*}).xml; cp $f test/$(basename $f); done;

# for f in $(cut -f 2 hubmap-ids.tsv | perl -pe 's/\..*$//g'); do 
#     if [ ! -e ../${hraVersion}/markdown/*/$f.md ]; then echo $f not ready;
#     else node md-to-doi-xml.js ../${hraVersion}/markdown/*/$f.md ../${hraVersion}/xml/$f.xml; fi;
# done; rm ../${hraVersion}/xml/*.json
