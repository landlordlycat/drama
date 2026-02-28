export type AuthOperation = "LOGIN" | "LOGOUT" | "CHANGE_PASSWORD"
export type AuthResult = "SUCCESS" | "FAILURE"

interface AuthLogInput {
  operation: AuthOperation
  content: string
  result: AuthResult
  fallbackUserName?: string
}

export async function writeAuthLog(input: AuthLogInput): Promise<void> {
  try {
    await fetch("/api/admin/logs/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    })
  } catch {
    // Do not block user flow if log write fails.
  }
}

