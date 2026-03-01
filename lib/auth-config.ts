export const authAllowSignUp = (() => {
  const raw = process.env.AUTH_ALLOW_SIGN_UP ?? process.env.NEXT_PUBLIC_AUTH_ALLOW_SIGN_UP
  if (!raw) return true
  return raw.toLowerCase() !== "false"
})()
