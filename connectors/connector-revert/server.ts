import type {RevertSDK} from '@opensdks/sdk-revert'
import {initRevertSDK} from '@opensdks/sdk-revert'
import type {ConnectorServer} from '@usevenice/cdk'
import {Rx, rxjs} from '@usevenice/util'
import type {revertSchemas} from './def'
import {helpers} from './def'

export const revertServer = {
  newInstance: ({settings}) =>
    initRevertSDK({
      headers: {
        'x-revert-api-token': settings.api_token,
        'x-revert-t-id': settings.customer_id,
        'x-api-version': settings.api_version,
      },
    }),
  sourceSync: ({instance, streams, state}) => {
    async function* iterateRecords() {
      for (const stream of Object.keys(streams ?? {}).filter(
        (s) => !!streams[s as keyof typeof streams],
      )) {
        const sState = (state as Record<string, unknown>)[stream] ?? {}
        yield* iterateRecordsInStream(stream, sState)
      }
    }

    async function* iterateRecordsInStream(
      stream: string,
      /** stream state */
      sState: {cursor?: string | null},
    ) {
      const plural = revertPluralize(stream)
      let cursor = sState.cursor
      while (true) {
        const res = await instance.GET(`/crm/${plural as 'companies'}`, {
          params: {query: {cursor}},
        })
        yield res.data.results.map((com) =>
          helpers._opData(stream as 'company', com.id ?? '', com),
        )
        cursor = res.data.next
        if (!cursor) {
          break
        }
      }
    }
    return rxjs
      .from(iterateRecords())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, helpers._op('commit')])))
  },
} satisfies ConnectorServer<typeof revertSchemas, RevertSDK>

export default revertServer

function revertPluralize(word: string) {
  // Apply basic pluralization rules
  if (
    word.endsWith('s') ||
    word.endsWith('ch') ||
    word.endsWith('sh') ||
    word.endsWith('x') ||
    word.endsWith('z')
  ) {
    return word + 'es'
  } else if (
    word.endsWith('y') &&
    !['a', 'e', 'i', 'o', 'u'].includes(word.charAt(word.length - 2))
  ) {
    return word.slice(0, -1) + 'ies'
  } else {
    return word + 's'
  }
}
