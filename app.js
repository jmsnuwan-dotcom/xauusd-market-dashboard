let lastUpdate=0;
function $(id){return document.getElementById(id)}
function clock(){const d=new Date();$('clock').textContent=d.toLocaleTimeString([], {hour12:false})}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function render(d){
  const buy=Math.max(0,Math.min(100,Number(d.buyPct ?? 50))); const sell=100-buy;
  $('buy').textContent=buy.toFixed(0)+'%'; $('sell').textContent=sell.toFixed(0)+'%';
  $('buyBar').style.width=buy+'%'; $('sellBar').style.width=sell+'%';
  const dir=d.direction || (buy>=55?'BUY':buy<=45?'SELL':'NEUTRAL');
  $('direction').textContent=dir; $('arrow').textContent=dir==='BUY'?'↑':dir==='SELL'?'↓':'→';
  $('directionText').textContent=d.directionStrength || (dir==='BUY'?'UP TREND':dir==='SELL'?'DOWN TREND':'NEUTRAL MARKET');
  $('price').textContent=d.price==null?'—':Number(d.price).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
  $('change').textContent=d.change==null?'—':(Number(d.change)>=0?'▲ +':'▼ ')+Number(d.change).toFixed(2)+' ('+Number(d.changePct||0).toFixed(2)+'%)';
  $('high').textContent=d.high??'—'; $('low').textContent=d.low??'—'; $('spread').textContent=d.spread??'—';
  $('candles').textContent=d.candles??'—'; $('m1change').textContent=d.m1Change==null?'—':d.m1Change+'%'; $('activity').textContent=d.activity??'—';
  const c=d.condition||{}; ['trend','volatility','momentum','liquidity','spreadCondition','newsRisk'].forEach(k=>$(k).textContent=c[k]??'—');
  const good=d.status==='GOOD TO TRADE';
  $('status').textContent=d.status || 'WAITING FOR LIVE DATA';
  $('statusText').textContent=d.statusText || 'Current market analysis.';
  $('statusCard').style.background=good?'linear-gradient(120deg,#06351d,#03200f)':'linear-gradient(120deg,#241f05,#0c0d07)';
  const news=d.news||[]; $('news').innerHTML=news.length?news.map(n=>`<div class="news-row"><div class="news-time">${esc(n.time)}</div><div>${esc(n.event)}</div><div class="${String(n.impact||'LOW').toLowerCase()}">${esc(n.impact)}</div><div class="effect">${esc(n.effect)}</div></div>`).join(''):'<div class="empty">No upcoming news supplied.</div>';
  $('updated').textContent=d.updatedAt?new Date(d.updatedAt).toLocaleTimeString([], {hour12:false}):'—';
  $('connection').textContent=d.live?'● LIVE MARKET DATA':'● FEED OFFLINE';
  $('connection').style.color=d.live?'#35f078':'#ff4545';
}
async function load(){
  try{const r=await fetch('/api/market',{cache:'no-store'}); if(!r.ok)throw Error(); const d=await r.json(); render(d); lastUpdate=Date.now();}
  catch(e){$('connection').textContent='● FEED OFFLINE';$('connection').style.color='#ff4545'}
}
setInterval(clock,1000);setInterval(load,5000);clock();load();
