import { useState, useEffect } from "react";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const STORAGE_KEY = "portfolio-v2";
const CASH_INVESTED = 900;
const CLAUDE_URL = "https://claude.ai";

const SEED_DATA = {
  lastUpdated: "2026-06-03T00:00:00Z",
  lots: [
    { id:"s1",  ticker:"SCHD", account:"Brokerage", shares:1,         costPerShare:31.41, buyDate:"2026-02-09", sector:"Value",        assetType:"ETF",    currentPrice:32.35 },
    { id:"s2",  ticker:"SCHD", account:"Brokerage", shares:1,         costPerShare:31.08, buyDate:"2026-03-17", sector:"Value",        assetType:"ETF",    currentPrice:32.35 },
    { id:"s3",  ticker:"SCHD", account:"Brokerage", shares:5,         costPerShare:31.45, buyDate:"2026-05-05", sector:"Value",        assetType:"ETF",    currentPrice:32.35 },
    { id:"s4",  ticker:"SCHD", account:"Brokerage", shares:0.7373,    costPerShare:31.94, buyDate:"2026-05-18", sector:"Value",        assetType:"ETF",    currentPrice:32.35 },
    { id:"v1",  ticker:"VOO",  account:"Brokerage", shares:0.000215,  costPerShare:602.14,buyDate:"2026-04-01", sector:"Foundational", assetType:"ETF",    currentPrice:698.79 },
    { id:"v2",  ticker:"VOO",  account:"Brokerage", shares:0.047295,  costPerShare:634.31,buyDate:"2026-01-31", sector:"Foundational", assetType:"ETF",    currentPrice:698.79 },
    { id:"v3",  ticker:"VOO",  account:"Brokerage", shares:0.022487,  costPerShare:617.69,buyDate:"2026-03-17", sector:"Foundational", assetType:"ETF",    currentPrice:698.79 },
    { id:"v4",  ticker:"VOO",  account:"Brokerage", shares:0.075337,  costPerShare:663.73,buyDate:"2026-05-05", sector:"Foundational", assetType:"ETF",    currentPrice:698.79 },
    { id:"v5",  ticker:"VOO",  account:"Brokerage", shares:0.075275,  costPerShare:664.23,buyDate:"2026-05-05", sector:"Foundational", assetType:"ETF",    currentPrice:698.79 },
    { id:"v6",  ticker:"VOO",  account:"Brokerage", shares:0.181053,  costPerShare:674.11,buyDate:"2026-05-19", sector:"Foundational", assetType:"ETF",    currentPrice:698.79 },
    { id:"sp1", ticker:"SPMO", account:"Brokerage", shares:0.44868,   costPerShare:111.44,buyDate:"2026-03-30", sector:"Broad Growth", assetType:"ETF",    currentPrice:155.51 },
    { id:"sp2", ticker:"SPMO", account:"Brokerage", shares:0.725,     costPerShare:153.89,buyDate:"2026-06-02", sector:"Broad Growth", assetType:"ETF",    currentPrice:155.51 },
    { id:"sp3", ticker:"SPMO", account:"Brokerage", shares:0.664587,  costPerShare:155.51,buyDate:"2026-06-03", sector:"Broad Growth", assetType:"ETF",    currentPrice:155.51 },
    { id:"vg1", ticker:"VGT",  account:"Brokerage", shares:0.475078,  costPerShare:124.59,buyDate:"2026-06-02", sector:"Aggressive",   assetType:"ETF",    currentPrice:125.00 },
    { id:"vg2", ticker:"VGT",  account:"Brokerage", shares:0.3566,    costPerShare:111.43,buyDate:"2026-05-18", sector:"Aggressive",   assetType:"ETF",    currentPrice:125.00 },
    { id:"vg3", ticker:"VGT",  account:"Brokerage", shares:0.1493,    costPerShare:113.96,buyDate:"2026-05-15", sector:"Aggressive",   assetType:"ETF",    currentPrice:125.00 },
    { id:"vx1", ticker:"VXUS", account:"Brokerage", shares:0.000259,  costPerShare:77.10, buyDate:"2026-03-24", sector:"International",assetType:"ETF",    currentPrice:87.01 },
    { id:"vx2", ticker:"VXUS", account:"Brokerage", shares:0.30115,   costPerShare:78.67, buyDate:"2026-03-17", sector:"International",assetType:"ETF",    currentPrice:87.01 },
    { id:"vx3", ticker:"VXUS", account:"Brokerage", shares:0.60141,   costPerShare:83.14, buyDate:"2026-05-05", sector:"International",assetType:"ETF",    currentPrice:87.01 },
    { id:"vx4", ticker:"VXUS", account:"Brokerage", shares:0.5807,    costPerShare:86.10, buyDate:"2026-06-01", sector:"International",assetType:"ETF",    currentPrice:87.01 },
    { id:"b1",  ticker:"BTC",  account:"Crypto",    shares:0.00001432,costPerShare:71194.29,buyDate:"2026-02-06",sector:"Aggressive",  assetType:"Crypto", currentPrice:73737.00 },
    { id:"b2",  ticker:"BTC",  account:"Crypto",    shares:0.0000681, costPerShare:73400.00,buyDate:"2026-02-07",sector:"Aggressive",  assetType:"Crypto", currentPrice:73737.00 },
  ],
  closed: [
    { id:"c1",  ticker:"TSLA",  account:"Brokerage", shares:0.002432,  costPerShare:355.37, sellPrice:411.06, sellDate:"2026-02-06" },
    { id:"c2",  ticker:"TSLA",  account:"Brokerage", shares:0.238917,  costPerShare:355.37, sellPrice:393.91, sellDate:"2026-05-05" },
    { id:"c3",  ticker:"VTI",   account:"Brokerage", shares:0.337448,  costPerShare:339.55, sellPrice:361.68, sellDate:"2026-05-18" },
    { id:"c22", ticker:"META",  account:"Brokerage", shares:0.056801,  costPerShare:714.60, sellPrice:621.09, sellDate:"2026-06-03" },
  ],
  watchlist: [
    { id:"w14", ticker:"SPCX", note:"SpaceX IPO — wait past Jun 12",   priceAtAdd:null, addedAt:"2026-06-03", status:"Watching" },
    { id:"w15", ticker:"ANTH", note:"Anthropic IPO — target Oct 2026", priceAtAdd:null, addedAt:"2026-06-03", status:"Watching" },
    { id:"w16", ticker:"META", note:"Sold Jun 3 at loss — monitor",    priceAtAdd:621.09,addedAt:"2026-06-03", status:"Watching" },
  ],
};

