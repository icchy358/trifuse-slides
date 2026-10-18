const {chromium,devices}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{
  const b=await chromium.launch();
  const ctx=await b.newContext({...devices['iPhone 13']});
  const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+process.cwd()+'/out/'+(process.env.DECK||'oil100_lecture_svg_photo.html')');
  const n=await p.$$eval('.slide',s=>s.length);
  for(let i=0;i<n;i++){
    await p.evaluate(i=>{location.hash='#'+(i+1)},i);await p.reload();await p.waitForTimeout(2600);await p.addStyleTag({content:'#notes{display:none!important}#nav{position:static!important}'});const ov=await p.evaluate(()=>{const r=[];document.querySelectorAll('.slide.active *').forEach(e=>{const b=e.getBoundingClientRect();if(b.width>0&&(b.right>392||b.left<-2))r.push(e.tagName+'.'+e.className.baseVal??e.className)});return r.slice(0,6)});if(ov.length)console.log(i+1,ov);
    const w=await p.evaluate(()=>document.documentElement.scrollWidth);
    if(w>400)console.log('slide',i+1,'scrollWidth',w);
    await p.screenshot({path:`shots/m_${String(i+1).padStart(2,'0')}.png`,fullPage:true});
  }
  console.log(errs);await b.close();
})();
