import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { Resend } from "resend"
import { db } from "@/db"
import * as schema from "@/auth-schema"

const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 12

const RESEND_API_KEY = process.env.RESEND_API_KEY
const MAIL_FROM = process.env.MAIL_FROM
const APP_NAME = process.env.APP_NAME || "Drama"
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
    autoSignIn: false,
    async sendResetPassword() {
      // TODO: implement reset-password email sender.
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      if (!resend || !MAIL_FROM) {
        console.warn("[Auth] Resend is not configured; cannot send verification email.")
        console.info(`[Auth] Verification link for ${user.email}: ${url}`)
        return
      }

      await resend.emails.send({
        from: MAIL_FROM,
        to: user.email,
        subject: `【${APP_NAME}】请验证你的邮箱`,
        html: `
          <div style="margin:0;padding:24px;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'PingFang SC','Microsoft YaHei',Arial,sans-serif;color:#111827;">
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
              <tr>
                <td style="padding:24px 24px 8px 24px;">
                  <h1 style="margin:0;font-size:20px;line-height:28px;color:#111827;">验证你的邮箱</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:0 24px 8px 24px;">
                  <p style="margin:0;font-size:14px;line-height:24px;color:#4b5563;">
                    你好，欢迎使用 <strong style="color:#111827;">${APP_NAME}</strong>。请点击下方按钮完成邮箱验证。
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px;">
                  <a href="${url}" target="_blank" rel="noreferrer" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:600;">
                    立即验证邮箱
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:0 24px 4px 24px;">
                  <p style="margin:0;font-size:12px;line-height:20px;color:#6b7280;">
                    链接有效期约 1 小时。若按钮无法点击，请复制下面链接到浏览器打开：
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:0 24px 18px 24px;">
                  <p style="margin:0;font-size:12px;line-height:20px;word-break:break-all;color:#374151;">
                    <a href="${url}" target="_blank" rel="noreferrer" style="color:#2563eb;text-decoration:underline;">${url}</a>
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 24px;border-top:1px solid #e5e7eb;background:#f9fafb;">
                  <p style="margin:0;font-size:12px;line-height:20px;color:#6b7280;">
                    如果这不是你的操作，请忽略本邮件，无需进行任何处理。
                  </p>
                </td>
              </tr>
            </table>
          </div>
        `,
        text: `【${APP_NAME}】验证你的邮箱\n\n请访问以下链接完成验证：\n${url}\n\n链接有效期约 1 小时。\n如果这不是你的操作，请忽略本邮件。`,
      })
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  plugins: [nextCookies()],
})
