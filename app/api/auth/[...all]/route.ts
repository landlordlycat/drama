import { auth } from "@/lib/auth"
import { authAllowSignUp } from "@/lib/auth-config"
import { toNextJsHandler } from "better-auth/next-js"

const handlers = toNextJsHandler(auth)

export async function POST(request: Request) {
  if (!authAllowSignUp) {
    const pathname = new URL(request.url).pathname
    if (pathname.endsWith("/sign-up/email")) {
      return Response.json(
        {
          error: "SIGN_UP_DISABLED",
          message: "注册功能已关闭",
        },
        { status: 403 },
      )
    }
  }

  return handlers.POST(request)
}

export const GET = handlers.GET
