import { COOPART_ADDRESS, NETWORK } from 'dapp/defaults'
import { useEffect, useState } from 'react'
import { Message, Page } from 'styles'
import { TezosToolkit } from '@taquito/taquito'
import { MarketplaceView } from './Marketplace.view'
import { Tile } from 'pages/EditTiles/EditTiles.view'

type MarketplaceProps = {
  setTransactionPendingCallback: (b: boolean) => void
  transactionPending: boolean
}

export const Marketplace = ({ transactionPending }: MarketplaceProps) => {
  const rpcProvider: string = `https://${NETWORK}.smartpy.io`
  const tk: TezosToolkit = new TezosToolkit(rpcProvider)
  const [contractTaquito, setContractTaquito] = useState(undefined)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      const contract2: any = await tk.contract.at(COOPART_ADDRESS)
      setContractTaquito(contract2)
    })()
  }, [tk.contract, transactionPending])

  useEffect(() => {
    ;(async () => {
      if (contractTaquito) {
        const storage: any = await (contractTaquito as any).storage()
        const tileIds = storage['market'].tileIds
        console.log('tileIds', tileIds)
        if (tileIds) {
          const tileNumbers: number[] = tileIds.map((tile: { c: any[] }) => tile.c[0])
          console.log('tileNumbers', tileNumbers)

          const tilesToShow = await Promise.all(
            tileNumbers.map(async (tileId) => {
              const tileRaw = await storage.market.tiles.get(tileId.toString())
              console.log(tileRaw)
              const tile: Tile = {
                tileId: tileRaw.id.c[0],
                canvasId: tileRaw.canvasId,
                x: tileRaw.x,
                y: tileRaw.y,
                image: tileRaw.image,
                isOwned: tileRaw.isOwned,
                owner: tileRaw.owner,
                onSale: tileRaw.onSale,
                price: tileRaw.price,
              }
              return tile
            }),
          )
          setTiles(tilesToShow)
          setLoading(false)
        }
      }
    })()
  }, [contractTaquito])

  // useOnBlock(tezos, loadStorage)

  return (
    <Page>
      {tiles && tiles.length > 0 ? (
        <MarketplaceView tiles={tiles} />
      ) : (
        <div>
          {loading ? (
            <Message>Loading tiles... Please wait up to 5 min (this is not optimized yet)).</Message>
          ) : (
            <Message>No tile available</Message>
          )}
        </div>
      )}
    </Page>
  )
}
