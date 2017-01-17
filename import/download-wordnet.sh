cd import
echo "Downloading wordnet..."
wget -N http://pannous.net/files/wordnet.zip
echo "Extracting wordnet..."
yes|unzip wordnet.zip
rm wordnet.zip