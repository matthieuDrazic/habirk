const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const DAY=86400000;
const iso=d=>new Date(d).toISOString().slice(0,10);
const today=()=>iso(new Date());
const emojis={sport:"🏃",maison:"🧹",sante:"❤️",perso:"🌱"};
const initial={
 xp:0,teeth:120,activeShark:"Requin gris",owned:["Requin gris"],
 goals:[
  {id:"run",name:"Course",category:"sport",type:"period",target:10,unit:"km",repeat:"week",start:today(),flexible:true},
  {id:"gym",name:"Musculation",category:"sport",type:"habit",target:3,unit:"séances",repeat:"week",start:today(),flexible:true},
  {id:"clean",name:"Ménage",category:"maison",type:"habit",target:2,unit:"tâches",repeat:"week",start:today(),flexible:true},
  {id:"read",name:"Lecture",category:"perso",type:"habit",target:5,unit:"séances",repeat:"week",start:today(),flexible:true},
  {id:"annual",name:"Course annuelle",category:"sport",type:"long",target:1000,unit:"km",start:new Date().getFullYear()+"-01-01",end:new Date().getFullYear()+"-12-31",source:"run"},
  {id:"weight",name:"Poids",category:"sante",type:"metric",target:62,unit:"kg",start:today(),end:iso(new Date(Date.now()+180*DAY)),baseline:70}
 ],activities:[],historyWeeks:[72,81,66,88,76,91,84,0]
};
let data=JSON.parse(localStorage.getItem("sharkHabitsV2")||"null")||initial;
let weekOffset=0, filter="all";
function save(){localStorage.setItem("sharkHabitsV2",JSON.stringify(data))}
function monday(d=new Date()){d=new Date(d); let n=(d.getDay()+6)%7; d.setHours(0,0,0,0); d.setDate(d.getDate()-n); return d}
function periodBounds(g,date=new Date()){
 let d=new Date(date), s,e;
 if(g.repeat==="day"){s=new Date(d);s.setHours(0,0,0,0);e=new Date(s.getTime()+DAY)}
 else if(g.repeat==="month"){s=new Date(d.getFullYear(),d.getMonth(),1);e=new Date(d.getFullYear(),d.getMonth()+1,1)}
 else{s=monday(d);e=new Date(s.getTime()+7*DAY)}
 return [s,e]
}
function valueFor(g,date=new Date()){
 if(g.type==="metric"){let a=data.activities.filter(x=>x.goal===g.id).sort((a,b)=>a.date.localeCompare(b.date));return a.length?a[a.length-1].value:g.baseline||0}
 if(g.type==="long"){
   let ids=[g.id]; if(g.source)ids.push(g.source);
   return data.activities.filter(x=>ids.includes(x.goal)&&(!g.start||x.date>=g.start)&&(!g.end||x.date<=g.end)).reduce((s,x)=>s+x.value,0)
 }
 if(g.type==="once") return data.activities.filter(x=>x.goal===g.id).reduce((s,x)=>s+x.value,0);
 let [s,e]=periodBounds(g,date);
 return data.activities.filter(x=>x.goal===g.id&&new Date(x.date+"T12:00")>=s&&new Date(x.date+"T12:00")<e).reduce((s,x)=>s+x.value,0)
}
function pct(g,v=valueFor(g)){if(g.type==="metric"){let total=Math.abs((g.baseline||v)-g.target),done=Math.abs((g.baseline||v)-v);return Math.min(100,total?done/total*100:100)}return Math.min(100,g.target?v/g.target*100:0)}
function goalCard(g,date=new Date()){
 let v=valueFor(g,date), p=pct(g,v), label=g.type==="metric"?`${v} ${g.unit} → ${g.target} ${g.unit}`:`${(+v.toFixed(1))} / ${g.target} ${g.unit}`;
 let repeat=g.repeat==="week"?"cette semaine":g.repeat==="month"?"ce mois":g.repeat==="day"?"aujourd'hui":g.type==="long"?"objectif global":g.type==="metric"?"mesure":"ponctuel";
 return `<div class="goalcard"><div class="goalTop"><span class="emoji">${emojis[g.category]||"🎯"}</span><div class="goalName">${g.name}<div class="muted">${repeat}</div></div><button class="mini addAct" data-id="${g.id}">＋</button></div><div class="progressrow"><span>${label}</span><b>${Math.round(p)}%</b></div><div class="progress"><i style="width:${p}%"></i></div><div class="rowbuttons"><button class="danger deleteGoal" data-id="${g.id}">Supprimer</button></div></div>`
}
function render(){
 let lvl=Math.floor(data.xp/250)+1, rem=data.xp%250;
 $("#level").textContent="Niveau "+lvl;$("#xpText").textContent=`${rem} / 250 XP`;$("#xpBar").style.width=(rem/250*100)+"%";$("#teeth").textContent=data.teeth;
 $("#todayLabel").textContent=new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
 let current=data.goals.filter(g=>["habit","period"].includes(g.type));
 $("#todayList").innerHTML=current.map(g=>goalCard(g)).join("")||'<div class="card muted">Aucun objectif.</div>';
 $("#periodGoals").innerHTML=data.goals.filter(g=>["long","metric"].includes(g.type)).map(g=>goalCard(g)).join("");
 $("#goalList").innerHTML=data.goals.filter(g=>filter==="all"||g.category===filter).map(g=>goalCard(g)).join("");
 renderWeek(); renderStats(); renderShop(); bindDynamic(); populateActivity();
}
function renderWeek(){
 let s=monday(new Date(Date.now()+weekOffset*7*DAY)); let e=new Date(s.getTime()+6*DAY);
 $("#weekTitle").textContent=`${s.toLocaleDateString("fr-FR",{day:"numeric",month:"short"})} – ${e.toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}`;
 $("#weekGrid").innerHTML=[0,1,2,3,4,5,6].map(i=>{let d=new Date(s.getTime()+i*DAY), ds=iso(d), acts=data.activities.filter(a=>a.date===ds);return `<div class="day ${ds===today()?"today":""}"><b>${["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"][i]}</b><div class="num">${d.getDate()}</div><div class="dots">${acts.slice(0,3).map(a=>emojis[(data.goals.find(g=>g.id===a.goal)||{}).category]||"•").join(" ")}</div></div>`}).join("");
 $("#weekGoals").innerHTML=data.goals.filter(g=>g.repeat==="week").map(g=>goalCard(g,s)).join("");
}
function drawLine(canvas,seriesA,seriesB){
 let c=canvas,ctx=c.getContext("2d"),w=c.width,h=c.height,p=35;ctx.clearRect(0,0,w,h);let vals=[...seriesA,...seriesB].filter(Number.isFinite),min=Math.min(...vals),max=Math.max(...vals);if(min===max){min-=1;max+=1}
 let pt=(v,i,n)=>[p+i*(w-2*p)/Math.max(1,n-1),h-p-(v-min)*(h-2*p)/(max-min)];
 ctx.strokeStyle="#dfe7e9";ctx.lineWidth=1;for(let i=0;i<5;i++){let y=p+i*(h-2*p)/4;ctx.beginPath();ctx.moveTo(p,y);ctx.lineTo(w-p,y);ctx.stroke()}
 [seriesB,seriesA].forEach((arr,j)=>{ctx.strokeStyle=j?"#0b7189":"#9ba8ac";ctx.lineWidth=j?4:2;ctx.setLineDash(j?[]:[8,6]);ctx.beginPath();arr.forEach((v,i)=>{let [x,y]=pt(v,i,arr.length);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()});ctx.setLineDash([])
}
function renderStats(){
 let weekly=[...data.historyWeeks]; let thisWeek=data.goals.filter(g=>g.repeat==="week"); weekly[7]=thisWeek.length?thisWeek.reduce((s,g)=>s+pct(g),0)/thisWeek.length:0;
 drawLine($("#weeklyChart"),weekly,[100,100,100,100,100,100,100,100]);
 let metrics=data.goals.filter(g=>g.type==="metric"); $("#metricSelect").innerHTML=metrics.map(g=>`<option value="${g.id}">${g.name}</option>`).join("");
 let g=metrics[0]; if(g){let acts=data.activities.filter(a=>a.goal===g.id).sort((a,b)=>a.date.localeCompare(b.date));let real=[g.baseline,...acts.map(a=>a.value)];let target=real.map((_,i)=>g.baseline+(g.target-g.baseline)*(i/Math.max(1,real.length-1)));drawLine($("#metricChart"),real,target);let v=valueFor(g);$("#metricInsight").textContent=`Actuel : ${v} ${g.unit} · Cible : ${g.target} ${g.unit}. La ligne pointillée représente la trajectoire théorique.`}
 let total=data.activities.length,done=data.goals.filter(g=>pct(g)>=100).length;
 $("#statsSummary").innerHTML=`<div class="stat"><span class="muted">Activités</span><b>${total}</b></div><div class="stat"><span class="muted">Objectifs atteints</span><b>${done}</b></div><div class="stat"><span class="muted">XP total</span><b>${data.xp}</b></div><div class="stat"><span class="muted">Dents</span><b>${data.teeth}</b></div>`
}
const sharks=[["Requin gris",0,"🦈"],["Requin bleu",1500,"🦈"],["Requin marteau",4000,"🔨"],["Requin tigre",7500,"🦈"],["Grand blanc",15000,"🦈"],["Requin-baleine",25000,"🐋"]];
function renderShop(){
 $("#activeShark").textContent=data.activeShark;
 $("#shop").innerHTML=sharks.map(([n,c,e])=>{let owned=data.owned.includes(n);return `<div class="shopitem"><div class="fish">${e}</div><b>${n}</b><p class="muted">${owned?"Débloqué":c+" 🦷"}</p><button class="primary small sharkBuy" data-name="${n}" data-cost="${c}">${owned?(data.activeShark===n?"Actif":"Choisir"):"Acheter"}</button></div>`}).join("");
 let achievements=[["Premiers pas",data.activities.length>=1],["Régulier",data.activities.length>=10],["Centurion",data.activities.length>=100],["Collectionneur",data.owned.length>=3]];
 $("#achievements").innerHTML=achievements.map(([n,ok])=>`<div class="goalcard">${ok?"🏆":"🔒"} <b>${n}</b></div>`).join("")
}
function populateActivity(){ $("#activityGoal").innerHTML=data.goals.map(g=>`<option value="${g.id}">${emojis[g.category]||"🎯"} ${g.name} (${g.unit})</option>`).join("")}
function bindDynamic(){
 $$(".addAct").forEach(b=>b.onclick=()=>openActivity(b.dataset.id));
 $$(".deleteGoal").forEach(b=>b.onclick=()=>{if(confirm("Supprimer cet objectif ? Son historique d'activités sera conservé.")){data.goals=data.goals.filter(g=>g.id!==b.dataset.id);save();render()}});
 $$(".sharkBuy").forEach(b=>b.onclick=()=>{let n=b.dataset.name,c=+b.dataset.cost;if(data.owned.includes(n)){data.activeShark=n}else if(data.teeth>=c){data.teeth-=c;data.owned.push(n);data.activeShark=n}else return alert("Pas assez de dents !");save();render()})
}
function openActivity(id){$("#activityGoal").value=id;$("#activityForm").elements.date.value=today();$("#activityDialog").showModal()}
$$("nav button").forEach(b=>b.onclick=()=>{$$("nav button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$$(".page").forEach(x=>x.classList.remove("active"));$("#"+b.dataset.page).classList.add("active");render()});
$("#newGoal").onclick=()=>{let f=$("#goalForm");f.elements.start.value=today();f.elements.end.value="";$("#goalDialog").showModal()};
$("#quickAdd").onclick=()=>openActivity(data.goals[0]?.id);
$("#goalForm").onsubmit=e=>{e.preventDefault();let f=new FormData(e.target);data.goals.push({id:"g"+Date.now(),name:f.get("name"),category:f.get("category"),type:f.get("type"),target:+f.get("target"),unit:f.get("unit"),repeat:f.get("repeat"),start:f.get("start"),end:f.get("end"),flexible:!!f.get("flexible"),baseline:+f.get("target")});save();$("#goalDialog").close();e.target.reset();render()};
$("#activityForm").onsubmit=e=>{e.preventDefault();let f=new FormData(e.target),v=+f.get("value");data.activities.push({goal:f.get("goal"),value:v,date:f.get("date")});data.xp+=Math.max(10,Math.round(v*10));data.teeth+=Math.max(3,Math.round(v*2));save();$("#activityDialog").close();render()};
$("#prevWeek").onclick=()=>{weekOffset--;renderWeek()};$("#nextWeek").onclick=()=>{weekOffset++;renderWeek()};
$$(".chip").forEach(c=>c.onclick=()=>{$$(".chip").forEach(x=>x.classList.remove("active"));c.classList.add("active");filter=c.dataset.filter;render()});
if("serviceWorker" in navigator)navigator.serviceWorker.register("./sw.js");
render();