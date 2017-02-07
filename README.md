# [node-netbase](https://github.com/pannous/node-netbase)
node.js module for [netbase](https://github.com/pannous/netbase): a semantic Graph Database with wordnet, wikidata, freebase, csv, xml, ... import and export facilities.




## Installation
stable release:

`sudo npm install -g netbase`


install development head:

`sudo npm install -g git://github.com/pannous/node-netbase`

## Usage
```
    netbase = require('netbase'),
    show = netbase.show,
    query = netbase.query;
    
    netbase.import('wordnet')
    result=netbase.query('opposite of bad')
    show(result)
```# netbase-nodejs
