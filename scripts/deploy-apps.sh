#!/bin/bash

set -e

rootDir=`pwd`

echo "## Coinsence apps bootstrap"
echo ""
echo "Setting up each aragon app in ./apps"
echo "a new app version will be deployed"
echo "----"

for dir in ./apps/*/; do
  set -x
  cd $dir
  aragon apm publish major 
  cd $rootDir
  set +x
done

echo "Done, new versions of all apps deployed"
