// prettier-ignore
import { useAccountPkh, useOnBlock, useReady, useTezos, useWallet } from "dapp/dapp";
import { ADMIN, COOPART_ADDRESS } from 'dapp/defaults'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Message, Page } from 'styles'

import { EditTilesView, Tile } from './EditTiles.view'

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
  const [loadingTiles, setLoadingTiles] = useState(false)
  const [tiles, setTiles] = useState<Tile[]>([])
  let { canvasId } = useParams<{ canvasId?: string }>()

  const loadStorage = React.useCallback(async () => {
    if (contract && canvasId) {
      setLoadingTiles(true)
      const storage = await (contract as any).storage()
      if (storage['market']?.tileIds?.length > 0) {
        console.log('tileIds', storage['market'].tileIds)

        const tilesToShow = await Promise.all(
          storage['market'].tileIds.map(async (tileId: number) => {
            const tileRaw = await storage.market.tiles.get(tileId.toString())
            console.log('tileRaw', tileRaw)

            if (tileRaw) {
              const tile: Tile = {
                tileId: tileRaw.tileId.c[0],
                canvasId: tileRaw.canvasId,
                x: tileRaw.x.c[0],
                y: tileRaw.y.c[0],
                image: tileRaw.image,
                isOwned: tileRaw.isOwned,
                owner: tileRaw.owner,
                onSale: tileRaw.onSale,
                price: tileRaw.price,
              }
              return tile
            } else return undefined
          }),
        )
        //@ts-ignore
        setTiles(tilesToShow.filter((tile: Tile) => tile && tile.canvasId === canvasId) as Tile[])
        setLoadingTiles(false)
      }
      // setExistingTokenIds(storage['market'].tileIds.map((tileIdAsObject: { c: any[] }) => tileIdAsObject.c[0]))
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
              loadingTiles={loadingTiles}
              mintCallback={mintCallback}
              connectedUser={(accountPkh as unknown) as string}
              existingTiles={tiles}
              setMintTransactionPendingCallback={setMintTransactionPendingCallback}
              mintTransactionPending={mintTransactionPending}
              urlCanvasId={canvasId}
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
