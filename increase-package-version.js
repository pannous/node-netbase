#!/usr/bin/env node
pkfile="package.json"
var fs = require('fs');
fail=(x)=>console.log(x)
try {
fs.readFile(pkfile, 'utf8', (err, data) => {
  console.log('Read ... \t#', pkfile);
  if (err) return fail(err);
  var json = JSON.parse(data);
  console.log('Process ... \t#');
  var old = json.version
  var tmp = old.split('.');
  if (++tmp[2] > 99) {++tmp[1]; tmp[2] = 1;}
  var neu = tmp.join('.');
  console.log('Version  \t#', old, '==>', neu);
  json.version = neu;
  if(json.license == "ISC")
    json.license="GPLv3"

  process.env.npm_package_version = neu;
  data = JSON.stringify(json, null, 4);
  fs.writeFile(pkfile, data, function(err) {
    if (err) {
      fail(err);
    } else {
      console.log('Success. \t#');
    }
  });
});
} catch(err) {
  fail(err);
}
