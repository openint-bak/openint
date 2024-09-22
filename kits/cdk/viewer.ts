import {z} from '@opensdks/util-zod'
import {TRPCError} from '@trpc/server'
import * as jwt from 'jsonwebtoken'
import {DiscriminatedUnionWithAllKeys, R, zFunction} from '@openint/util'
import type {EndUserId, ExtEndUserId, Id, UserId} from './id.types'
import {zEndUserId, zId, zUserId} from './id.types'

export const zRole = z.enum(['anon', 'end_user', 'user', 'org', 'system'])
export {ExtEndUserId}

export const zViewer = z
  .discriminatedUnion('role', [
    z.object({role: z.literal(zRole.Enum.anon)}),
    // prettier-ignore
    z.object({role: z.literal(zRole.Enum.end_user), endUserId: zEndUserId, orgId: zId('org')}),
    z.object({
      role: z.literal(zRole.Enum.user),
      userId: zUserId,
      orgId: zId('org').nullish(),
      extra: z.record(z.unknown()).optional().describe('Currently clerk user'),
    }),
    z.object({
      role: z.literal(zRole.Enum.org),
      orgId: zId('org'),
      extra: z
        .record(z.unknown())
        .optional()
        .describe('Currently clerk organization'),
    }),
    z.object({role: z.literal(zRole.Enum.system)}),
  ])
  .openapi({ref: 'Viewer'})

export type ViewerRole = z.infer<typeof zRole>

type _Viewer = DiscriminatedUnionWithAllKeys<z.infer<typeof zViewer>>
export type Viewer<R extends ViewerRole = ViewerRole> = Extract<
  _Viewer,
  {role: R}
>

export function hasRole<R extends ViewerRole>(
  viewer: Viewer,
  roles: R[],
): viewer is Viewer<R> {
  return roles.includes(viewer.role as R)
}

// MARK: -

/** Used to easily tell if two viewers are identical */
export function getViewerId(viewer: Viewer) {
  switch (viewer.role) {
    case 'anon':
      return 'anon'
    case 'end_user':
      return `${viewer.orgId}/eusr_${viewer.endUserId}`
    case 'user':
      // orgId is actually optional, thus userId first
      return R.compact([viewer.userId, viewer.orgId]).join('/')
    case 'org':
      return viewer.orgId
    case 'system':
      return 'system'
  }
}

/** Used for external systems */
export function getExtEndUserId(
  viewer: Viewer<'end_user' | 'user' | 'org' | 'system'>,
) {
  switch (viewer.role) {
    case 'end_user':
      return `eusr_${viewer.endUserId}` as ExtEndUserId
    case 'user':
      // Falling back to userId should not generally happen
      return (viewer.orgId ?? viewer.userId) as ExtEndUserId
    case 'org':
      return viewer.orgId as ExtEndUserId
    case 'system':
      return 'system' as ExtEndUserId
  }
}

// MARK: - JWT

/**
 * Clerk template for jwt payload below
{
	"aud": "authenticated",
	"role": "authenticated",
	"email": "{{user.primary_email_address}}",
	"org_id": "{{org.id}}",
	"org_name": "{{org.name}}",
	"org_role": "{{org.role}}",
	"org_slug": "{{org.slug}}",
	"app_metadata": {},
	"user_metadata": {}
}
 */
export const zJwtPayload = z.object({
  /** Different meaning in different contexts */
  sub: z.string(),
  /**
   * Jwt role is different from viewer role because supabase uses authenticated
   * by default and it's a bit too much work right now to switch
   * futher we never want to permit system role for now for security, and anon role has no token
   */
  role: z.enum(['authenticated', 'end_user', 'org']),
  /** Enforce that all jwts are timed. The actual validity check is done by jwtClient */
  exp: z.number(),
  org_id: zId('org').nullish(),
  /** Clerk: `admin` for sure and probably `basic_member` */
  org_role: z.string().nullish(),
  /** For readable urls, unique across org */
  org_slug: z.string().nullish(),
})

export const zViewerFromJwtPayload = zJwtPayload
  .nullish()
  .transform((payload): Viewer => {
    // console.log('zViewerFromJwtPayload', payload)
    switch (payload?.role) {
      case undefined:
        return {role: 'anon'}
      case 'authenticated':
        return {
          role: 'user',
          userId: payload.sub as UserId,
          orgId: payload.org_id,
        }
      case 'end_user': {
        const [orgId, endUserId] = payload.sub.split('/') as [
          Id['org'],
          EndUserId,
        ]
        return {role: payload.role, endUserId, orgId}
      }
      case 'org':
        return {role: payload.role, orgId: payload.sub as Id['org']}
    }
  })
  .pipe(zViewer)
  // Not ideal we have to explictly type, but oh well
  .refine((_): _ is Viewer<'anon' | 'end_user' | 'user' | 'org'> => true)

export const zViewerFromUnverifiedJwtToken = z
  .string()
  .nullish()
  .transform((token) => (token ? jwt.decode(token, {json: true}) : token))
  .pipe(zViewerFromJwtPayload)

// MARK: - JWT Client, maybe doesn't actually belong in here? Among
// other things would allow us to not have to import @trpc/server on the frontend

export function jwtDecode(token: string) {
  return jwt.decode(token, {json: true})
}

export const makeJwtClient = zFunction(
  z.object({secretOrPublicKey: z.string()}),
  ({secretOrPublicKey}) => ({
    verifyViewer: (token?: string | null): Viewer => {
      if (!token) {
        return {role: 'anon'}
      }
      try {
        const data = jwt.verify(token, secretOrPublicKey)
        if (typeof data === 'string') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'JWT payload must be an object, not a string.',
          })
        }
        // console.log('jwt.verify', data)
        return zViewerFromJwtPayload.parse(data)
      } catch (err) {
        // console.log('jwt.verify Error', err)
        // Actually throw token expired errror
        throw new TRPCError({code: 'UNAUTHORIZED', message: `${err}`})
        // if (!`${err}`.includes('TokenExpiredError')) {
        //   // This dependency is not great... But don't know of a better pattern for now
        // }
        // return {role: 'anon'}
      }
    },
    signViewer: (
      viewer: Viewer<'end_user' | 'user' | 'org'>,
      {validityInSeconds = 3600}: {validityInSeconds?: number} = {},
    ) => {
      const payload = {
        exp: Math.floor(Date.now() / 1000) + validityInSeconds,
        ...(viewer.role === 'end_user' && {
          role: 'end_user',
          sub: `${viewer.orgId}/${viewer.endUserId}`,
          end_user_id: viewer.endUserId, // Needed for RLS
          org_id: viewer.orgId, // Needed for RLS
        }),
        ...(viewer.role === 'org' && {
          role: 'org',
          sub: viewer.orgId,
          org_id: viewer.orgId, // Needed for RLS
        }),
        ...(viewer.role === 'user' && {
          role: 'authenticated',
          sub: viewer.userId,
          org_id: viewer.orgId, // Needed for RLS
        }),
        // Partial is a lie, it should not happen
      } satisfies Partial<z.input<typeof zViewerFromJwtPayload>>

      return jwt.sign(payload, secretOrPublicKey)
    },
  }),
)

export type JWTClient = ReturnType<typeof makeJwtClient>
