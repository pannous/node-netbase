# node-netbase
node.js module for netbase: a semantic Graph Database with wordnet, wikidata, freebase, csv, xml, ... importer


## Installation
stable:
npm install netbase
install dev:
npm install git://github.com/pannous/node-node

## Usage
```
    netbase = require('netbase'),
    show = netbase.show,
    query = netbase.query;
    
    netbase.import('wordnet')
    result=netbase.query('opposite of bad')
    show(result)
```
