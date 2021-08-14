// prettier-ignore
import { useAccountPkh, useOnBlock, useProvider } from "dapp/dapp";
import { ADMIN, COOPART_ADDRESS } from 'dapp/defaults'
import { ethers } from 'ethers'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Message, Page } from 'styles'

import { EditTilesView, Tile } from './EditTiles.view'
import Token from '../../artifacts/contracts/NFT.sol/MyNFT.json'

export type Mint = {
  tileId: number
  canvasId: string
  x: number
  y: number
  image: string
  owner?: string
  deadline: string
  tileWidth: number
  tileHeight: number
}

type EditTilesProps = {
  setMintTransactionPendingCallback: (b: boolean) => void
  mintTransactionPending: boolean
}

export const EditTiles = ({ setMintTransactionPendingCallback, mintTransactionPending }: EditTilesProps) => {
  const accountPkh = useAccountPkh()
  const [contract, setContract] = useState(undefined)
  const [loadingTiles, setLoadingTiles] = useState(false)
  const [existingTiles, setExistingTiles] = useState<Tile[]>([])
  let { canvasId } = useParams<{ canvasId?: string }>()

  const loadStorage = React.useCallback(async () => {
    if (canvasId) {
      setLoadingTiles(true)
      if (contract) {
        const storage = await (contract as any).storage()
        if (storage['market']?.tileIds?.length > 0) {
          console.log('tileIds', storage['market'].tileIds)

          const existingTilesToShow = await Promise.all(
            storage['market'].tileIds.map(async (tileId: number) => {
              const tileRaw = await storage.market.tiles.get(tileId.toString())
              console.log('tileRaw', tileRaw)

              if (tileRaw) {
                const tile: Tile = {
                  tileId: tileRaw.tileId.c[0],
                  canvasId: tileRaw.canvasId,
                  x: tileRaw.x.s * tileRaw.x.c[0],
                  y: tileRaw.y.s * tileRaw.y.c[0],
                  image: tileRaw.image,
                  isOwned: tileRaw.isOwned,
                  owner: tileRaw.owner,
                  onSale: tileRaw.onSale,
                  price: tileRaw.price,
                  deadline: tileRaw.deadline,
                  tileHeight: tileRaw.tileHeight,
                  tileWidth: tileRaw.tileWidth,
                }
                return tile
              } else return undefined
            }),
          )
          //@ts-ignore
          setExistingTiles(existingTilesToShow.filter((tile: Tile) => tile && tile.canvasId === canvasId) as Tile[])
        }
        setLoadingTiles(false)
      }
      // setExistingTokenIds(storage['market'].tileIds.map((tileIdAsObject: { c: any[] }) => tileIdAsObject.c[0]))
      // setEditTilesAdress(storage.market.admin)
    }
  }, [canvasId, contract])

  useEffect(() => {
    loadStorage()
  }, [loadStorage])

  // useEffect(() => {
  //   ;(async () => {
  //     if (tezos) {
  //       const ctr = await (tezos as any).wallet.at(COOPART_ADDRESS)
  //       setContract(ctr)
  //     }
  //   })()
  // }, [tezos, mintTransactionPending])

  // useOnBlock(tezos, loadStorage)

  const provider = useProvider()

  console.log('provider ', provider)

  const mintCallback = React.useCallback(
    async ({ tileId, canvasId, x, y, image, owner, deadline, tileWidth, tileHeight }: Mint) => {
      //@ts-ignore
      const signer = provider.getSigner()
      const account = await signer.getAddress()
      const contract = new ethers.Contract(COOPART_ADDRESS, Token.abi, provider)
      const contractWithSigner = contract.connect(signer)
      // const tx = await contract.mint(accountPkh, nft.cid).wait();
      return contractWithSigner.mint(accountPkh, 'QmXUSSgzCQUNezLpo9Xn8TSmgkPqL3SgT8RpfyyNjGgimN/turtle.json')
    },
    [provider, accountPkh],
  )

  return (
    <Page>
      {accountPkh ? (
        <EditTilesView
          loadingTiles={loadingTiles}
          mintCallback={mintCallback}
          connectedUser={(accountPkh as unknown) as string}
          existingTiles={existingTiles}
          setMintTransactionPendingCallback={setMintTransactionPendingCallback}
          mintTransactionPending={mintTransactionPending}
          urlCanvasId={canvasId}
        />
      ) : (
        <Message>Please connect your wallet</Message>
      )}
    </Page>
  )
}
