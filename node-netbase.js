#!/usr/bin/node 
// --harmony --harmony-arrow-functions
require('./extensions.js')()
try{
  if(process.env.NETBASE_LOCAL){
    require('./netbase-ffi.js')
    console.log("using native netbase-ffi.js")
    return 
  }
  else console.log("Using online netbase connector. Set NETBASE_LOCAL env for local native server. ")
}catch(ex){
  console.log("Using online netbase fallback. Reason:")
  console.log(ex.message)
}

wget=url=>require('sync-request')('GET',url)

let cache = {}
let cache_folder=".cache"
// let cache_folder="/tmp/netbase"
mkdir(cache_folder)
var setDebug=()=>{cache={};lang="deb";api = "http://localhost:8080/json/all/"}
var setEnglish=()=>{cache={};lang="en";api = "http://netbase.pannous.com/json/all/"}
var setGerman=()=> {cache={};lang="de";api = "http://de.netbase.pannous.com:81/json/all/"}
var setTest=()=>{ cache={};lang="test";api="http://mimir-dev02.goldcon.de:8181/json/all/"}


if(process.env.NETBASE_LANGUAGE=="en") setEnglish()
if(process.env.NETBASE_LANGUAGE=="de") setGerman()
else setEnglish()

api_limit = " limit 10000"
World = new Proxy({}, { get: (_, object) => getThe(object) });
class Netbase {
  get(id){return proxy(id)}
}
class Edges {
  constructor(node) {
    if(!node)return 
    this.edges = node.statements
    this.object = node
  }
  get first() { return this.edges[0] }
  get last() { return this.edges[this.count - 1] }
  get size() { return this.edges.length }
  get count() { return this.edges.length }
  // toString() { return "dsaffa" }
  // get toString() { return "dsaffa" }

}
getThe = function (name) {
  // if (name == Symbol("util.inspect.custom"))return World //  name ="World"
  if (typeof name == 'symbol')return World
  // console.log(name);
  if (name in cache) return cache[name]
  return proxify(new Node(0, name).load())
  // return fetch(api+name).then(response=>response.json().then(parse).then(create))
}

function getProperties(node, property) {
  property = property.sub(0,-1)
  console.log('getProperties ' + node._name + ":" + property);
  properties=[]
  // console.log(node);
  // console.log(node.edges);
  for (edge of node.statements) {
    if (edge.predicate.toLowerCase() == property) {
      // console.log(edge);
      properties.add(edge.oid == node.id ? edge.subject : edge.object)
    }
    if (edge.predicate.toLowerCase() == property + " of") {
      // console.log(edge);
      properties.add(edge.oid == node.id ? edge.subject : edge.object) // of->inverse!
    }
  }
  for (edge of node.statements) {
    if (edge.predicate.toLowerCase().contains(property)) {
      // console.log(edge);
      properties.add( edge.oid == node.id ? edge.subject : edge.object)
    }
  }
  return properties
}


/*     { id: 2233080, subject: 'Universe', predicate: 'type', object: 'Physical system', sid: 1, pid: -3, oid: 1454986 }, }, */
function getProperty(node, property) {
  console.log('getProperty ' + node._name + ":" + property);
  // console.log(node);
  // console.log(node.edges);
  property = property.replace("_", " ").toLowerCase()
  // console.log(node);
  if(!node.statements)node.load()
  for (edge of node.statements) {
    let predicate=edge.predicate.toLowerCase()
    if (predicate == property) {
      console.log(edge);
      return edge.oid == node.id ? edge.subject : edge.object
    }
    if (predicate == property + " of") {
      console.log(edge);
      return edge.oid == node.id ? edge.subject : edge.object
      // return edge.oid == node.id ? edge.object : edge.subject // of->inverse!
    }
  }
  for (edge of node.statements) {  
    if (edge.predicate.toLowerCase().contains(property)) {
      console.log(edge);
      return edge.oid == node.id ? edge.subject : edge.object
    }
  }
  if (property.endsWith("s"))return getProperties(node,property)
}


no_proxy = { lenght: 1, name: 1, inspect:1, edges:1}
function proxify(object = {}) {
  // return object
  return new Proxy(object, {
    get: (_, property) => {
      proto = Object.getPrototypeOf(object)
      if (typeof property == 'symbol' || property[0] == "_" || property in no_proxy) return object[property]
      return object[property] || proto[property] || getProperty(object, property) || "missing:" + property
    }
  });
}


function loadJson(id){
  let file = cache_folder + "/" + lang + "." +id + ".j5"
  let endpoint = api+id // this.id ? api + this.id : api + String(this._name) + api_limit
  endpoint=endpoint.replace('/all/','/the/')
  console.log(endpoint)
  // let parse = (result) => {return result.results[0] }
  // let result=fetch(endpoint).then(response=>response.json().then(parse))
  try {
    results = JSON.parse(read(file))
  } catch (x) {
    try{
        if (exists(file)) console.log(x);
        let json=wget(endpoint).body //string(
        save_json5(file,json)
        results = JSON5.parse(json)
    }catch(ex){console.error("can't cache "+file+" : "+ex.message);save_json5(file,json)}
  }
  if(results.results) return results.results[0]
  // console.log(results.keys)
  // console.log(dir(results))
  console.log(results[0])
  throw "NO results"
}

class Node {
  constructor(id, name = 0) {
    this.id = id
    this.statementCount=-1
    if (name) this.name = name
  }
  load() {
    if(this._edges){
      console.log("already loaded");
      return this;
    }
    var result=loadJson(this._name||this.id)
    if(!result)return this
    Object.defineProperty(this, "_edges", { enumerable: false, value: new Edges(result) });
    Object.defineProperty(this, "statements", { enumerable: false, value: result.statements });
    delete result.statements // ^^
    if (!result.description)delete result.description
    if (result.description)this.description = result.description
    // this.topic = result.topic || result.class
    this.class = result.class || result.topic
    proxy = proxify(this)
    proxy.kind=result.kind
    proxy.image=result.image
    proxy.statementCount=result.statementCount
    // Object.assign(this,result)
    if (!this.id) this.id = result.id
    this._name = result.name
    cache[this._name] = cache[this.id] = proxy
    return proxy
  }
  browse() { open(api.replace("json", "html") + this.id) }

  get predicates() { return this.statements.map(x => x.predicate).unique() }
  get edges() {
    console.log("edges");
    if (!this._edges) this.load()
    // this._edges=new Edges(this.load());
    return this._edges
  }
  get name() { if (!this._name) this.load(); return this._name }
  set name(n) { this._name = n }
  show() {
    console.log(this.id + "\t" + this.name);
    for (var e of this.statements)
      console.log(e.subject + "\t" + e.predicate + "\t" + e.object);
  }
  // get name() { if(!this.name)this.load();return this.name}
  // Object.defineProperty(this, "name", { enumerable: false, value: n});
}
Node.prototype.getProperty = getProperty
// Node.prototype.toString = function(){return "[object Foo]";}
// n=new Node(1)
function proxy(id) {
  if (id in cache) return cache[id]
  if (typeof id == 'string')
    return getThe(id)
  // return (new Node(id)) // .load() later!
  proxy = proxify(new Node(id)) // .load() later!
  cache[id] = proxy
  // cache[node._name] = node  useless here
  return proxy
}

module.exports = exports = {getThe:getThe, get:getThe,setGerman:setGerman,setEnglish:setEnglish,setDebug:setDebug,has:loadJson}

console.log("DEBUGGG!!!")
setGerman()
brd=getThe("Deutschland").load()