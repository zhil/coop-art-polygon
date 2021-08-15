// prettier-ignore
import { useAccountPkh, useOnBlock, useProvider } from "dapp/dapp";
import { ADMIN, COOPART_ADDRESS, SUBGRAPH_URL } from 'dapp/defaults'
import { ethers } from 'ethers'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Message, Page } from 'styles'
import { createClient } from 'urql'
import axios from 'axios'

import { EditTilesView, Tile } from './EditTiles.view'
import Token from '../../artifacts/contracts/CoopartNFT.sol/CoopartNFT.json'

export type Mint = {
  tokenUri: string
  canvasId: string
}

export type Vote = {
  tileId: number
  up: boolean
}

type EditTilesProps = {
  setMintTransactionPendingCallback: (b: boolean) => void
  mintTransactionPending: boolean
}

export const EditTiles = ({ setMintTransactionPendingCallback, mintTransactionPending }: EditTilesProps) => {
  const accountPkh = useAccountPkh()
  const [loadingTiles, setLoadingTiles] = useState(false)
  const [existingTiles, setExistingTiles] = useState<Tile[]>([])
  let { canvasId } = useParams<{ canvasId?: string }>()

  const loadStorage = React.useCallback(async () => {
    if (canvasId) {
      setLoadingTiles(true)

      const tokensQuery = `
        query {
          tokens(first: 100) {
            id
            uri
          }
        }
      `
      const client = createClient({
        url: SUBGRAPH_URL,
      })
      const data = await client.query(tokensQuery).toPromise()
      console.log(data)

      if (data.data && data.data.tokens && data.data.tokens.length > 0) {
        const existingTilesToShow = await Promise.all(
          data.data.tokens.map(async (token: { id: string; uri: string }) => {
            const tokenData = await axios.get(`https://ipfs.infura.io/ipfs/${token.uri.replace('ipfs://', '')}`)

            console.log(`https://ipfs.infura.io/ipfs/${tokenData.data.image.replace('ipfs://', '')}`)

            if (tokenData.data) {
              const tile: Tile = {
                tileId: tokenData.data.tileId,
                canvasId: tokenData.data.canvasId,
                x: tokenData.data.x,
                y: tokenData.data.y,
                image: `https://ipfs.infura.io/ipfs/${tokenData.data.image.replace('ipfs://', '')}`,
                deadline: tokenData.data.deadline,
                tileHeight: tokenData.data.tileHeight,
                tileWidth: tokenData.data.tileWidth,
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
  }, [canvasId])

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
    async ({ tokenUri, canvasId }: Mint) => {
      //@ts-ignore
      const signer = provider.getSigner()
      const contract = new ethers.Contract(COOPART_ADDRESS, Token.abi, provider)
      const contractWithSigner = contract.connect(signer)
      return contractWithSigner.mint(accountPkh, tokenUri, canvasId)
    },
    [provider, accountPkh],
  )

  const voteCallback = React.useCallback(
    async ({ tileId, up }: Vote) => {
      //@ts-ignore
      const signer = provider.getSigner()
      const contract = new ethers.Contract(COOPART_ADDRESS, Token.abi, provider)
      const contractWithSigner = contract.connect(signer)
      if (up) return contractWithSigner.upvote(tileId)
      return contractWithSigner.downvote(tileId)
    },
    [provider],
  )

  return (
    <Page>
      {accountPkh ? (
        <EditTilesView
          loadingTiles={loadingTiles}
          mintCallback={mintCallback}
          voteCallback={voteCallback}
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
