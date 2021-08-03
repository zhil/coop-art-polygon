import { COOPART_ADDRESS } from 'dapp/defaults'
import { useEffect, useState } from 'react'
import { Message, Page } from 'styles'
import { TezosToolkit } from '@taquito/taquito'
import { EditTilesView } from './EditTiles.view'

export type Coordinates = {
  x: number
  y: number
}

export enum LandType {
  Road = 'Road',
  Water = 'Water',
  Land = 'Land',
  District = 'District',
  Plaza = 'Plaza',
}

export type Token = {
  name?: string
  description?: string
  position: Coordinates
  landType: LandType
  isOwned: boolean
  owner: string
  onSale: boolean
  price: number
  id: number
}

type EditTilesProp = {
  transactionPending: boolean
}

export const EditTiles = ({ transactionPending }: EditTilesProp) => {
  const rpcProvider: string = 'https://edonet.smartpy.io'
  const tk: TezosToolkit = new TezosToolkit(rpcProvider)
  const [contractTaquito, setContractTaquito] = useState(undefined)
  const [tiles, setTiles] = useState<Token[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      const contract2: any = await tk.contract.at(COOPART_ADDRESS)
      setContractTaquito(contract2)
    })()
  }, [transactionPending])

  useEffect(() => {
    ;(async () => {
      if (contractTaquito) {
        const storage: any = await (contractTaquito as any).storage()
        const landIds = storage['market'].landIds
        if (landIds) {
          const tokenIds: number[] = landIds.map((token: { c: any[] }) => token.c[0])
          const tiles2 = await Promise.all(
            tokenIds.map(async (tokenId) => {
              const tokenRaw = await storage.market.lands.get(tokenId.toString())
              const token: Token = {
                name: tokenRaw.name,
                description: tokenRaw.description,
                position: {
                  x: tokenRaw.position[6].c[0],
                  y: tokenRaw.position[7].c[0],
                },
                landType: LandType.District,
                isOwned: tokenRaw.isOwned,
                owner: tokenRaw.owner,
                onSale: tokenRaw.onSale,
                price: tokenRaw.price,
                id: tokenRaw.id.c[0],
              }
              return token
            }),
          )
          setTiles(tiles2)
          setLoading(false)
        }
      }
    })()
  }, [contractTaquito])

  // useOnBlock(tezos, loadStorage)

  return (
    <Page>
      {tiles && tiles.length > 0 ? (
        <EditTilesView existingTiles={tiles} />
      ) : (
        <div>{loading ? <Message>Loading tiles...</Message> : <Message>No tiles available</Message>}</div>
      )}
    </Page>
  )
}
