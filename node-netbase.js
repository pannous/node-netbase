#!/usr/bin/env node
require('./extensions.js')()
try{
  require('./netbase-ffi.js')
  console.log("using native netbase-ffi.js")
  return 
}catch(ex){
  console.log("Using online netbase fallback. Reason:")
  console.log(ex.message)
}

wget=url=>require('sync-request')('GET',url)

let cache = {}
setEnglish=()=>{cache={};console.log("XDFDF");api = "http://netbase.pannous.com/json/all/"}
setGerman=()=> {cache={};api = "http://de.netbase.pannous.com:81/json/all/"}

if(process.env.NETBASE_LANGUAGE=="en") setEnglish()
if(process.env.NETBASE_LANGUAGE=="de") setGerman()
else setEnglish()

api_limit = " limit 100"
World = new Proxy({}, { get: (_, object) => getThe(object) });
class Netbase {
  get(id){return proxy(id)}
}
class Edges {
  constructor(node) {
    this.edges = node.statements
    this.object = node
  }
  get first() { return this.edges[0] }
  get last() { return this.edges[this.count - 1] }
  get size() { return this.edges.length }
  get count() { return this.edges.length }
  toString() { return "dsaffa" }
  get toString() { return "dsaffa" }

}
parse = (result) => {
  // console.log(result)
  // console.log(result.results[0].name)
  return result.results[0]
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
    if (edge.predicate.lower == property) {
      // console.log(edge);
      properties.add(edge.oid == node.id ? edge.subject : edge.object)
    }
    if (edge.predicate.lower == property + " of") {
      // console.log(edge);
      properties.add(edge.oid == node.id ? edge.subject : edge.object) // of->inverse!
    }
  }
  for (edge of node.statements) {
    if (edge.predicate.lower.contains(property)) {
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
  property = property.replace("_", " ").lower
  // console.log(node);
  for (edge of node.statements) {
    if (edge.predicate.lower == property) {
      // console.log(edge);
      return edge.oid == node.id ? edge.subject : edge.object
    }
    if (edge.predicate.lower == property + " of") {
      // console.log(edge);
      return edge.oid == node.id ? edge.subject : edge.object
      // return edge.oid == node.id ? edge.object : edge.subject // of->inverse!
    }
  }
  for (edge of node.statements) {  
    if (edge.predicate.lower.contains(property)) {
      // console.log(edge);
      return edge.oid == node.id ? edge.subject : edge.object
    }
  }
  if (property.lower.endsWith("s"))return getProperties(node,property)
}


no_proxy = { lenght: 1, name: 1, inspect:1, edges:1}
function proxify(object = {}) {
  // return object
  return new Proxy(object, {
    get: (_, property) => {
      proto = Object.getPrototypeOf(object)
      if (typeof property == 'symbol' || property[0] == "_" || property in no_proxy) return object[property]
      return object[property] || proto[property] || getProperty(object, property) || "missing :" + property
    }
  });
}
class Node {
  constructor(id, name = 0) {
    this.id = id
    if (name) this.name = name
  }
  load() {
    if(this._edges){
      console.log("already loaded");
      return this;
    }
    let endpoint = this.id ? api + this.id : api + String(this._name) + api_limit
    // let result=fetch(endpoint).then(response=>response.json().then(parse))
    console.log(endpoint);
    var result;
    let file = (this._name || this.id) + ".j5"
    try {
      result = read_json5(file)
    } catch (x) {
      if (exists(file)) console.log(x);
      console.log(wget(endpoint))
      let json=string(wget(endpoint).body)
      console.log(json)
      result = parse(JSON.parse(json))
      try{
        save_json5(file,result)
      }catch(ex){console.log("can't cache "+file)}
    }
    Object.defineProperty(this, "_edges", { enumerable: false, value: new Edges(result) });
    Object.defineProperty(this, "statements", { enumerable: false, value: result.statements });
    delete result.statements // ^^
    if (!result.description)delete result.description
    if (result.description)this.description = result.description
    // this.topic = result.topic || result.class
    this.class = result.class || result.topic
    proxy = proxify(this)
  // node.kind=result.kind
  // node.image=result.image
  // node.statementCount=result.statementCount
    // delete result.kind
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



module.exports = exports = {getThe:getThe, get:getThe,setGerman:setGerman,setEnglish:setEnglish}
