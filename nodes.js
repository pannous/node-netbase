require('./extensions.js')()
api = "http://netbase.pannous.com/json/all/"
api_limit = " limit 100"
World = new Proxy({}, { get: (_, object) => getThe(object) });
let cache = {}
class Netbase {
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
get=getThe
exports = [getThe, get]

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
      result = parse(JSON.parse(wget(endpoint)))
      save_json5(file,result)
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

n = proxy(1)
// n.prototype.toString = function(){return "[object Foo]";}
// n.toString = function(){return "[object Foo]";}

console.log(n)
console.log(n.name)
console.log(n.edges.size)
console.log(n)
u = getThe("Universe")
console.log(u)
// assert(u == n)
// console.log(n.edges)
console.log(n)
console.log(n.type)
console.log(n.superclass)
// n.show()
// n.predicates = function* () { for (e of this.statements) yield e.predicate }// enables:
// console.log(n.predicates)
// for (p of n.predicates())
//   console.log(p);

// console.log(n._edges)
// console.log(n.edges[1])
// console.log(n.edges)
// console.log(n.seo)
// console.log(n.topic)
// // console.log(n.kind)
// console.log(n.statements)// BAAD!! INVISIBLE!
// console.log(n.edges.first)
// console.log(n.edges.last.predicate)

// assert(n.name=="Universe")
// assert(n.seo=="universe")
// // console.log(n.edges)
// console.log(World.Germany.browse());
// console.log(World.Germany.name)
console.log(World.Berlin)
console.log(World.Berlin.name)
// console.log(World.Berlin.topic)
console.log(World.Berlin.class)
console.log(World.Berlin.area)
console.log(World.Berlin.part)
console.log(World.Berlin.sister)
console.log(World.Berlin.Contains)
console.log(World.Berlin.instance)
console.log(World.Berlin.point)
console.log(World.Berlin.borders)
console.log(World.Berlin.Capital)
// console.log(World.Germany.predicates);
console.log(World.Berlin.Capital_of)
// console.log(World)

console.log(World.Berlin.predicates)

// console.log(World.Germany.official_name);
// console.log(World.Germany.capital);
// console.log(World.Germany.capital_of);
// console.log(World.Germany.Capital_of);
// console.log(World.Germany.Part_of);
// console.log(World.Germany.type);
// console.log(World.Germany.edges.count);
// console.log(World.Germany.predicates.count); 
console.log(World.Hasloh.type);