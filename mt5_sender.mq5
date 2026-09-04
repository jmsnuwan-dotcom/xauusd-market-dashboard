// XAUUSD Dashboard - MT5 sender template
// Sends a market snapshot to the Vercel API.
// IMPORTANT: Fill the URL and API key, then add your own market-analysis
// values. This file does not modify your existing trading strategy.

#property strict

input string API_URL = "https://YOUR-DOMAIN.vercel.app/api/market";
input string API_KEY = "CHANGE_ME";
input int SendEverySeconds = 5;

datetime lastSend=0;

string JsonEscape(string s)
{
   StringReplace(s,"\\","\\\\");
   StringReplace(s,""","\\"");
   return s;
}

void OnTick()
{
   if(TimeCurrent()-lastSend < SendEverySeconds) return;
   lastSend=TimeCurrent();

   string symbol=_Symbol;
   double bid=SymbolInfoDouble(symbol,SYMBOL_BID);
   double ask=SymbolInfoDouble(symbol,SYMBOL_ASK);
   double spread=(ask-bid)/_Point;

   // Replace these demo analysis values with values calculated by your
   // separate market-analysis engine. Do NOT change your existing EA strategy.
   double buyPct=50.0;
   string direction="NEUTRAL";

   string json=StringFormat(
      "{"symbol":"%s","price":%.2f,"spread":%.1f,"buyPct":%.1f,"
      ""direction":"%s","status":"WAITING FOR LIVE ANALYSIS","
      ""statusText":"MT5 feed connected; analysis values pending","
      ""condition":{"trend":"—","volatility":"—","momentum":"—","
      ""liquidity":"—","spreadCondition":"LIVE","newsRisk":"—"}}",
      JsonEscape(symbol),bid,spread,buyPct,direction
   );

   char post[];
   StringToCharArray(json,post,0,StringLen(json));
   char result[];
   string responseHeaders;
   string headers="Content-Type: application/json\r\nX-Market-Key: "+API_KEY+"\r\n";
   ResetLastError();
   int code=WebRequest("POST",API_URL,headers,5000,post,result,responseHeaders);

   if(code==-1)
      Print("Dashboard WebRequest failed: ",GetLastError(),
            ". Add your Vercel domain under MT5: Tools > Options > Expert Advisors > Allow WebRequest.");
   else
      Print("Dashboard response HTTP ",code);
}
