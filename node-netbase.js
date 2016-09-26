var child_process=require('child_process') 
var system=child_process.execSync
var ffi = require('ffi');
var struct = require('ref-struct');
var ref = require('ref')
var ArrayType = require('ref-array') // ArrayType(int)=int[] vs char**=ref.refType(charPtr);
// var wget = require('node-wget');
// var addons = require('addons'); // for C++ structures, not needed here
VOID='void'
BOOL='bool'
DOUBLE='double'
INT=int='int'
LONG=long='long'
POINTER='pointer'
// Statement='pointer'
// NODE='pointer'
// NodeVector='pointer' // not C compatible
STRING='string'
// charPtr = ref.refType('char');
// StringArray = ArrayType('string');
// charPtrPtr = ref.refType(charPtr);
// CharPtrArray = ArrayType(charPtr);

var Node0=struct( {
    id:int,
    name:STRING,
    kind:int,
    statementCount:int,
    firstStatement:int ,
		lastStatement:int,
    value:POINTER ,
  })
Node=ref.refType(Node0)
var Statement0=struct({
    context:int ,
    subject:int ,
    predicate:int,
    object:int,
    nextSubjectStatement:int,
    nextPredicateStatement:int,
    nextObjectStatement:int,
  })
Statement=ref.refType(Statement0)

netbase = ffi.Library(__dirname+'/lib/netbase', {
  ceil: [ DOUBLE, [ DOUBLE ]/*,abi|async|varargs*/ ],
  printf:[VOID,[STRING]] ,
  allowWipe:[VOID,[]],
  setMemoryLimit:[LONG,[LONG]],
  init:[VOID,[BOOL/*relations*/]], 
  //////////
  import:[VOID,[STRING/*type*/]],
  execute:[VOID,[STRING]] ,
  learn:[VOID,[STRING]] ,
  // query:[VOID,[STRING]] ,
  add:[Node,[STRING/* nodeName*/]],//, int kind
  addStatement:[Statement,[Node,Node,Node]],
  addStatement4:[Statement,[int,int,int]],
  get:[Node,[int/*NodeId*/]],
  getName:[STRING,[int/* node*/]],
  getText:[STRING,[Node]],
  getData:[POINTER,[int/* node*/]],
  getAbstract:[Node,[STRING]],
  getThe:[Node,[STRING]],
  getNew:[Node,[STRING]],
  getStatementId:[int,[long/*pointer ?*/]],
  hasNode:[BOOL,[STRING]],
  // import:[VOID,[STRING/*type*/,STRING/*filename*/]],
  setLabel:[Node,[STRING]],
  setName:[INT,[STRING]],
  deleteNode:[VOID,[INT]],
  deleteStatement:[VOID,[INT]],
  has:[Node,[Node,Node]],
});
netbase.parse=netbase.execute
netbase.query=netbase.parse
netbase.importTypes={all:'all',labels:'labels',wordnet:'wordnet',freebase:'freebase',geodb:'geodb',location:'geodb',dbpedia:'dbpedia',names:'names',images:'images',wikidata:'wikidata',yago:'yago',amazon:'amazon',test:'test',}
netbase.help=()=>netbase.execute('help')
netbase.importWordnet=()=>netbase.import(netbase.importTypes.wordnet)
netbase.server=()=>netbase.execute(":server")

// StructType.show=function(it) {console.log(it.deref())}
netbase.show=function(it) {
	if(!it)it="<null>"
	if(it.type && it.type.toString()=='[StructType]')it=it.deref()
	console.log(it)
}
netbase.shared_memory={}
netbase.shared_memory._2GB=2147483648  
netbase.shared_memory._4GB=4294967296  
netbase.shared_memory._6GB=6442450944	
netbase.shared_memory._8GB=8589934592  
netbase.shared_memory._16GB=17179869184
netbase.shared_memory._32GB=34359738368
netbase.shared_memory._64GB=68719476736
// x=netbase.ceil(1.5); // 2
// console.log(x)
netbase.allowWipe()
netbase.init(true)
netbase.learn("a.b=c")
// netbase.execute("help")
b=netbase.get(5)
netbase.show(b)
if(!netbase.hasNode('bug'))
	netbase.import(netbase.importTypes.wordnet)
c=netbase.query("a.b")
netbase.show(c)

function importAndDownload(type,file){
    if(file)netbase.import(type,file)
    if(!file){
      system( __dirname+"/import/download-"+type+".sh")
      netbase.import(type)
    }
}
// netbase.server()
// if (fun_object.isNull()) 
module.exports = {
  query:netbase.query,
  import:importAndDownload,
}
