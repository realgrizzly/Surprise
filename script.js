// ===== ตั้งค่าข้อความและวันสำคัญตรงนี้ได้ =====
const CONFIG = {
  anniversary: "", // รูปแบบ YYYY-MM-DD เช่น 2025-02-14
  recipient: "Nerst"
};

const $ = id => document.getElementById(id);
function toast(text){const t=$('toast');t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

// Mobile navigation
$('menuBtn').addEventListener('click',()=>$('navlinks').classList.toggle('show'));
document.querySelectorAll('.navlinks a').forEach(a=>a.addEventListener('click',()=>$('navlinks').classList.remove('show')));

// Letter interaction
function openLetter(){
 $('envelope').classList.add('open');
 $('letterCopy').classList.add('show');
 $('openLetter').textContent='จดหมายจากใจ ♡';
 $('openLetter').disabled=true;
 $('openLetter').style.opacity='.65';
}
$('openLetter').addEventListener('click',openLetter);
$('envelope').addEventListener('click',openLetter);
$('envelope').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openLetter()}});

// Memory photo uploader: selected photos stay in this browser session only.
$('photoUpload').addEventListener('change',e=>{
 const files=[...e.target.files].slice(0,3);
 if(!files.length)return;
 const cards=[...document.querySelectorAll('.memory')];
 files.forEach((file,i)=>{
  const img=cards[i].querySelector('img');
  const ph=cards[i].querySelector('.ph');
  const url=URL.createObjectURL(file);
  img.src=url;img.style.display='block';ph.style.display='none';
 });
 if(files[0]){
  const url=URL.createObjectURL(files[0]);
  $('heroPhoto').src=url;$('heroPhoto').style.display='block';$('heroPlaceholder').style.display='none';
 }
 toast('เพิ่มรูปภาพเรียบร้อยแล้ว ♡');
});

// Anniversary counter
const dateInput=$('anniversaryDate');
const savedDate=localStorage.getItem('nerstAnniversary')||CONFIG.anniversary;
if(savedDate)dateInput.value=savedDate;
function updateCounter(){
 const value=dateInput.value;
 if(!value){['daysNum','hoursNum','minsNum','secsNum'].forEach(id=>$(id).textContent='—');return;}
 const start=new Date(value+'T00:00:00');
 const now=new Date();
 if(Number.isNaN(start.getTime())||start>now){['daysNum','hoursNum','minsNum','secsNum'].forEach(id=>$(id).textContent='0');return;}
 let diff=now-start;
 const days=Math.floor(diff/86400000);diff%=86400000;
 const hours=Math.floor(diff/3600000);diff%=3600000;
 const mins=Math.floor(diff/60000);const secs=Math.floor((diff%60000)/1000);
 $('daysNum').textContent=days.toLocaleString('th-TH');
 $('hoursNum').textContent=String(hours).padStart(2,'0');
 $('minsNum').textContent=String(mins).padStart(2,'0');
 $('secsNum').textContent=String(secs).padStart(2,'0');
}
$('saveDate').addEventListener('click',()=>{
 if(!dateInput.value){toast('เลือกวันเริ่มต้นก่อนนะ');return;}
 if(new Date(dateInput.value+'T00:00:00')>new Date()){toast('วันที่เริ่มต้นต้องไม่ใช่วันในอนาคต');return;}
 localStorage.setItem('nerstAnniversary',dateInput.value);updateCounter();toast('บันทึกวันสำคัญแล้ว ♡');
});
dateInput.addEventListener('change',updateCounter);
updateCounter();setInterval(updateCounter,1000);

