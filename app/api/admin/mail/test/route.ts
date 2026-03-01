import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { auth } from "@/lib/auth"

interface Body {
  to?: string
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const apiKey = process.env.RESEND_API_KEY || ""
  const mailFrom = process.env.MAIL_FROM || ""
  if (!apiKey || !mailFrom) {
    return NextResponse.json(
      {
        error: "RESEND_NOT_CONFIGURED",
        detail: "Missing RESEND_API_KEY or MAIL_FROM",
      },
      { status: 400 },
    )
  }

  try {
    const body = (await request.json()) as Body
    const to = body?.to?.trim() || session.user.email
    const resend = new Resend(apiKey)

    const result = await resend.emails.send({
      from: mailFrom,
      to,
      subject: "Resend test email",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Resend test succeeded</h2>
        <p>This is a test email from your dashboard.</p>
        <p>Time: ${new Date().toLocaleString("zh-CN", { hour12: false })}</p>
      </div>`,
    })

    if (result.error) {
      return NextResponse.json({ error: "RESEND_TEST_FAILED", detail: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ error: "RESEND_TEST_FAILED", detail: message }, { status: 500 })
  }
}
