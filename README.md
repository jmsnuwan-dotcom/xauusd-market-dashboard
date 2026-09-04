# XAUUSD Live Market Dashboard — Vercel

This version removes historical EA-performance data and account controls.

The dashboard is designed to display:
- Live XAUUSD price
- M1 direction
- Real-time BUY / SELL percentage
- Current market condition
- Spread / volatility / momentum / liquidity
- Upcoming USD news supplied by the news feed
- Automatic OFFLINE state when the live feed stops

## Important

The repository is **live-feed ready**, but the BUY/SELL analysis is intentionally NOT invented here.
The next integration must calculate those values from real XAUUSD M1 market data.

### Vercel deployment

Import this repository into Vercel. No framework/build command is required.

### Persistent live feed

Vercel serverless functions are not a permanent database. This project uses Upstash Redis for the latest snapshot.

Create a free/paid Upstash Redis database and add these Vercel environment variables:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `MARKET_API_KEY`

Redeploy after adding them.

### MT5

`mt5_sender.mq5` is a separate connector template. It does NOT change the existing EA strategy.

After compiling:
1. MT5 → Tools → Options → Expert Advisors.
2. Enable "Allow WebRequest for listed URL".
3. Add your Vercel domain.
4. Put the Vercel API URL and secret into the sender.
5. Attach it to XAUUSD.

### Next integration

The sender currently posts price/spread and placeholder analysis fields. The actual M1 market-analysis engine should be connected next. This is deliberate: no BUY/SELL percentage is fabricated as real data.
