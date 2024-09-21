// import {clerkClient} from '@clerk/nextjs'
// import Image from 'next/image'
import {kAccessToken} from '@openint/app-config/constants'
import {getViewerId} from '@openint/cdk'
import {zConnectPageParams} from '@openint/engine-backend/router/endUserRouter'
import {ConnectionPortal} from '@openint/engine-frontend'
import {ClientRoot} from '@/components/ClientRoot'
import {SuperHydrate} from '@/components/SuperHydrate'
import {createServerComponentHelpers} from '@/lib-server/server-component-helpers'

export const metadata = {
  title: 'OpenInt Connection Management Portal',
}

/**
 * Workaround for searchParams being empty on production. Will ahve to check
 * @see https://github.com/vercel/next.js/issues/43077#issuecomment-1383742153
 */
export const dynamic = 'force-dynamic'

// Should we allow page to optionally load without token for performance then add token async
// Perhaps it would even be an advantage to have the page simply be static?
// Though that would result in waterfall loading of integrations

/**
 * Embed this fully featured page to allow customers to fully manage their own resources
 * Include checking sync status, adding, removing, and reauthenticating their connections
 */
export default async function PortalPage({
  //  https://beta.nextjs.org/docs/api-reference/file-conventions/page#searchparams-optional
  searchParams,
}: {
  // Search params in Next.js are only accessible in PageComponent and no accessible in layout component, too bad
  // @see https://github.com/vercel/next.js/issues/43704
  searchParams: Record<string, string | string[] | undefined>
}) {
  const {token} = zConnectPageParams.parse(searchParams)
  const {getDehydratedState, viewer} = await createServerComponentHelpers({
    searchParams: {[kAccessToken]: token},
  })
  if (viewer.role !== 'end_user') {
    return (
      <div>Authenticated user only. Your role is {getViewerId(viewer)}</div>
    )
  }

  return (
    <div className="h-screen w-screen p-6">
      <ClientRoot accessToken={viewer.accessToken} authStatus="success">
        <SuperHydrate dehydratedState={getDehydratedState()}>
          <ConnectionPortal />
        </SuperHydrate>
      </ClientRoot>
    </div>
  )
}