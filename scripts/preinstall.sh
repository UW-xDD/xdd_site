#!/bin/sh
npm install --save-dev linklocal bulk

# Link local dependencies and install _their_ dependencies
linklocal --link -r
linklocal --list -r | bulk -c 'npm install --silent'

# Remove react and react-dom
cd bundledDeps/ui-components/node_modules
rm -rf react react-dom
