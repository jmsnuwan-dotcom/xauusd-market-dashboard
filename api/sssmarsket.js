const fallback = {
  live:false,
  status:"WAITING FOR LIVE DATA",
  statusText:"No MT5 market feed connected yet.",
  direction:"NEUTRAL",
  directionStrength:"Waiting for M1 data",
  buyPct:50,
  price:null, change:null, changePct:null, high:null, low:null, spread:null,
  candles:null, m1Change:null, activity:null,
  condition:{trend:"—",volatility:"—",momentum:"—",liquidity:"—",spreadCondition:"—",newsRisk:"—"},
  news:[], updatedAt:null
};

function headers(){
  return {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Headers":"Content-Type, X-Market-Key",
    "Access-Control-Allow-Methods":"GET, POST, OPTIONS",
    "Content-Type":"application/json"
  };
}
async function redis(cmd){
  const url=process.env.UPSTASH_REDIS_REST_URL;
  const token=process.env.UPSTASH_REDIS_REST_TOKEN;
  if(!url||!token) return null;
  const r=await fetch(url,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json"},body:JSON.stringify(cmd)});
  if(!r.ok) throw new Error("Redis request failed");
  return r.json();
}
export default async function handler(req,res){
  Object.entries(headers()).forEach(([k,v])=>res.setHeader(k,v));
  if(req.method==="OPTIONS") return res.status(204).end();
  try{
    if(req.method==="GET"){
      const raw=await redis(["GET","xauusd:market"]);
      if(raw?.result) return res.status(200).json(JSON.parse(raw.result));
      return res.status(200).json(fallback);
    }
    if(req.method==="POST"){
      const key=req.headers["x-market-key"];
      if(!process.env.MARKET_API_KEY || key!==process.env.MARKET_API_KEY) return res.status(401).json({error:"Unauthorized"});
      const data=typeof req.body==="string"?JSON.parse(req.body):req.body;
      if(!data || typeof data!=="object") return res.status(400).json({error:"Invalid JSON"});
      data.live=true; data.updatedAt=new Date().toISOString();
      await redis(["SET","xauusd:market",JSON.stringify(data),"EX",30]);
      return res.status(200).json({ok:true,updatedAt:data.updatedAt});
    }
    return res.status(405).json({error:"Method not allowed"});
  }catch(e){return res.status(500).json({error:e.message})}
}
