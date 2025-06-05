# Place your bets

A coding assignment

## Rationale, architectural decisions

This will consist of a frontend (running in the browser) and a backend.

So far I know only that the frontend will use React. Everything else is to be decided.

The backend will be written in TypeScript, probably using Express.js.
I don't have a lot of experience with JavaScript/TypeScript backends, but this
seems to be the tech stack for this company, so it would be the logical choice.

The nature of this app could benefit from push messages (possibly websockets).
However, for the sake of simplicity, this will use only HTTP calls. It'll get
close enough to real-time by polling the backend very frequently.

Both frontend and backend will be deployed to AWS.

For the backend, I will attempt a ports-and-adapters (hexagonal) architecture.

The persistence mechanism remains to be decided.

The source of BitCoin price data remains to be decided.

## Testing and running
