export type ShareType = 'copy' | 'whatsapp' | 'web_share'

export type ShareTemplateId =
  | 'soft_invite'
  | 'body_doubling'
  | 'check_in'
  | 'general'

export type ShareSourceScreen = 'profile' | 'body_double'

export interface ShareEventInput {
  userId: string
  shareType: ShareType
  templateId: ShareTemplateId
  sourceScreen: ShareSourceScreen
  isGuest: false
}