// Couple quiz — edit questions/options/answer index to personalize.
const questions=[
 {q:'ถ้ามีวันว่างด้วยกัน เราอยากทำอะไรมากที่สุด?',a:['ไปเที่ยวด้วยกัน','นอนดูหนัง','กินของอร่อย','ได้อยู่ด้วยกันก็พอ'],correct:3,why:'จริง ๆ แค่มีเธออยู่ด้วยก็พิเศษแล้ว ♡'},
 {q:'สิ่งไหนทำให้วันธรรมดาของเราดีขึ้น?',a:['ข้อความจากเธอ','รอยยิ้มของเธอ','เสียงหัวเราะของเรา','ทั้งหมดเลย'],correct:3,why:'ทุกอย่างที่เป็นเธอเลย'},
 {q:'ถ้าเลือกได้ อยากเก็บอะไรไว้ให้นานที่สุด?',a:['รูปถ่าย','ของขวัญ','ช่วงเวลาที่อยู่ด้วยกัน','แชตเก่า ๆ'],correct:2,why:'ความทรงจำที่มีเธอมีค่าที่สุด'},
 {q:'สุดท้ายแล้ว เราอยากบอกอะไรกับเธอ?',a:['ขอบคุณนะ','คิดถึงนะ','รักนะ','ถูกทุกข้อ'],correct:3,why:'ใช่เลย ทั้งหมดนี้อยากบอกเธอเสมอ 💗'}
];
let qIndex=0,answered=false,score=0;
function renderQuestion(){
 const q=questions[qIndex];answered=false;
 $('quizStep').textContent=`QUESTION ${String(qIndex+1).padStart(2,'0')} / ${String(questions.length).padStart(2,'0')}`;
 $('quizQuestion').textContent=q.q;$('quizProgress').style.width=(qIndex/questions.length*100)+'%';
 $('quizFeedback').textContent='';$('nextQuestion').hidden=true;
 $('nextQuestion').textContent=qIndex===questions.length-1?'ดูข้อความสุดท้าย ♡':'ข้อต่อไป →';
 $('answers').innerHTML='';
 q.a.forEach((answer,i)=>{
  const b=document.createElement('button');b.className='answer';b.textContent=answer;
  b.addEventListener('click',()=>{
   if(answered)return;answered=true;
   [...$('answers').children].forEach(x=>x.disabled=true);
   b.classList.add('selected');
   if(i===q.correct){score++;$('quizFeedback').textContent=q.why;}
   else $('quizFeedback').textContent='คำตอบนี้ก็น่ารักนะ แต่คำตอบจากใจเราคือ… '+q.a[q.correct]+' ♡';
   $('nextQuestion').hidden=false;
   $('quizProgress').style.width=((qIndex+1)/questions.length*100)+'%';
  });
  $('answers').appendChild(b);
 });
}
$('nextQuestion').addEventListener('click',()=>{
 if(qIndex<questions.length-1){qIndex++;renderQuestion();}
 else{
  $('quizStep').textContent='A LITTLE MESSAGE FOR YOU';
  $('quizQuestion').textContent='ไม่ว่าจะตอบข้อไหน เธอก็เป็นคนพิเศษของเราเสมอ 💗';
  $('answers').innerHTML='';$('quizFeedback').textContent=`ตอบตรงใจ ${score} / ${questions.length} ข้อ — ขอบคุณที่เล่นด้วยกันนะ`;
  $('nextQuestion').textContent='เล่นอีกครั้ง';$('nextQuestion').hidden=false;
  $('nextQuestion').onclick=()=>{qIndex=0;score=0;$('nextQuestion').onclick=null;renderQuestion();};
 }
});
renderQuestion();

// Tiny heart game
const gameButtons=[...document.querySelectorAll('.heart-choice')];
let lucky=Math.floor(Math.random()*gameButtons.length),gamePlayed=false;
function setupGame(){
 lucky=Math.floor(Math.random()*gameButtons.length);gamePlayed=false;
 gameButtons.forEach(b=>{b.disabled=false;b.textContent='♡';b.style.background='';b.style.borderColor='';});
 $('gameResult').textContent='หัวใจดวงไหนจะเป็นของเธอนะ?';
}
gameButtons.forEach((b,i)=>b.addEventListener('click',()=>{
 if(gamePlayed)return;gamePlayed=true;
 gameButtons.forEach((btn,j)=>{btn.disabled=true;if(j===lucky){btn.textContent='♥';btn.style.background='#f3e7e3';btn.style.borderColor='#bd827d';}else btn.textContent='·';});
 $('gameResult').textContent=i===lucky?'เธอเจอหัวใจดวงพิเศษแล้ว! เราขอมอบหัวใจดวงนี้ให้เธอ ❤️':'หัวใจดวงพิเศษอยู่ตรงนี้นะ แต่ทุกดวงก็เป็นของเธออยู่ดี ♡';
}));
$('restartGame').addEventListener('click',setupGame);
