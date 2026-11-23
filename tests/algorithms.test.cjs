const assert=require('node:assert/strict');
const {astar,hill,minimax,winner}=require('../dist/algorithms.js');
let passed=0;const test=(name,fn)=>{fn();passed++;console.log('PASS '+name);};
test('A*: empty grid shortest Manhattan path',()=>{const r=astar(3,4,new Set(),[0,0],[2,3]);assert.equal(r.cost,5);assert.equal(r.path.length,6);});
test('A*: unreachable goal',()=>assert.equal(astar(3,3,new Set([1,3]),[0,0],[2,2]).cost,null));
test('A*: start equals goal',()=>assert.equal(astar(3,3,new Set(),[1,1],[1,1]).cost,0));
test('A*: optimality against independent BFS on 80 seeded maps',()=>{let seed=41;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/2**32;};for(let k=0;k<80;k++){const walls=new Set();for(let i=1;i<35;i++)if(rand()<.28)walls.add(i);const q=[[0,0]],seen=new Set([0]);let expected=null;for(let j=0;j<q.length;j++){const [u,d]=q[j];if(u===35){expected=d;break;}const r=Math.floor(u/6),c=u%6;for(const [nr,nc]of [[r-1,c],[r+1,c],[r,c-1],[r,c+1]])if(nr>=0&&nr<6&&nc>=0&&nc<6){const v=nr*6+nc;if(!seen.has(v)&&!walls.has(v)){seen.add(v);q.push([v,d+1]);}}}const actual=astar(6,6,walls,[0,0],[5,5]);assert.equal(actual.cost,expected);actual.path.forEach((v,i)=>{assert.ok(!walls.has(v));if(i)assert.equal(Math.abs(Math.floor(v/6)-Math.floor(actual.path[i-1]/6))+Math.abs(v%6-actual.path[i-1]%6),1);});}});
test('Hill: local maximum trap',()=>{const r=hill([1,3,7,5,4,6,9,8,2],0);assert.deepEqual(r.path,[0,1,2]);assert.equal(r.isGlobal,false);});
test('Hill: alternative start reaches global maximum',()=>assert.equal(hill([1,3,7,5,4,6,9,8,2],5).value,9));
test('Hill: plateau and negative numbers',()=>{assert.deepEqual(hill([-3,-3,-1],0).path,[0]);assert.equal(hill([-5,-3,-1],0).value,-1);});
test('Hill: invalid input rejected',()=>assert.throws(()=>hill([1,NaN],0)));
test('Minimax: takes immediate winning move',()=>assert.equal(minimax(['O','O',null,'X','X',null,null,null,null]).move,2));
test('Minimax: blocks immediate threat',()=>assert.equal(minimax(['X','X',null,null,'O',null,null,null,null]).move,2));
test('Minimax: preserves input board',()=>{const b=['X',null,null,null,null,null,null,null,null],copy=[...b];minimax(b);assert.deepEqual(b,copy);});
test('Minimax: never loses against all possible human moves',()=>{let terminals=0;const cache=new Map();function walk(b){const w=winner(b);if(w){assert.notEqual(w,'X');terminals++;return;}for(let i=0;i<9;i++)if(!b[i]){const next=[...b];next[i]='X';const after=winner(next);if(after){assert.notEqual(after,'X');terminals++;continue;}const k=next.map(x=>x||'-').join('');let choice=cache.get(k);if(choice===undefined){choice=minimax(next).move;cache.set(k,choice);}next[choice]='O';walk(next);}}walk(Array(9).fill(null));assert.ok(terminals>0);console.log('  verified terminal human-play branches: '+terminals);});


