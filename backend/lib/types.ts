export type ClerkUserEventData = {
  id: string
  username?: string | null
  email_addresses: { email_address: string }[]
  image_url?: string | null // <-- Add this line
  public_metadata?: {
    birthday?: string
    shopCodes?: string[] | string
  }
}

export type ClerkOrgMember = {
  clerkId: string
  role: 'ADMIN' | 'members'
}

export type ClerkOrgEventData = {
  id: string
  name: string
  image_url?: string | null
  public_metadata?: {
    message?: string
    phoneNo?: string
    location?: string
    code?: string
  } | null
  members?: ClerkOrgMember[]
}