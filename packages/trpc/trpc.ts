import type {OpenApiMeta} from '@lilyrose2798/trpc-openapi'
import {z} from '@opensdks/util-zod'
import {initTRPC} from '@trpc/server'
import type {RouterContext} from '@openint/engine-backend'
import {env, MGMT_PROVIDER_NAME, proxyRequired} from '@openint/env'
import {BadRequestError} from './errors'

// export interface RouterContext {
//   headers: Headers
//   providerByName: Record<string, unknown>
// }

export interface RouterMeta extends OpenApiMeta {
  /** @deprecated */
  response?: {
    vertical: 'accounting' | 'investment'
    entity:
      | 'account'
      | 'expense'
      | 'vendor'
      | 'security'
      | 'holding'
      | 'transaction'
    type: 'list' // | 'get'
  }
}

// Technically trpc doesn't quite belong in here... However it adds complexity to do dependency injection
// into each vertical so we are keeping it super simple for now...
export const trpc = initTRPC
  .context<RouterContext>()
  .meta<RouterMeta>()
  .create({
    allowOutsideOfServer: true,
    errorFormatter(opts) {
      const {shape, error} = opts
      if (!(error.cause?.name === 'HTTPError')) {
        return shape
      }
      const cause = error.cause as unknown as {response: {data: unknown} | null}

      // We cannot use the errorFormatter to modify here because trpc-openapi does not respect data.httpStatus field
      // so we need to catch it further upstream. But we can add some fields... Maybe we need an explicit className field?
      return {
        // This doesn't seem to work so well in prod as name can be mangled...
        class: error.constructor.name,
        ...shape,
        data: cause.response
          ? {
              ...cause.response,
              // Renaming body to be nicer. otherwise we end up with data.data
              data: undefined,
              body: cause.response.data,
            }
          : shape.data,
      }
    },
    // if (error instanceof NoLongerAuthenticatedError) {
    //   return {code: ''}
    // }
    // // TODO: We need better logic around this... 500 from BYOS is very different from
    // // 500 from our platform. This is likely not a good heuristic at the moement...
    // if (err instanceof HTTPError && err.code >= 500) {
    //   return 'REMOTE_ERROR'
    // }
    // // Anything else non-null would be considered internal error.
    // if (err != null) {
    //   return 'INTERNAL_ERROR'
    // }
    // console.log('errorFormatter', opts)
    // shape.data.httpStatus = 401

    //   return {
    //     ...shape,
    //     code: -32600,
    //     data: {
    //       ...shape.data,
    //       code: 'BAD_REQUEST',
    //       httpStatus: 409,
    //     },
    //   }
    // },
  })

export const zByosHeaders = z.object({
  'x-customer-id': z.string().nullish(),
  'x-provider-name': z.string().nullish(),
  'x-nango-secret-key': z.string().nullish(),
  /** Supaglue API key */
  'x-api-key': z.string().nullish(),
  /** Will use nangoPostgres instead of supaglue */
  'x-mgmt-provider-name': MGMT_PROVIDER_NAME.optional(),
})
export type ByosHeaders = z.infer<typeof zByosHeaders>

// All the headers we accept here...
export const publicProcedure = trpc.procedure.use(async ({next, ctx, path}) => {
  const optional = zByosHeaders.parse(
    Object.fromEntries(ctx.headers?.entries() ?? []),
  )
  const required = proxyRequired(optional, {
    formatError: (key) => new BadRequestError(`${key} header is required`),
  })

  // Defaulting to supaglue here for now but worker defaults to nango
  const mgmtProviderName =
    optional['x-mgmt-provider-name'] ?? env.MGMT_PROVIDER_NAME

  return next({
    ctx: {...ctx, path, optional, required, mgmtProviderName},
  })
})