const SECTOR_COLORS = {
  "Foundational": "#4a7fc1",
  "Value":        "#6aaa5f",
  "Broad Growth": "#c97d3a",
  "Aggressive":   "#b05a4a",
  "International":"#7b6bb5",
  "Other":        "#475569",
};

const EVENTS = [
  { date:"2026-06-12", label:"SpaceX IPO", ticker:"SPCX", type:"ipo",      color:"#c97d3a", note:"First day of trading on Nasdaq" },
  { date:"2026-06-24", label:"SCHD Ex-Date", ticker:"SCHD", type:"div",    color:"#6aaa5f", note:"Must own shares before this date for Q2 dividend" },
  { date:"2026-06-29", label:"SCHD Pay Date", ticker:"SCHD", type:"div",   color:"#6aaa5f", note:"~$0.26/share hits your Schwab account" },
  { date:"2026-10-01", label:"Anthropic IPO", ticker:"ANTH", type:"ipo",   color:"#b05a4a", note:"Target window — S-1 filed Jun 1, 2026" },
];

const YF_BASE = "https://query1.finance.yahoo.com/v8/finance/chart/";

// ── HELPERS ───────────────────────────────────────────────────────────────────
function fmt$(n, dec=2) {
  if (n==null||isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:dec,maximumFractionDigits:dec}).format(n);
}
function fmtPct(n,dec=2) {
  if (n==null||isNaN(n)) return "—";
  return `${n>=0?"+":""}${n.toFixed(dec)}%`;
}
function fmtCompact(n) {
  if (n==null||isNaN(n)) return "—";
  const s = n>=0?"+":"-"; const a=Math.abs(n);
  return `${s}$${a.toFixed(2)}`;
}
function daysBetween(d1,d2) {
  return Math.ceil((new Date(d2)-new Date(d1))/(1000*60*60*24));
}
function groupByTicker(lots) {
  const map={};
  lots.forEach(lot=>{
    if(!map[lot.ticker]) map[lot.ticker]={ticker:lot.ticker,account:lot.account,sector:lot.sector,subSector:lot.subSector,assetType:lot.assetType,lots:[]};
    map[lot.ticker].lots.push(lot);
  });
  return Object.values(map).map(g=>{
    const totalShares=g.lots.reduce((a,l)=>a+l.shares,0);
    const totalCost=g.lots.reduce((a,l)=>a+l.shares*l.costPerShare,0);
    const blendedAvg=totalCost/totalShares;
    const curPrice=g.lots[0].currentPrice??blendedAvg;
    const curValue=curPrice*totalShares;
    const unrealized=curValue-totalCost;
    const unrealizedPct=(unrealized/totalCost)*100;
    return {...g,totalShares,totalCost,blendedAvg,curPrice,curValue,unrealized,unrealizedPct};
  });
}

