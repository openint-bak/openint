'use client'

import {Search} from 'lucide-react'
import React from 'react'
import {Input, IntegrationCard} from '@openint/ui'
import type {ConnectorConfig} from '../hocs/WithConnectConfig'
import type {ConnectEventType} from '../hocs/WithConnectorConnect'
import {WithConnectorConnect} from '../hocs/WithConnectorConnect'
import {_trpcReact} from '../providers/TRPCProvider'

export function IntegrationSearch({
  className,
  connectorConfigs,
  onEvent,
}: {
  className?: string
  /** TODO: Make this optional so it is easier to use it as a standalone component */
  connectorConfigs: ConnectorConfig[]
  onEvent?: (event: {
    integration: {
      connectorConfigId: string
      id: string
    }
    type: ConnectEventType
  }) => void
}) {
  const [searchText, setSearchText] = React.useState('')

  const listIntegrationsRes = _trpcReact.listConfiguredIntegrations.useQuery({
    connector_config_ids: connectorConfigs.map((ccfg) => ccfg.id),
    search_text: searchText,
  })
  const ints = listIntegrationsRes.data?.items.map((int) => ({
    ...int,
    ccfg: connectorConfigs.find((ccfg) => ccfg.id === int.connector_config_id)!,
  }))

  return (
    <div className={className}>
      {/* Search integrations */}
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            {/* top-2.5 is not working for some reason due to tailwind setup */}
            <Search className="absolute left-2 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-8"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </form>
      </div>
      {/* Search results */}
      <div className="flex flex-wrap gap-4">
        {ints?.map((int) => (
          <WithConnectorConnect
            key={int.id}
            connectorConfig={{
              id: int.connector_config_id,
              connector: int.ccfg.connector,
            }}
            // pre-select a single integration when possible
            // ^ don't remember what this comment means
            onEvent={(e) => {
              onEvent?.({
                type: e.type,
                integration: {
                  connectorConfigId: int.connector_config_id,
                  id: int.id,
                },
              })
            }}>
            {({openConnect}) => (
              // <DialogTrigger asChild>
              <IntegrationCard
                // {...uiProps}
                onClick={() => openConnect()}
                integration={{
                  ...int,
                  connectorName: int.connector_name,
                  // connectorConfigId: int.connector_config_id,
                }}
              />
              // </DialogTrigger>
            )}
          </WithConnectorConnect>
        ))}
      </div>
    </div>
  )
}
