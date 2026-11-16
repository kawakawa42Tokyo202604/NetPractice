const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const results = [];
for (let n = 1; n <= 10; n++) {
  const fields = new Map();
  const context = vm.createContext({console, document: {
    getElementById(id) {
      if (!fields.has(id)) throw new Error('Missing field: ' + id);
      return fields.get(id);
    }
  }});
  for (const f of ['show.js','sim.js',`level${n}.js`]) {
    vm.runInContext(fs.readFileSync(path.join(root,'net_practice/js',f),'utf8'),context,{filename:f});
  }
  vm.runInContext(`
    g_my_login = 'student';
    g_rand_prev = level + hash_login(g_my_login);
    hosts.forEach(h => routes.forEach(r => {
      if (h.id === r.hid) { get_route_info(r); r.h = h; }
    }));
    ifs.forEach(i => {
      i.ip = random_repl(i.ip);
      i.mask = random_repl(i.mask);
      if (i.ip === null || i.mask === null) throw new Error('Invalid random syntax');
      i.h = hosts.find(h => h.id === i.hid);
    });
    links.forEach(l => {
      l.e1 = ifs.find(i => i.if === l.if1);
      l.e2 = ifs.find(i => i.if === l.if2);
      l.h1 = hosts.find(h => h.id === l.e1.hid);
      l.h2 = hosts.find(h => h.id === l.e2.hid);
    });
    goals.forEach(prep_goals);
  `,context);
  for (const r of context.routes) {
    fields.set('route_'+r.rid,{value:r.route});
    fields.set('gate_'+r.rid,{value:r.gate});
  }
  for (const i of context.ifs) {
    fields.set('ip_'+i.if,{value:i.ip});
    fields.set('mask_'+i.if,{value:i.mask});
  }
  const exported = JSON.parse(fs.readFileSync(path.join(root,`level${n}.json`),'utf8'));
  for (const [id,values] of Object.entries(exported.routes)) {
    const r=context.routes.find(r=>r.rid===id);
    if (!r) throw new Error('Unknown route '+id);
    for (const [key,value] of Object.entries(values)) {
      if (r[key+'_edit']!=='true') throw new Error('Changed fixed route field');
      fields.get(key+'_'+id).value=value;
    }
  }
  for (const [id,values] of Object.entries(exported.ifs)) {
    const i=context.ifs.find(i=>i.if===id);
    if (!i) throw new Error('Unknown interface '+id);
    for (const [key,value] of Object.entries(values)) {
      if (i[key+'_edit']!=='true') throw new Error('Changed fixed interface field');
      fields.get(key+'_'+id).value=value;
    }
  }
  const goals=vm.runInContext('goals.map(g => ({id:g.id,...sim_goal(g)}))',context);
  if (!goals.length) throw new Error('No goals found');
  results.push({level:n,login:'student',goals,passed:goals.every(g=>g.status===1)});
}
for(const r of results)console.log('Level',r.level,r.passed?'PASS':'FAIL',r.goals.map(g=>g.status).join(','));
if(results.some(r=>!r.passed))process.exitCode=1;
