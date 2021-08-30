import { Button } from 'app/App.components/Button/Button.controller'
import dayjs from 'dayjs'
import { create } from 'ipfs-http-client'
import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'

import { EditTilesCanvas } from './EditTiles.canvas'
import { Mint, Vote } from './EditTiles.controller'
// prettier-ignore
import { EditTilesLoading, EditTilesMenu, EditTilesStyled, EditTilesVoting, SimpleButton, TileVoting, TileVotingButtons, TileVotingImg } from "./EditTiles.style";

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })
// const client = new NFTStorage({
//   token:
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENiNEIyQjM3Qjg5NTM4NzMxZjA1M0JFYjM2MjI4ZjM3YWNjYzkwODkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODkwMTM2NDYxMiwibmFtZSI6ImNvb3BhcnQifQ.zjvM0aqhPvH6FmBMOdAP4XAYpdJOvIS3hDjAfOqz8tA',
// })

type EditTilesViewProps = {
  loadingTiles: boolean
  mintCallback: (mintProps: Mint) => Promise<any>
  voteCallback: (voteProps: Vote) => Promise<any>
  setMintTransactionPendingCallback: (b: boolean) => void
  connectedUser: string
  mintTransactionPending: boolean
  existingTiles: Tile[]
  urlCanvasId?: string
}

export type Tile = {
  tileId: number
  canvasId: string
  x: number
  y: number
  r: number
  image: string
  deadline: string
  width: number
  height: number
}

export const EditTilesView = ({
  loadingTiles,
  mintCallback,
  voteCallback,
  connectedUser,
  existingTiles,
  setMintTransactionPendingCallback,
  mintTransactionPending,
  urlCanvasId,
}: EditTilesViewProps) => {
  const [newTile, setNewTile] = useState<Tile | undefined>()
  const [isUploading, setIsUploading] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const alert = useAlert()
  const [canvasId, setCanvasId] = useState(urlCanvasId)

  useEffect(() => {
    if (!urlCanvasId) setCanvasId((Math.random() + 1).toString(36).substring(7))
  }, [urlCanvasId])

  async function handleVote(tileId: number, up: boolean) {
    voteCallback({ tileId, up })
      .then((e) => {
        setMintTransactionPendingCallback(true)
        alert.info('Voting on tile...')
        e.wait().then((e: any) => {
          console.log('Vote casted')
          alert.success('Vote casted', {
            onOpen: () => {
              setMintTransactionPendingCallback(false)
            },
          })
          return e
        })
        return e
      })
      .catch((e: any) => {
        alert.show(e.message)
        console.error(e)
      })
  }

  async function handleUpload(file: File) {
    const tileId = Math.floor(Math.random() * 1000000) //TODO: Implement better tileId
    const deadline = dayjs().add(7, 'days').format()

    try {
      setIsUploading(true)

      // Upload to IPFS
      const uploadedImage = await client.add(file)

      // Get image size
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function (e) {
        var image = new Image()
        //@ts-ignore
        image.src = e.target.result
        image.onload = function () {
          //@ts-ignore
          console.log('onload', this.width, this.height)
          setNewTile({
            tileId,
            canvasId: canvasId as string,
            x: 0,
            y: 0,
            r: 0,
            image: `ipfs://${uploadedImage.path}`,
            deadline,
            //@ts-ignore
            width: this.width,
            //@ts-ignore
            height: this.height,
          })

          setIsUploading(false)
        }
      }
    } catch (error) {
      alert.error(error.message)
      console.error(error)
      setIsUploading(false)
    }
  }

  async function handleMint(tile: Tile) {
    try {
      setIsMinting(true)

      // Upload to IPFS

      const json = {
        name: 'Coopart Tile',
        description: 'Coopart Tile',
        image: tile.image,
        tileId: tile.tileId,
        canvasId: canvasId as string,
        x: tile.x, // TODO: Store doubles
        y: tile.y,
        r: tile.r,
        width: tile.width,
        height: tile.height,
        deadline: tile.deadline,
      }

      console.log('tile', tile)

      const uploadedJson = await client.add(Buffer.from(JSON.stringify(json)))

      const tokenUri = `ipfs://${uploadedJson.path}`

      console.log('tokenUri', tokenUri)

      // Mint token
      mintCallback({ tokenUri, canvasId: canvasId as string })
        .then((e) => {
          setMintTransactionPendingCallback(true)
          alert.info('Minting new tile...')
          e.wait().then((e: any) => {
            console.log('New tile minted')
            alert.success('New tile minted', {
              onOpen: () => {
                setMintTransactionPendingCallback(false)
              },
            })
            return e
          })
          return e
        })
        .catch((e: any) => {
          alert.show(e.message)
          console.error(e)
        })

      setIsMinting(false)
    } catch (error) {
      alert.error(error.message)
      console.error(error)
      setIsMinting(false)
    }
  }

  const updateTileCallback = (tile: Tile) => {
    setNewTile(tile)
  }

  return (
    <EditTilesStyled>
      <EditTilesMenu>
        {isUploading ? (
          <SimpleButton>Uploading...</SimpleButton>
        ) : (
          <div>
            <label htmlFor="uploader">
              <SimpleButton>Upload Image</SimpleButton>
            </label>
            <input
              hidden
              id="uploader"
              type="file"
              accept="image/*"
              onChange={(e: any) => {
                e.target && e.target.files && e.target.files[0] && handleUpload(e.target.files[0])
              }}
            />
          </div>
        )}

        {newTile ? (
          <Button text="Mint layer" icon="price" loading={isMinting} onClick={() => handleMint(newTile)} />
        ) : (
          <Button text="Mint layer" icon="price" disabled onClick={() => {}} />
        )}

        <div>
          {loadingTiles && (
            <EditTilesLoading>
              <svg>
                <use xlinkHref="/icons/sprites.svg#loading" />
              </svg>
              <div>Loading existing tiles...</div>
            </EditTilesLoading>
          )}
        </div>
      </EditTilesMenu>

      <EditTilesCanvas existingTiles={existingTiles} newTile={newTile} updateTileCallback={updateTileCallback} />

      <EditTilesVoting>
        {existingTiles.map((tile: Tile) => (
          <TileVoting>
            <img alt="layer" src={tile.image} />
            <div>Layer ID {tile.tileId}</div>
            <img alt="check" src="/icons/check.svg" onClick={() => handleVote(tile.tileId, true)} />
            <img alt="cross" src="/icons/cross.svg" onClick={() => handleVote(tile.tileId, false)} />
          </TileVoting>
        ))}
      </EditTilesVoting>
    </EditTilesStyled>
  )
}
