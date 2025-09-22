// TODO: add interface AuthTokenPayload
export function decodeJwt(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

  return JSON.parse(decodeURIComponent(window.atob(base64).split('').map((c) =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join('')))
}