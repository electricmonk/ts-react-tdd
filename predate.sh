#!/bin/bash
while read line ; do
    echo "$(date +%T): ${line}"
done
