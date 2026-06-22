export default function getUserInfo() {
  // Browser code must never read or verify the session token. Identity comes
  // from authenticated API responses; mobile clients use a Bearer token.
  return { error: "Client-side token access is disabled" };
}
