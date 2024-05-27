import {type LeverSDKType} from '@openint/connector-lever'
import {applyMapper} from '@openint/vdk'
import type {ATSAdapter} from '../../router'
import {mappers} from './mappers'

export const leverAdapter = {
  listJobs: async ({instance, input}) => {
    const cursor =
      input?.cursor && Number(input?.cursor) > 0
        ? Number(input?.cursor)
        : undefined
    const res = await instance.GET('/postings', {
      params: {
        // TODO: Figure out pagination for each of them since this updated_at_start based.
        // query: {
        //   // per_page: input?.page_size,
        //   page: cursor,
        // },
      },
    })
    let nextCursor = undefined
    if (input?.page_size && res.data?.data?.length === input?.page_size) {
      nextCursor = (cursor || 0) + input.page_size
    }
    return {
      has_next_page: !!nextCursor,
      next_cursor: nextCursor ? String(nextCursor) : undefined,
      items: res.data?.data?.map((d) => applyMapper(mappers.posting, d)) ?? [],
    }
  },
  // TODO: To implement after clarity on implementation details
  listOffers: async ({instance, input}) => {
    const cursor =
      input?.cursor && Number(input?.cursor) > 0
        ? Number(input?.cursor)
        : undefined
    const res = await instance.GET('/opportunities', {
      params: {
        // TODO: Figure out pagination for each of them since this updated_at_start based.
        // query: {
        //   per_page: input?.page_size,
        //   page: cursor,
        // },
      },
    })

    // TODO: Possible solution: Get all opportunites and then scan through their offers? Then return the offers object

    let nextCursor = undefined
    if (input?.page_size && res.data?.data?.length === input?.page_size) {
      nextCursor = (cursor || 0) + input.page_size
    }
    return {
      has_next_page: !!nextCursor,
      next_cursor: nextCursor ? String(nextCursor) : undefined,
      items: [],
      // res.data?.data?.map((d) => applyMapper(mappers.opportunity, d)) ?? [],
    }
  },
  listCandidates: async ({instance, input}) => {
    const cursor =
      input?.cursor && Number(input?.cursor) > 0
        ? Number(input?.cursor)
        : undefined
    const res = await instance.GET('/opportunities')
    let nextCursor = undefined
    if (input?.page_size && [res.data?.data].length === input?.page_size) {
      nextCursor = (cursor || 0) + input.page_size
    }
    return {
      has_next_page: !!res.data?.hasNext,
      next_cursor: nextCursor ? String(nextCursor) : undefined,
      items:
        [res.data?.data]?.flatMap((d) =>
          d.map((e) => applyMapper(mappers.opportunity, e)),
        ) ?? [],
    }
  },
  // Note: API does not support pagination
  listDepartments: async ({instance}) => {
    const res = await instance.GET('/tags')
    return {
      has_next_page: false,
      items:
        res.data?.data?.flatMap(
          (d) => d.data?.map((d) => applyMapper(mappers.tag, d)),
        ) ?? [],
    }
  },
} satisfies ATSAdapter<LeverSDKType>