#!/bin/bash

# clone the ui and copy web files over to plucky
git clone ssh://git@bitbucket.pearson.com/occ/plucky-console-ui.git ../plucky-console-ui
cd ../plucky-console-ui
npm install
node ./node_modules/webpack/bin/webpack.js
cp -r web ../plucky/

# clone the configuration file and copy over files to plucky
cd ..
git clone ssh://git@bitbucket.pearson.com/occ/plucky-console-config.git plucky-console-config
cp -r plucky-console-config/config plucky/config
cp -r plucky-console-config/projects plucky/projects

cd plucky
npm install
