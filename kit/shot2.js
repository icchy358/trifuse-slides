const {chromium}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{
  const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
  const errs=[];p.on('pageerror',e=>errs.push(e.message));
  for(const n of [5,7,14]){
    await p.goto('file://'+process.cwd()+'/out/'+(process.env.DECK||'oil100_lecture_svg_photo.html')#'+n);await p.reload();await p.waitForTimeout(2200);
    for(let k=0;k<=5;k++){ if(k>0){await p.keyboard.press('ArrowRight');await p.waitForTimeout(1300);} if(k%2==1||k==0||k==5) await p.screenshot({path:`shots/step_${n}_${k}.png`}); }
  }
  console.log(errs);await b.close();
})();
