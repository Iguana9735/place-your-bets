# Place your bets

A coding assignment

This consists of a frontend (running in the browser) and a backend.

The frontend uses React with Vite.

The backend is written in TypeScript, using Express.js for the HTTP layer. I
don't have a lot of experience with JavaScript/TypeScript backends, but this
seems to be the tech stack for this company, so I thought that's the logical choice.

For the backend, I have attempted a ports-and-adapters (hexagonal) architecture.

The nature of this app could benefit from some sort of pub-sub mechanisms to
transmit BitCoin prices with minimal delay, both from the source to the backend,
and from the backend to the frontend. However, for the sake of simplicity, I have
opted for polling HTTP endpoints in both cases.

## Running locally

### Backend

In the backend directory, `npm install` and then `npx ts-node src/main-dev.ts`.
The backend will start and listen on port 3000.

In dev mode, the backend uses
simulated (random) BitCoin prices, and persists everything in memory.

### Frontend

In the frontend directory, `npm install` and then `npm run dev`. The frontend
will be accessible on port 5173, and will attempt to reach the backend at
`localhost:3000`.

## Deployment

Both frontend and backend are deployed in AWS. The CD pipeline (GitHub actions)
deploys both on every commit.

For the frontend, I use S3 + CloudFront.

For the backend, I use ECS. Persistence is in DynamoDB tables.

I have committed the code that defines the DynamoDB tables. All the rest of
the infrastructure has been set up manually through the AWS web console.

BitCoin prices are sourced from CoinBase (https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT)

## Tests
The core logic of the backend — that is, "application core" in 
ports-and-adapters terminology — has been developed through TDD. All tests
exercise the application at its edges. I didn't find the need for lower-level
unit tests.

I wrote no tests for either the frontend or the backend adapters.
