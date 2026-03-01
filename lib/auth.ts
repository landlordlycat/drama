import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { Resend } from "resend"
import { db } from "@/db"
import * as schema from "@/auth-schema"
import { authAllowSignUp } from "@/lib/auth-config"

const PASSWORD_MIN_LENGTH = 6
const PASSWORD_MAX_LENGTH = 12

const RESEND_API_KEY = process.env.RESEND_API_KEY
const MAIL_FROM = process.env.MAIL_FROM
const APP_NAME = process.env.APP_NAME || "Drama"
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

async function sendAuthEmail(params: {
  to: string
  subject: string
  title: string
  intro: string
  actionText: string
  actionUrl: string
  fallbackText: string
}) {
  if (!resend || !MAIL_FROM) {
    console.warn("[Auth] Resend is not configured; cannot send auth email.")
    console.info(`[Auth] ${params.subject} link for ${params.to}: ${params.actionUrl}`)
    return
  }

  await resend.emails.send({
    from: MAIL_FROM,
    to: params.to,
    subject: params.subject,
    html: `
      <div style="margin:0;padding:24px;background:#f6f7fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'PingFang SC','Microsoft YaHei',Arial,sans-serif;color:#111827;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 8px 24px;">
              <h1 style="margin:0;font-size:20px;line-height:28px;color:#111827;">${params.title}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 8px 24px;">
              <p style="margin:0;font-size:14px;line-height:24px;color:#4b5563;">${params.intro}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;">
              <a href="${params.actionUrl}" target="_blank" rel="noreferrer" style="display:inline-block;background:#111827;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px;font-weight:600;">
                ${params.actionText}
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 4px 24px;">
              <p style="margin:0;font-size:12px;line-height:20px;color:#6b7280;">${params.fallbackText}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 18px 24px;">
              <p style="margin:0;font-size:12px;line-height:20px;word-break:break-all;color:#374151;">
                <a href="${params.actionUrl}" target="_blank" rel="noreferrer" style="color:#2563eb;text-decoration:underline;">${params.actionUrl}</a>
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:14px 24px;border-top:1px solid #e5e7eb;background:#f9fafb;">
              <p style="margin:0;font-size:12px;line-height:20px;color:#6b7280;">如果这不是你的操作，请忽略本邮件。</p>
            </td>
          </tr>
        </table>
      </div>
    `,
    text: `${params.title}\n\n${params.intro}\n\n${params.actionText}: ${params.actionUrl}\n\n如果这不是你的操作，请忽略本邮件。`,
  })
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  user: {
    changeEmail: {
      enabled: true,
      async sendChangeEmailVerification({ user, newEmail, url }) {
        await sendAuthEmail({
          to: newEmail,
          subject: `【${APP_NAME}】确认修改邮箱`,
          title: "确认修改邮箱",
          intro: `你正在 ${APP_NAME} 请求将邮箱从 ${user.email} 修改为 ${newEmail}，请点击下方按钮确认。`,
          actionText: "确认修改邮箱",
          actionUrl: url,
          fallbackText: "如果按钮无法点击，请复制下方链接到浏览器打开：",
        })
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: PASSWORD_MIN_LENGTH,
    maxPasswordLength: PASSWORD_MAX_LENGTH,
    autoSignIn: false,
    async sendResetPassword({ user, url }) {
      await sendAuthEmail({
        to: user.email,
        subject: `【${APP_NAME}】重置密码`,
        title: "重置密码",
        intro: `你正在 ${APP_NAME} 请求重置密码，请点击下方按钮继续。`,
        actionText: "重置密码",
        actionUrl: url,
        fallbackText: "如果按钮无法点击，请复制下方链接到浏览器打开：",
      })
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url }) {
      await sendAuthEmail({
        to: user.email,
        subject: `【${APP_NAME}】请验证你的邮箱`,
        title: "验证邮箱",
        intro: `欢迎使用 ${APP_NAME}。请点击下方按钮完成邮箱验证。`,
        actionText: "立即验证邮箱",
        actionUrl: url,
        fallbackText: "如果按钮无法点击，请复制下方链接到浏览器打开：",
      })
    },
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      disableSignUp: !authAllowSignUp,
    },
  },

  plugins: [nextCookies()],
})
