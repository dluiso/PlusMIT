import type { Access, CollectionAfterChangeHook, CollectionAfterDeleteHook, FieldAccess } from 'payload'

export type Role =
  | 'super-admin'
  | 'administrator'
  | 'content-manager'
  | 'seo-manager'
  | 'lead-manager'
  | 'viewer'

type UserWithRoles = {
  roles?: Role[]
}

export const roleOptions = [
  { label: 'Super Admin', value: 'super-admin' },
  { label: 'Administrator', value: 'administrator' },
  { label: 'Content Manager', value: 'content-manager' },
  { label: 'SEO Manager', value: 'seo-manager' },
  { label: 'Lead Manager', value: 'lead-manager' },
  { label: 'Viewer', value: 'viewer' },
]

export const hasRole = (user: unknown, roles: Role[]) => {
  const assigned = (user as UserWithRoles | undefined)?.roles ?? []
  return assigned.some((role) => roles.includes(role))
}

export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

export const canManageSystem: Access = ({ req }) =>
  hasRole(req.user, ['super-admin', 'administrator'])

export const superAdminOnly: Access = ({ req }) => hasRole(req.user, ['super-admin'])

export const contentAccess: Access = ({ req }) =>
  hasRole(req.user, ['super-admin', 'administrator', 'content-manager', 'seo-manager'])

export const leadAccess: Access = ({ req }) =>
  hasRole(req.user, ['super-admin', 'administrator', 'lead-manager'])

export const readPublishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { status: { equals: 'published' } }
}

export const seoFieldAccess: FieldAccess = ({ req }) =>
  hasRole(req.user, ['super-admin', 'administrator', 'seo-manager'])

export const systemFieldAccess: FieldAccess = ({ req }) =>
  hasRole(req.user, ['super-admin', 'administrator'])

export const auditAfterChange =
  (collection: string): CollectionAfterChangeHook =>
  async ({ doc, operation, req }) => {
    if (!req.user || collection === 'audit-logs') return doc

    await req.payload.create({
      collection: 'audit-logs',
      data: {
        action: `${collection}.${operation}`,
        collection,
        documentId: String(doc.id),
        actor: req.user.id,
        metadata: { title: doc.title || doc.name || doc.email || null },
      },
      overrideAccess: true,
      req,
    })

    return doc
  }

export const auditAfterDelete =
  (collection: string): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    if (!req.user || collection === 'audit-logs') return doc

    await req.payload.create({
      collection: 'audit-logs',
      data: {
        action: `${collection}.delete`,
        collection,
        documentId: String(doc.id),
        actor: req.user.id,
        metadata: { title: doc.title || doc.name || doc.email || null },
      },
      overrideAccess: true,
      req,
    })

    return doc
  }
