#!/usr/bin/env node
netbase = require('netbase'),
show = netbase.show,
query = netbase.query;

netbase.import('wordnet')
// result=netbase.query('opposite of bad')
result=netbase.query('bug')
// netbase.test() // native !
netbase.testAll() // native !
// show(result)
// require('netbase')
// var should = require('chai').should(),
//     netbase = require('../node-netbase'),
//     query = netbase.query;

// describe('#query', function() {
//   it('queries the netbase graph', function() {
//     query('help').should.equal('&amp;');
//   });