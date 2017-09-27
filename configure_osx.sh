#!/bin/sh

echo "alias mcat='node $(dirname $0)/index.js'" >> "$HOME/.profile"
echo "Added mcat alias to your ~/.profile"
echo "Run 'source ~/.profile' to add it to your current session or restart to access it in future sessions."
