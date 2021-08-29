import { Loader } from 'app/App.components/Loader/Loader.view'
import axios from 'axios'
import { useAccountPkh, useProvider } from 'dapp/dapp'
import { COOPART_ADDRESS, SUBGRAPH_URL } from 'dapp/defaults'
import { ethers } from 'ethers'
import { Tile } from 'pages/EditTiles/EditTiles.view'
import { useCallback, useEffect, useState } from 'react'
import { Message, Page } from 'styles'
import { createClient } from 'urql'

import Token from '../../artifacts/contracts/CoopartNFT.sol/CoopartNFT.json'
import { MarketplaceView } from './Marketplace.view'

type MarketplaceProps = {
  setTransactionPendingCallback: (b: boolean) => void
  transactionPending: boolean
}

export type Buy = {
  canvasId: string
}

export const Marketplace = ({ transactionPending }: MarketplaceProps) => {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const accountPkh = useAccountPkh()
  const provider = useProvider()

  useEffect(() => {
    ;(async () => {
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
        const tilesToShow = await Promise.all(
          data.data.tokens.map(async (token: { id: string; uri: string }) => {
            const tokenData = await axios.get(`https://ipfs.infura.io/ipfs/${token.uri.replace('ipfs://', '')}`)

            console.log(`https://ipfs.infura.io/ipfs/${tokenData.data.image.replace('ipfs://', '')}`)

            if (tokenData.data) {
              const tile: Tile = {
                tileId: tokenData.data.tileId,
                canvasId: tokenData.data.canvasId,
                x: tokenData.data.x,
                y: tokenData.data.y,
                r: tokenData.data.r,
                image: `https://ipfs.infura.io/ipfs/${tokenData.data.image.replace('ipfs://', '')}`,
                deadline: tokenData.data.deadline,
                height: tokenData.data.height,
                width: tokenData.data.width,
              }
              return tile
            } else return undefined
          }),
        )

        setTiles(tilesToShow.filter((tile) => tile !== undefined) as Tile[])
        setLoading(false)
      }
    })()
  }, [])

  const buyCallback = useCallback(
    async ({ canvasId }: Buy) => {
      //@ts-ignore
      const signer = provider.getSigner()
      const contract = new ethers.Contract(COOPART_ADDRESS, Token.abi, provider)
      const contractWithSigner = contract.connect(signer)
      return contractWithSigner.buy(canvasId, { value: ethers.utils.parseEther('1') })
    },
    [provider, accountPkh],
  )

  return (
    <Page>
      {tiles && tiles.length > 0 ? (
        <MarketplaceView tiles={tiles} buyCallback={buyCallback} />
      ) : (
        <div>
          {loading ? (
            <Message>
              <Loader />
            </Message>
          ) : (
            <Message>No tile available</Message>
          )}
        </div>
      )}
    </Page>
  )
}
