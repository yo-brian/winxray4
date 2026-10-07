const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const text = fs.readFileSync('pac.txt', 'utf8');
function context(local, network) {
  const source = text.replace(/var\s+rules\s*=\s*\[[\s\S]*?\];/, 'var rules = ' + JSON.stringify([local, ...network]) + ';');
  const c = {isInNetEx: (host, cidr) => host === '198.51.100.7' && cidr === '198.51.100.0/24'};
  vm.createContext(c); vm.runInContext(source, c); return c;
}
const local = [['direct.example'], ['proxy.example', '198.51.100.0/24']];
let c = context(local, [[['proxy.example'], ['direct.example', 'old.example']]]);
assert.equal(c.FindProxyForURL('', 'direct.example'), 'DIRECT');
assert.equal(c.FindProxyForURL('', 'www.direct.example'), 'DIRECT');
assert.equal(c.FindProxyForURL('', 'proxy.example'), c.proxy);
assert.equal(c.FindProxyForURL('', '198.51.100.7'), c.proxy);
assert.equal(c.FindProxyForURL('', 'old.example'), c.proxy);
c = context(JSON.parse(JSON.stringify(local)), [[['proxy.example'], ['direct.example', 'new.example']]]);
assert.equal(c.FindProxyForURL('', 'direct.example'), 'DIRECT');
assert.equal(c.FindProxyForURL('', 'proxy.example'), c.proxy);
assert.equal(c.FindProxyForURL('', 'old.example'), 'DIRECT');
assert.equal(c.FindProxyForURL('', 'new.example'), c.proxy);
assert.equal(c.FindProxyForURL('', 'unknown.example'), 'DIRECT');
console.log('PAC priority, subdomain, CIDR and network replacement checks passed.');