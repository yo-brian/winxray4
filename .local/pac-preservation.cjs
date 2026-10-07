const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root='C:/Users/Administrator/AppData/Local/winXray/';
const c={};vm.createContext(c);vm.runInContext(fs.readFileSync(root+'pac-legacy.txt','utf8'),c);
const n=JSON.parse(fs.readFileSync(root+'pac-network.json','utf8'));
assert.equal(JSON.stringify(c.rules),JSON.stringify(n));
console.log('Legacy/network rules preserved; proxy count:',n.reduce((v,g)=>v+g[1].length,0),'direct count:',n.reduce((v,g)=>v+g[0].length,0));