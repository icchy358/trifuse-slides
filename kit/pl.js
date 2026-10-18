const {chromium,devices}=require(require('child_process').execSync('npm root -g').toString().trim()+'/playwright');
(async()=>{const b=await chromium.launch();
for(const [nm,opt] of [['d',{viewport:{width:1280,height:720}}],['m',devices['iPhone 13']]]){
const p=await (await b.newContext(opt)).newPage();
await p.goto('file://'+process.cwd()+'/out/'+(process.env.DECK||'oil100_lecture_svg_photo.html')#14');await p.waitForTimeout(1200);
for(let i=0;i<5;i++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(400)}
await p.waitForTimeout(1500);await p.screenshot({path:'shots/plane_'+nm+'.png'});}
await b.close()})();
