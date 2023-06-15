#!/bin/bash

status=$(curl -o /dev/null -Isw '%{http_code}\n' $1)

if [ "$status" != "200" ]; then
  echo $status $1
  exit -1
fi
