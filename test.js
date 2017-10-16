#!/usr/bin/env node
// netbase=require('./node-netbase.js')
netbase=require('netbase')
console.log(netbase)

netbase.setEnglish()
n=netbase.get(1)
console.log(n.name)
assert(n.name=="Universe")

netbase.setGerman()

merkel=netbase.get("Angela Merkel")
assert(merkel.Vorname="Angela")


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
console.log(World.Berlin.Hauptstadt)
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

return 

function proxify(object={}){
  proto=Object.getPrototypeOf(object)
  this.proxy=new Proxy(object,{
  get: function(proxy, name) {
    if(proxy.hasOwnProperty(name)){
      console.log('GOT: '+ name)
      return proxy[name]
    }
    else {
      miss=()=>{console.log('Method missing() : '+String(name)) }
      return proxy[name] || proto[name] || console.log('Property missing: '+ String(name)) || miss
      //object.__lookupGetter__(name) || 
    }
  }
  });
  return this.proxy
}

// a=new Proxy({},{
//   get: function(proxy, name) {
//     if(proxy.hasOwnProperty(name)){
//       console.log('GOT: '+ name)
//       return proxy[name]
//     }
//     else {
//       console.log('Property missing: ')//+ name)
//       console.log(name)
//       // return Promise(name +"will come;")
//       return ()=>{
//         console.log('Method missing: ')
//         console.log(name)
//       }
//     }
//   }
// });
class C{
  get hi(){console.log("HIHI ");return "HIHI"}
  ho(x){console.log("HOHO "+x);return "HOHO"}
}
b=new C()
// b={hi:(x)=>console.log(x)}
b.hi//("HO")
b['hi']
b.ho("HO")
b['ho']("HO")
a=new Proxy(b,{})// Don’t intercept anything WORKS
a.hi
a.ho("HHHH")
a['hi']
a['ho']("HO")
// a.hi("HA")
a=proxify(b)
a.hi
a.ho("HHHH")
// a.hi("HA")
a['hi']
a['ho']("HAA")
a['hix']
a.hox
a.hox()
a.b='c'
console.log(a.b)
e={f:3}
console.log(e)
console.log(e.f)
Object.assign(e,a)
console.log(e.f)
console.log(e.g)
