#!/bin/bash

# Move to the rel-tools dir
cd $(dirname "$0")

hraVersion=${hraVersion:=v1.4}

for f in `cut -f 3 ../reference-entity-ids.tsv | grep $hraVersion`; do ./check-link.sh $f; done;
