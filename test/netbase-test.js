#!/usr/bin/env node
try{
	netbase = require('netbase')
}catch(ex){
	netbase = require('../node-netbase.js')
	// console.log("npm install -g #from local")
	console.log("npm install -g netbase")
// console.error(ex)
}
netbase.setDebug()
show = netbase.show
query = netbase.query;

netbase.import('wordnet')

result=netbase.query('bug')
// console.log(result)
console.log(result.statementCount)

// result=netbase.summary('bug')
function showPropertyFrequencies() {
	result=netbase.summary(-101)
	console.log(result)
	for(i of range(-15000,-25000,-1)) {
		result=netbase.summary(i)
		print("\r"+i)
		if(!result||empty(result))continue
		print("\r")
		console.log(result.statementCount,result.name,i);
	}
}

if(netbase.testAll)netbase.testAll() // native !
else netbase.query(':test')
// show(result)
// require('netbase')
// var should = require('chai').should(),
//     netbase = require('../node-netbase'),
//     query = netbase.query;

// describe('#query', function() {
//   it('queries the netbase graph', function() {
//     query('help').should.equal('&amp;');
//   });
