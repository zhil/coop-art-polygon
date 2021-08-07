// prettier-ignore
import { useAccountPkh, useOnBlock, useReady, useTezos, useWallet } from "dapp/dapp";
import { ADMIN, COOPART_ADDRESS } from 'dapp/defaults'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Message, Page } from 'styles'

import { EditTilesView } from './EditTiles.view'

export type Mint = {
  tileId: number
  canvasId: string
  x: number
  y: number
  image: string
  owner?: string
}

type EditTilesProps = {
  setMintTransactionPendingCallback: (b: boolean) => void
  mintTransactionPending: boolean
}

export const EditTiles = ({ setMintTransactionPendingCallback, mintTransactionPending }: EditTilesProps) => {
  const wallet = useWallet()
  const ready = useReady()
  const tezos = useTezos()
  const accountPkh = useAccountPkh()
  const [contract, setContract] = useState(undefined)
  // const [adminAdress, setEditTilesAdress] = useState(undefined)
  const [existingTokenIds, setExistingTokenIds] = useState<Array<number>>([])
  let { canvasId } = useParams<{ canvasId?: string }>()

  const loadStorage = React.useCallback(async () => {
    if (contract) {
      const storage = await (contract as any).storage()
      if (storage['market']?.landIds?.length > 0)
        setExistingTokenIds(storage['market'].landIds.map((landIdAsObject: { c: any[] }) => landIdAsObject.c[0]))
      // setEditTilesAdress(storage.market.admin)
    }
  }, [contract])

  useEffect(() => {
    loadStorage()
  }, [loadStorage])

  useEffect(() => {
    ;(async () => {
      if (tezos) {
        const ctr = await (tezos as any).wallet.at(COOPART_ADDRESS)
        setContract(ctr)
      }
    })()
  }, [tezos, mintTransactionPending])

  useOnBlock(tezos, loadStorage)

  const mintCallback = React.useCallback(
    ({ tileId, canvasId, x, y, image, owner }: Mint) => {
      return (contract as any).methods.mint(canvasId, image, ADMIN, owner, tileId, x, y).send()
    },
    [contract],
  )

  return (
    <Page>
      {wallet ? (
        <>
          {ready ? (
            <EditTilesView
              mintCallback={mintCallback}
              connectedUser={(accountPkh as unknown) as string}
              existingTokenIds={existingTokenIds}
              setMintTransactionPendingCallback={setMintTransactionPendingCallback}
              mintTransactionPending={mintTransactionPending}
              canvasId={canvasId}
            />
          ) : (
            <Message>Please connect your wallet</Message>
          )}
        </>
      ) : (
        <Message>Please install the Temple Wallet Chrome Extension.</Message>
      )}
    </Page>
  )
}
