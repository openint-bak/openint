import {type LeverObjectType} from '@openint/connector-lever'
import {mapper, zCast} from '@openint/vdk'
import * as unified from '../../../unifiedModels'

export const posting = mapper(
  zCast<LeverObjectType['posting']>(),
  unified.job,
  {
    id: (record) => String(record.id),
    created_at: 'createdAt',
    modified_at: 'updatedAt',
    name: 'text',
    confidential: (record) => record.confidentiality === 'confidential',
    departments: 'tags',
    // offices: 'offic',
    hiring_managers: 'hiringManager',
    // recruiters: 'hiring_team.recruiters',
  },
)
