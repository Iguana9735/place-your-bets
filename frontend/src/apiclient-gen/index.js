import { request } from './request';

export function health() {
  return request("get", `/health`, { "header": { "Content-Type": "application/json", }, })();
}

export function getInfo(params) {
  return request("get", `/info`, { "header": { "Content-Type": "application/json", }, })(params);
}

export function submitGuess(params) {
  return request("post", `/submit-guess`, { "header": { "accept": "application/json", }, })(params);
}

