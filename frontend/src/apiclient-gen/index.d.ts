type RequestResult<Data> = Promise<{ response: Response; data: Data; }>;

type HealthResult0 = RequestResult<object>;
/**
* Just an endpoint to see that the backend is running. Always returns 200
*/
export function health(): HealthResult0;

type GetInfoParams0 = { "header": { "Authorization": string; }; };
type GetInfoResult0 = RequestResult<{ "bitcoinPrice": number; "recentGuesses": ({ "priceAtSubmission": number; "submittedAt": number; "direction": "UP" | "DOWN"; "priceAtResolution"?: number; "resolvedAt"?: number; "result"?: "CORRECT" | "INCORRECT"; })[]; "score": number; }>;
/**
* Get all the info the frontend needs in one call
*/
export function getInfo(params: GetInfoParams0): GetInfoResult0;

type SubmitGuessParams0 = { "header": { "Authorization": string; }; "body"?: { "direction": "UP" | "DOWN"; }; };
type SubmitGuessResult0 = RequestResult<null>;
/**
* Submit a guess
*/
export function submitGuess(params: SubmitGuessParams0): SubmitGuessResult0;

