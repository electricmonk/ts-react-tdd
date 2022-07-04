#!/bin/bash
while read line ; do
    echo "$(date +%T): ${line}"
done
exit ${PIPESTATUS[0]} # so that exit code is preserved