// ── DONUT CHART ───────────────────────────────────────────────────────────────
function DonutChart({groups, totalValue}) {
  const sectorMap={};
  groups.forEach(g=>{sectorMap[g.sector]=(sectorMap[g.sector]||0)+g.curValue;});
  const sectors=Object.entries(sectorMap).sort((a,b)=>b[1]-a[1]);
  const [hovered,setHovered]=useState(null);

  let cumulative=0;
  const slices=sectors.map(([sector,val])=>{
    const pct=val/totalValue;
    const start=cumulative; cumulative+=pct;
    const startAngle=start*2*Math.PI-Math.PI/2;
    const endAngle=(start+pct)*2*Math.PI-Math.PI/2;
    const r=80, r2=50, cx=100, cy=100;
    const x1=cx+r*Math.cos(startAngle), y1=cy+r*Math.sin(startAngle);
    const x2=cx+r*Math.cos(endAngle),   y2=cy+r*Math.sin(endAngle);
    const ix1=cx+r2*Math.cos(startAngle),iy1=cy+r2*Math.sin(startAngle);
    const ix2=cx+r2*Math.cos(endAngle),  iy2=cy+r2*Math.sin(endAngle);
    const large=pct>0.5?1:0;
    const d=`M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${r2},${r2} 0 ${large},0 ${ix1},${iy1} Z`;
    return {sector,val,pct,d};
  });

  const hov=hovered?sectors.find(([s])=>s===hovered):null;

  return (
    <div style={{display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
      <div style={{position:"relative",width:200,height:200,flexShrink:0}}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {slices.map(sl=>(
            <path key={sl.sector} d={sl.d}
              fill={SECTOR_COLORS[sl.sector]||"#475569"}
              opacity={hovered&&hovered!==sl.sector?0.35:1}
              style={{transition:"opacity 0.2s",cursor:"pointer"}}
              onMouseEnter={()=>setHovered(sl.sector)}
              onMouseLeave={()=>setHovered(null)}
            />
          ))}
        </svg>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",textAlign:"center",pointerEvents:"none"}}>
          {hov
            ? <>
                <div style={{fontSize:11,color:"#94a3b8",fontFamily:"monospace"}}>{hov[0]}</div>
                <div style={{fontSize:16,fontWeight:700,color:"#f1f5f9",fontFamily:"monospace"}}>{(hov[1]/totalValue*100).toFixed(1)}%</div>
                <div style={{fontSize:10,color:"#475569",fontFamily:"monospace"}}>{fmt$(hov[1])}</div>
              </>
            : <>
                <div style={{fontSize:10,color:"#475569",fontFamily:"monospace"}}>TOTAL</div>
                <div style={{fontSize:17,fontWeight:700,color:"#f1f5f9",fontFamily:"monospace"}}>{fmt$(totalValue)}</div>
              </>
          }
        </div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,flex:1,minWidth:140}}>
        {slices.map(sl=>(
          <div key={sl.sector} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",opacity:hovered&&hovered!==sl.sector?0.4:1,transition:"opacity 0.2s"}}
            onMouseEnter={()=>setHovered(sl.sector)} onMouseLeave={()=>setHovered(null)}>
            <div style={{width:10,height:10,borderRadius:2,background:SECTOR_COLORS[sl.sector]||"#475569",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:"#94a3b8",fontFamily:"monospace"}}>{sl.sector}</span>
                <span style={{fontSize:11,color:"#e2e8f0",fontFamily:"monospace",fontWeight:700}}>{(sl.pct*100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── OPEN/CLOSE BAR CHART ──────────────────────────────────────────────────────
function MoverChart({liveData,groups}) {
  const tickers=groups.map(g=>g.ticker).filter(t=>t!=="BTC");
  const movers=tickers.map(t=>{
    const d=liveData[t];
    if(!d) return null;
    const chg=d.close&&d.open?(d.close-d.open):0;
    const chgPct=d.open?((d.close-d.open)/d.open)*100:0;
    return {ticker:t,open:d.open,close:d.close,chg,chgPct};
  }).filter(Boolean).sort((a,b)=>Math.abs(b.chgPct)-Math.abs(a.chgPct)).slice(0,5);

  if (!movers.length) return <div style={{color:"#334155",fontSize:12,padding:"20px 0"}}>Loading price data...</div>;

  const maxAbs=Math.max(...movers.map(m=>Math.abs(m.chgPct)),0.1);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {movers.map(m=>{
        const pos=m.chg>=0;
        const barW=Math.abs(m.chgPct)/maxAbs*100;
        return (
          <div key={m.ticker}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:12,color:"#e2e8f0",fontFamily:"monospace",fontWeight:700}}>{m.ticker}</span>
              <div style={{display:"flex",gap:12,fontFamily:"monospace",fontSize:11}}>
                <span style={{color:"#475569"}}>O: {fmt$(m.open)}</span>
                <span style={{color:"#94a3b8"}}>C: {fmt$(m.close)}</span>
                <span style={{color:pos?"#00e5a0":"#ff4d6d",fontWeight:700}}>{fmtCompact(m.chg)} ({fmtPct(m.chgPct)})</span>
              </div>
            </div>
            <div style={{background:"#0a1020",borderRadius:2,height:4,overflow:"hidden"}}>
              <div style={{width:`${barW}%`,height:"100%",background:pos?"#00e5a0":"#ff4d6d",borderRadius:2,transition:"width 0.5s"}}/>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── EVENTS CALENDAR ───────────────────────────────────────────────────────────
function EventsCalendar() {
  const today=new Date().toISOString().split("T")[0];
  const upcoming=EVENTS.filter(e=>e.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {upcoming.map((e,i)=>{
        const days=daysBetween(today,e.date);
        return (
          <div key={i} style={{display:"flex",gap:12,alignItems:"flex-start",background:"#0a1020",borderRadius:6,padding:"10px 12px",borderLeft:`3px solid ${e.color}`}}>
            <div style={{textAlign:"center",minWidth:40,flexShrink:0}}>
              <div style={{fontSize:18,fontWeight:700,color:e.color,fontFamily:"monospace",lineHeight:1}}>{days}</div>
              <div style={{fontSize:9,color:"#334155",letterSpacing:"0.1em"}}>DAYS</div>
            </div>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <span style={{fontSize:12,fontWeight:700,color:"#e2e8f0",fontFamily:"monospace"}}>{e.label}</span>
                <span style={{fontSize:9,color:e.color,background:e.color+"22",padding:"1px 6px",borderRadius:3,letterSpacing:"0.08em"}}>{e.type==="div"?"DIVIDEND":"IPO"}</span>
              </div>
              <div style={{fontSize:10,color:"#475569"}}>{e.date} · {e.note}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── NEWS SECTION ──────────────────────────────────────────────────────────────
function NewsSection({groups}) {
  const [articles,setArticles]=useState([]);
  const [loading,setLoading]=useState(true);
  const tickers=groups.map(g=>g.ticker).join(" OR ");

  useEffect(()=>{
    // Use Claude API to fetch news summaries
    (async()=>{
      try {
        const resp=await fetch("https://api.anthropic.com/v1/messages",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            model:"claude-sonnet-4-20250514",
            max_tokens:1000,
            system:`You are a financial news assistant. Return ONLY a JSON array of 6 news items. No markdown, no explanation, just raw JSON.
Format: [{"headline":"...","summary":"...","ticker":"TICKER or MARKET","sentiment":"positive|negative|neutral","time":"X hours ago"}]
Focus on: SCHD, VOO, SPMO, VGT, VXUS, BTC, SPCX, META, general market. Use real recent events you know about as of June 2026.`,
            messages:[{role:"user",content:"Give me the 6 most important recent financial news items relevant to a portfolio containing SCHD, VOO, SPMO, VGT, VXUS, BTC. Include SpaceX IPO news and general market. JSON only."}]
          })
        });
        const data=await resp.json();
        const text=data.content?.find(c=>c.type==="text")?.text||"[]";
        const clean=text.replace(/```json|```/g,"").trim();
        setArticles(JSON.parse(clean));
      } catch(e){
        setArticles([
          {headline:"SpaceX IPO pricing June 11 — retail access via Schwab & Robinhood",summary:"SPCX roadshow active. Pricing expected June 11, first trade June 12 on Nasdaq. Target valuation $1.75T-$2T.",ticker:"SPCX",sentiment:"positive",time:"Today"},
          {headline:"SCHD ex-dividend date June 24 — Q2 payout ~$0.26/share",summary:"Schwab U.S. Dividend Equity ETF Q2 dividend. Must own shares before June 24 for payout on June 29.",ticker:"SCHD",sentiment:"positive",time:"Upcoming"},
          {headline:"Anthropic files confidential S-1 — IPO target October 2026",summary:"Valuation ~$965B. No firm date yet. Targeting Nasdaq listing. Available to retail investors at IPO.",ticker:"ANTH",sentiment:"positive",time:"June 1"},
          {headline:"BTC consolidating near $73K after recent volatility",summary:"Bitcoin holding above key support. Macro uncertainty keeping price range-bound short term.",ticker:"BTC",sentiment:"neutral",time:"Today"},
          {headline:"VOO hits new highs as S&P 500 continues rally",summary:"Broad market strength driven by tech earnings and Fed pause expectations.",ticker:"VOO",sentiment:"positive",time:"This week"},
          {headline:"SPMO momentum factor outperforming YTD",summary:"Momentum factor ETFs continue to lead as growth stocks regain favor in 2026.",ticker:"SPMO",sentiment:"positive",time:"This week"},
        ]);
      }
      setLoading(false);
    })();
  },[]);

  const sentColor={positive:"#00e5a0",negative:"#ff4d6d",neutral:"#facc15"};

  return (
    <div>
      {loading
        ? <div style={{color:"#334155",fontSize:12,padding:"20px 0",fontFamily:"monospace"}}>Fetching news...</div>
        : <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {articles.map((a,i)=>(
              <div key={i} style={{background:"#0a1020",borderRadius:6,padding:"12px 14px",borderLeft:`3px solid ${sentColor[a.sentiment]||"#475569"}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:6}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#e2e8f0",lineHeight:1.4,flex:1}}>{a.headline}</div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                    <span style={{fontSize:9,color:sentColor[a.sentiment],background:sentColor[a.sentiment]+"22",padding:"2px 6px",borderRadius:3,letterSpacing:"0.08em",fontFamily:"monospace"}}>{a.ticker}</span>
                    <span style={{fontSize:9,color:"#334155",fontFamily:"monospace"}}>{a.time}</span>
                  </div>
                </div>
                <div style={{fontSize:11,color:"#475569",lineHeight:1.5}}>{a.summary}</div>
              </div>
            ))}
          </div>
      }
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [portfolio,setPortfolio]=useState(null);
  const [liveData,setLiveData]=useState({});
  const [tab,setTab]=useState("dashboard");
  const [loading,setLoading]=useState(true);
  const [pricesLoaded,setPricesLoaded]=useState(false);

  // Load portfolio from storage
  useEffect(()=>{
    (async()=>{
      try{
        const r=Promise.resolve(localStorage.getItem(STORAGE_KEY) ? {value: localStorage.getItem(STORAGE_KEY)} : null);
        if(r) setPortfolio(JSON.parse(r.value));
        else { Promise.resolve(localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA))); setPortfolio(SEED_DATA); }
      } catch(e){ setPortfolio(SEED_DATA); }
      setLoading(false);
    })();
  },[]);

  // Fetch live prices via Yahoo Finance
  useEffect(()=>{
    if(!portfolio) return;
    const tickers=[...new Set(portfolio.lots.map(l=>l.ticker).filter(t=>t!=="BTC"))];
    (async()=>{
      const results={};
      await Promise.all(tickers.map(async t=>{
        try{
          const r=await fetch(`${YF_BASE}${t}?interval=1d&range=1d`);
          const d=await r.json();
          const meta=d.chart?.result?.[0]?.meta;
          if(meta){
            results[t]={
              price:meta.regularMarketPrice,
              open:meta.regularMarketOpen||meta.chartPreviousClose,
              close:meta.regularMarketPrice,
              prevClose:meta.chartPreviousClose,
              chg:(meta.regularMarketPrice-(meta.chartPreviousClose||meta.regularMarketPrice)),
              chgPct:((meta.regularMarketPrice-(meta.chartPreviousClose||meta.regularMarketPrice))/(meta.chartPreviousClose||meta.regularMarketPrice))*100,
            };
          }
        }catch(e){}
      }));
      setLiveData(results);
      setPricesLoaded(true);
    })();
  },[portfolio]);

  if(loading) return(
    <div style={{background:"#070d18",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,fontFamily:"'IBM Plex Mono',monospace"}}>
      <div style={{width:40,height:40,border:"2px solid #1a2744",borderTop:"2px solid #00e5a0",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <div style={{color:"#334155",fontSize:12,letterSpacing:"0.1em"}}>LOADING PORTFOLIO</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if(!portfolio) return(
    <div style={{background:"#070d18",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:"#ff4d6d",fontFamily:"monospace",fontSize:13,padding:24,textAlign:"center"}}>
      No portfolio data found. Open the Portfolio Tracker artifact first and add your positions.
    </div>
  );

  // Apply live prices to groups
  const lotsWithLive=portfolio.lots.map(l=>{
    const live=liveData[l.ticker];
    return live?{...l,currentPrice:live.price}:l;
  });

  const groups=groupByTicker(lotsWithLive);
  const totalValue=groups.reduce((a,g)=>a+g.curValue,0);
  const totalCost=groups.reduce((a,g)=>a+g.totalCost,0);
  const totalUnrealized=totalValue-totalCost;
  const totalUnrealPct=totalCost>0?(totalUnrealized/totalCost)*100:0;
  const totalRealized=portfolio.closed.reduce((a,c)=>a+(c.sellPrice-c.costPerShare)*c.shares,0);
  const totalGain=totalUnrealized+totalRealized;
  const totalReturnPct=(totalGain/CASH_INVESTED)*100;

  // YTD — assume Jan 1 2026 as baseline (use cost as proxy)
  const ytdGain=totalUnrealized+totalRealized;
  const ytdPct=totalReturnPct;

  // Days invested — earliest buy date
  const allDates=portfolio.lots.map(l=>l.buyDate).filter(Boolean).sort();
  const firstDate=allDates[0]||"2026-01-01";
  const daysInvested=daysBetween(firstDate,new Date().toISOString().split("T")[0]);
  const annualized=daysInvested>0?(Math.pow(1+totalReturnPct/100,365/daysInvested)-1)*100:0;

  // Today's change
  const todayChg=groups.reduce((a,g)=>{
    const d=liveData[g.ticker];
    return d?a+d.chg*g.totalShares:a;
  },0);
  const todayChgPct=totalValue>0?(todayChg/totalValue)*100:0;

  const TABS=["dashboard","positions","news","watchlist","insights"];

  return(
    <div style={{background:"#070d18",minHeight:"100vh",fontFamily:"'IBM Plex Mono','Courier New',monospace",color:"#94a3b8",paddingBottom:80}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade-up{animation:fadeUp 0.4s ease forwards}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#070d18}
        ::-webkit-scrollbar-thumb{background:#1a2744;border-radius:2px}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{padding:"20px 20px 0",marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,color:"#334155",letterSpacing:"0.2em",marginBottom:4}}>PORTFOLIO</div>
            <div style={{fontSize:26,fontWeight:700,color:"#f8fafc",letterSpacing:"0.06em",lineHeight:1}}>HERMIDA</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:pricesLoaded?"#00e5a0":"#facc15",boxShadow:pricesLoaded?"0 0 6px #00e5a0":"0 0 6px #facc15"}}/>
              <span style={{fontSize:9,color:"#334155",letterSpacing:"0.1em"}}>{pricesLoaded?"LIVE (15min delay)":"LOADING PRICES"}</span>
            </div>
            <button onClick={()=>window.open(CLAUDE_URL,"_blank")}
              style={{background:"linear-gradient(135deg,#00e5a0,#0ea5e9)",border:"none",borderRadius:6,padding:"6px 12px",color:"#070d18",fontWeight:700,fontSize:10,cursor:"pointer",letterSpacing:"0.08em",fontFamily:"inherit"}}>
              ASK CLAUDE ↗
            </button>
          </div>
        </div>
      </div>

      {/* ── SUMMARY STRIP ── */}
      <div style={{overflowX:"auto",padding:"0 20px",marginBottom:20}}>
        <div style={{display:"flex",gap:10,minWidth:"max-content"}}>
          {[
            {label:"CASH IN",    value:fmt$(CASH_INVESTED),   sub:"out of pocket",  hi:false},
            {label:"VALUE",      value:fmt$(totalValue),      sub:pricesLoaded?"live prices":"stored prices", hi:true},
            {label:"TODAY",      value:fmtCompact(todayChg),  sub:fmtPct(todayChgPct), hi:false, color:todayChg>=0?"#00e5a0":"#ff4d6d"},
            {label:"UNREALIZED", value:fmtCompact(totalUnrealized), sub:fmtPct(totalUnrealPct), hi:false, color:totalUnrealized>=0?"#00e5a0":"#ff4d6d"},
            {label:"REALIZED",   value:fmtCompact(totalRealized),   sub:"locked in",  hi:false, color:totalRealized>=0?"#00e5a0":"#ff4d6d"},
            {label:"TOTAL G/L",  value:fmtCompact(totalGain), sub:fmtPct(totalReturnPct), hi:true, color:totalGain>=0?"#00e5a0":"#ff4d6d"},
            {label:"YTD",        value:fmtPct(ytdPct),        sub:"year to date",   hi:false, color:ytdPct>=0?"#00e5a0":"#ff4d6d"},
            {label:"ANNUALIZED", value:fmtPct(annualized),    sub:`${daysInvested} days`, hi:false, color:annualized>=0?"#00e5a0":"#ff4d6d"},
          ].map((s,i)=>(
            <div key={i} style={{background:s.hi?"#071a12":"#0d1424",border:`1px solid ${s.hi?"#00e5a033":"#1a2744"}`,borderRadius:8,padding:"10px 14px",minWidth:110}}>
              <div style={{fontSize:8,color:"#334155",letterSpacing:"0.14em",marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:14,fontWeight:700,color:s.color||"#e2e8f0",fontFamily:"monospace"}}>{s.value}</div>
              <div style={{fontSize:9,color:"#334155",marginTop:2}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB NAV ── */}
      <div style={{display:"flex",gap:4,padding:"0 20px",marginBottom:20,overflowX:"auto"}}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            style={{background:tab===t?"#1a2744":"transparent",border:"1px solid",borderColor:tab===t?"#334155":"#1a2744",color:tab===t?"#e2e8f0":"#334155",padding:"6px 14px",borderRadius:4,cursor:"pointer",fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",whiteSpace:"nowrap",fontFamily:"inherit",transition:"all 0.15s"}}>
            {t}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div style={{padding:"0 20px"}} className="fade-up">

        {/* DASHBOARD */}
        {tab==="dashboard"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            <Section title="Allocation">
              <DonutChart groups={groups} totalValue={totalValue}/>
            </Section>
            <Section title="Today's Movers">
              <MoverChart liveData={liveData} groups={groups}/>
            </Section>
            <Section title="Upcoming Events">
              <EventsCalendar/>
            </Section>
          </div>
        )}

        {/* POSITIONS */}
        {tab==="positions"&&(
          <Section title="Open Positions">
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {groups.map(g=>{
                const alloc=totalValue>0?(g.curValue/totalValue)*100:0;
                const pos=g.unrealized>=0;
                const live=liveData[g.ticker];
                return(
                  <div key={g.ticker} style={{background:"#0a1020",borderRadius:8,padding:"12px 14px",borderLeft:`3px solid ${SECTOR_COLORS[g.sector]||"#475569"}`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{fontSize:16,fontWeight:700,color:"#f1f5f9",fontFamily:"monospace"}}>{g.ticker}</span>
                          <span style={{fontSize:9,color:SECTOR_COLORS[g.sector]||"#475569",background:(SECTOR_COLORS[g.sector]||"#475569")+"22",padding:"1px 6px",borderRadius:3}}>{g.sector}</span>
                        </div>
                        <div style={{fontSize:10,color:"#334155",marginTop:2}}>{g.totalShares.toFixed(6).replace(/\.?0+$/,"")} shares · avg {fmt$(g.blendedAvg)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",fontFamily:"monospace"}}>{fmt$(g.curValue)}</div>
                        <div style={{fontSize:10,color:pos?"#00e5a0":"#ff4d6d",fontFamily:"monospace"}}>{fmtCompact(g.unrealized)} ({fmtPct(g.unrealizedPct)})</div>
                      </div>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#334155"}}>
                      <span>Cost basis: {fmt$(g.totalCost)}</span>
                      <span>{alloc.toFixed(1)}% of portfolio</span>
                      {live&&<span style={{color:live.chg>=0?"#00e5a033":"#ff4d6d33",background:live.chg>=0?"#00e5a011":"#ff4d6d11",padding:"1px 6px",borderRadius:3,color:live.chg>=0?"#00e5a0":"#ff4d6d"}}>
                        Today: {fmtCompact(live.chg*g.totalShares)}
                      </span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* NEWS */}
        {tab==="news"&&(
          <Section title="Market News">
            <NewsSection groups={groups}/>
          </Section>
        )}

        {/* WATCHLIST */}
        {tab==="watchlist"&&(
          <Section title="Watchlist">
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {portfolio.watchlist.map((w,i)=>(
                <div key={i} style={{background:"#0a1020",borderRadius:8,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:14,fontWeight:700,color:"#f1f5f9",fontFamily:"monospace"}}>{w.ticker}</div>
                    <div style={{fontSize:10,color:"#475569",marginTop:2}}>{w.note||"—"}</div>
                    <div style={{fontSize:9,color:"#334155",marginTop:2}}>Added {w.addedAt}{w.priceAtAdd?` · $${w.priceAtAdd}`:""}</div>
                  </div>
                  <span style={{fontSize:9,color:"#94a3b8",background:"#1a2744",padding:"3px 8px",borderRadius:4,fontFamily:"monospace"}}>{w.status}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* INSIGHTS */}
        {tab==="insights"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[
              {label:"🏆 Best Performer",  value:`${groups.reduce((a,g)=>g.unrealizedPct>a.unrealizedPct?g:a,groups[0])?.ticker} ${fmtPct(Math.max(...groups.map(g=>g.unrealizedPct)))}`, color:"#00e5a0"},
              {label:"📉 Worst Performer", value:`${groups.reduce((a,g)=>g.unrealizedPct<a.unrealizedPct?g:a,groups[0])?.ticker} ${fmtPct(Math.min(...groups.map(g=>g.unrealizedPct)))}`, color:Math.min(...groups.map(g=>g.unrealizedPct))<0?"#ff4d6d":"#00e5a0"},
              {label:"💰 Biggest Closed Win", value:(()=>{const w=portfolio.closed.map(c=>({...c,gl:(c.sellPrice-c.costPerShare)*c.shares})).sort((a,b)=>b.gl-a.gl)[0];return w?`${w.ticker} +${fmt$(w.gl)}`:"—";})(), color:"#00e5a0"},
              {label:"🎯 Most Concentrated", value:(()=>{const m=groups.reduce((a,g)=>g.curValue>a.curValue?g:a,groups[0]);return `${m?.ticker} ${((m?.curValue/totalValue)*100).toFixed(1)}%`;})(), color:"#facc15"},
              {label:"⚡ Speculative %", value:`${((groups.filter(g=>g.assetType==="Crypto"||g.assetType==="Stock").reduce((a,g)=>a+g.curValue,0)/totalValue)*100).toFixed(1)}%`, color:"#94a3b8"},
              {label:"📅 Days Invested", value:`${daysInvested} days`, color:"#94a3b8"},
              {label:"📈 Annualized Return", value:fmtPct(annualized), color:annualized>=0?"#00e5a0":"#ff4d6d"},
              {label:"💸 Next Dividend", value:"SCHD · Jun 24", color:"#6aaa5f"},
            ].map((c,i)=>(
              <div key={i} style={{background:"#0a1020",borderRadius:8,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:11,color:"#475569"}}>{c.label}</span>
                <span style={{fontSize:14,fontWeight:700,color:c.color,fontFamily:"monospace"}}>{c.value}</span>
              </div>
            ))}
            <Section title="Sector Allocation">
              {Object.entries(Object.fromEntries(groups.map(g=>[g.sector,(groups.filter(x=>x.sector===g.sector).reduce((a,x)=>a+x.curValue,0))]))).sort((a,b)=>b[1]-a[1]).map(([s,v])=>{
                const pct=(v/totalValue)*100;
                return(
                  <div key={s} style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:11,color:"#94a3b8"}}>{s}</span>
                      <span style={{fontSize:11,color:"#e2e8f0",fontFamily:"monospace"}}>{fmt$(v)} · {pct.toFixed(1)}%</span>
                    </div>
                    <div style={{background:"#0d1424",borderRadius:2,height:4}}>
                      <div style={{width:`${pct}%`,height:"100%",background:SECTOR_COLORS[s]||"#475569",borderRadius:2,transition:"width 0.4s"}}/>
                    </div>
                  </div>
                );
              })}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({title,children}) {
  return(
    <div style={{background:"#0d1424",border:"1px solid #1a2744",borderRadius:10,padding:16}}>
      <div style={{fontSize:9,color:"#334155",letterSpacing:"0.16em",textTransform:"uppercase",marginBottom:14}}>{title}</div>
      {children}
    </div>
  );
}
