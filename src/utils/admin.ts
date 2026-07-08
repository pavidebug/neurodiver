import type { User } from 'firebase/auth'

export const ADMIN_EMAILS = ['pavi2024ns@gmail.com']

export function isAdminUser(user: User | null | undefined): boolean {
  const email = user?.email?.trim().toLowerCase()
  return !!email && ADMIN_EMAILS.includes(email)
}
