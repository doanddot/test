import { decodeJwt } from "./decode-jwt";


export function getMaxAge(token: string): number {
  const payload = decodeJwt(token);

  return payload.exp - Math.floor(Date.now() / 1000);
}