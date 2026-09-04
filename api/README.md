# Market API

GET `/api/market` returns the latest market snapshot.

POST `/api/market` accepts a JSON market snapshot. Send the secret in:
`X-Market-Key: <MARKET_API_KEY>`

For persistent live data on Vercel, configure:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `MARKET_API_KEY`

The API expires a snapshot after 30 seconds, so a stopped EA/feed automatically becomes OFFLINE.
