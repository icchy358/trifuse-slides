const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{
  const b=await chromium.launch();
  for(const f of process.argv.slice(2)){
    const p=await b.newPage({viewport:{width:1280,height:720}});
    const errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+process.cwd()+'/out/'+f+'.html',{waitUntil:'domcontentloaded'});
    const n=await p.$$eval('.slide',s=>s.length);
    for(let i=0;i<n;i++){
      await p.evaluate(i=>{location.hash='#'+(i+1)},i);
      await p.reload({waitUntil:'domcontentloaded'});
      await p.waitForTimeout(500);
      // advance all steps for review
      await p.evaluate(()=>{const s=document.querySelector('.slide.active');const m=+s.dataset.steps||0;s.dataset.cur=m;s.querySelectorAll('[data-s]').forEach(e=>e.classList.add('on'));});
      await p.waitForTimeout(2600);
      // overflow check: any element in .body extending beyond body bottom
      const ov=await p.evaluate(()=>{const s=document.querySelector('.slide.active');const b=s.querySelector('.body');if(!b)return '';const bb=b.getBoundingClientRect();let worst=0;b.querySelectorAll('*').forEach(e=>{const r=e.getBoundingClientRect();if(r.height&&r.bottom>bb.bottom+1)worst=Math.max(worst,r.bottom-bb.bottom)});return worst?('overflow '+Math.round(worst)+'px'):''});
      if(ov)console.log(f,i+1,ov);
      await p.screenshot({path:`shots/${f}_${String(i+1).padStart(2,'0')}.png`});
    }
    if(errs.length)console.log(f,'ERR',errs);
  }
  await b.close();
})();
