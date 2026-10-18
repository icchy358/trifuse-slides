const {chromium,devices}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({...devices['iPhone 13']})).newPage();
await p.goto('file://'+process.cwd()+'/out/'+(process.env.DECK||'oil100_lecture_svg_photo.html')#'+process.argv[2]);await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{const r=[];document.querySelectorAll('.slide.active *').forEach(e=>{const b=e.getBoundingClientRect();if(b.right>392)r.push(e.tagName+' '+(e.getAttribute('class')||'')+' '+Math.round(b.left)+'-'+Math.round(b.right))});return r.slice(0,12).join('\n')}));await b.close()})();