const {bfs,maze,randomRestart}=require('../dist/algorithms.js');
test('BFS: exact shortest path and no-path handling',()=>{assert.equal(bfs(3,4,new Set(),[0,0],[2,3]).cost,5);assert.equal(bfs(3,3,new Set([1,3]),[0,0],[2,2]).cost,null);assert.equal(bfs(3,3,new Set(),[1,1],[1,1]).cost,0);});
test('Generated maps: reproducible seed, protected endpoints',()=>{const a=maze(12,18,[1,1],[10,16],.3,42),b=maze(12,18,[1,1],[10,16],.3,42);assert.deepEqual(a,b);assert.ok(!a.has(19)&&!a.has(196));assert.notDeepEqual(a,maze(12,18,[1,1],[10,16],.3,43));});
test('A* and BFS: agreement over 100 generated maps',()=>{for(let seed=0;seed<100;seed++){const w=maze(12,18,[1,1],[10,16],.3,seed);assert.equal(astar(12,18,w,[1,1],[10,16]).cost,bfs(12,18,w,[1,1],[10,16]).cost);}});
test('Random Restart: deterministic results and genuine best run',()=>{const v=[1,3,7,5,4,6,9,8,2],r=randomRestart(v,20,42);assert.deepEqual(r,randomRestart(v,20,42));assert.equal(r.best.value,Math.max(...r.runs.map(x=>x.value)));r.runs.forEach(x=>assert.deepEqual(x.path,hill(v,x.start).path));assert.equal(r.best.value,9);});
test('Random Restart: invalid count rejected',()=>{for(const n of [0,21,1.5,NaN])assert.throws(()=>randomRestart([1,2],n));});
test('Random Restart: limited restarts cannot promise global maximum',()=>{let trapped=false;for(let seed=0;seed<100;seed++)if(randomRestart([1,3,7,5,4,6,9,8,2],1,seed).best.value<9)trapped=true;assert.equal(trapped,true);});
test('Minimax medium: limited search, win and block',()=>{const b=['X',null,null,null,'O',null,null,null,null];assert.ok(minimax(b,'O',{depth:3}).nodes<minimax(b).nodes);assert.equal(minimax(['O','O',null,'X','X',null,null,null,null],'O',{depth:3}).move,2);assert.equal(minimax(['X','X',null,null,'O',null,null,null,null],'O',{depth:3}).move,2);});
test('Minimax tree: root MAX scores equal reply MIN values',()=>{const r=minimax(['X',null,null,null,'O',null,null,null,'X']);for(const x of r.scores)if(x.replies.length)assert.equal(x.score,Math.min(...x.replies.map(y=>y.score)));assert.equal(r.scores.find(x=>x.move===r.move).score,Math.max(...r.scores.map(x=>x.score)));});
test('Minimax AI-first: never loses for all human responses',()=>{let terminals=0;const cache=new Map();function ai(b){const k=b.map(x=>x||'-').join('');let m=cache.get(k);if(m===undefined){m=minimax(b).move;cache.set(k,m);}const n=[...b];n[m]='O';human(n);}function human(b){const w=winner(b);if(w){assert.notEqual(w,'X');terminals++;return;}for(let i=0;i<9;i++)if(!b[i]){const n=[...b];n[i]='X';const w=winner(n);if(w){assert.notEqual(w,'X');terminals++;}else ai(n);}}ai(Array(9).fill(null));assert.ok(terminals>0);console.log('  verified AI-first terminal branches: '+terminals);});


const {dfs}=require('../dist/algorithms.js');
test('DFS: depth-first order and non-shortest route example',()=>{const r=dfs(2,3,new Set(),[0,0],[1,0]);assert.deepEqual(r.path,[0,1,2,5,4,3]);assert.equal(r.cost,5);assert.equal(bfs(2,3,new Set(),[0,0],[1,0]).cost,1);});
test('DFS: unreachable, blocked endpoint and identical endpoints',()=>{assert.equal(dfs(3,3,new Set([1,3]),[0,0],[2,2]).cost,null);assert.equal(dfs(3,3,new Set([0]),[0,0],[2,2]).cost,null);assert.deepEqual(dfs(3,3,new Set(),[1,1],[1,1]).path,[4]);});
test('DFS: 100 maps preserve reachability and return legal cycle-free paths',()=>{for(let seed=0;seed<100;seed++){const walls=maze(12,18,[1,1],[10,16],.3,seed),r=dfs(12,18,walls,[1,1],[10,16]),shortest=bfs(12,18,walls,[1,1],[10,16]);assert.equal(r.cost===null,shortest.cost===null);assert.equal(new Set(r.steps.map(x=>x.node)).size,r.steps.length);if(r.path.length){assert.equal(r.path[0],19);assert.equal(r.path.at(-1),196);assert.ok(r.cost>=shortest.cost);assert.equal(new Set(r.path).size,r.path.length);for(let i=0;i<r.path.length;i++){const v=r.path[i];assert.ok(!walls.has(v));if(i){const u=r.path[i-1];assert.equal(Math.abs(Math.floor(v/18)-Math.floor(u/18))+Math.abs(v%18-u%18),1);}}}}});
console.log(`${passed} tests passed.`);
