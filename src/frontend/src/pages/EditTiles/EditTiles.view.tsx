import { Button } from 'app/App.components/Button/Button.controller'
import { Input } from 'app/App.components/Input/Input.controller'
import { create } from 'ipfs-http-client'
import { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { Mint } from './EditTiles.controller'
import dayjs from 'dayjs'

// prettier-ignore
import { EditTilesCanvas, EditTilesCanvasBottom, EditTilesCanvasLeft, EditTilesCanvasMiddle, EditTilesCanvasRight, EditTilesCanvasTop, EditTilesLoading, EditTilesMenu, EditTilesStyled, EditTilesTile, TileVoting, TileVotingButtons, UploaderFileSelector, UploaderLabel } from "./EditTiles.style";

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })
// const client = new NFTStorage({
//   token:
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweENiNEIyQjM3Qjg5NTM4NzMxZjA1M0JFYjM2MjI4ZjM3YWNjYzkwODkiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYyODkwMTM2NDYxMiwibmFtZSI6ImNvb3BhcnQifQ.zjvM0aqhPvH6FmBMOdAP4XAYpdJOvIS3hDjAfOqz8tA',
// })

type EditTilesViewProps = {
  loadingTiles: boolean
  mintCallback: (mintProps: Mint) => Promise<any>
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
  image: string
  deadline: string
  tileWidth: number
  tileHeight: number
}

export const EditTilesView = ({
  loadingTiles,
  mintCallback,
  connectedUser,
  existingTiles,
  setMintTransactionPendingCallback,
  mintTransactionPending,
  urlCanvasId,
}: EditTilesViewProps) => {
  const [showGrid, setShowGrid] = useState(true)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [newTiles, setNewTiles] = useState<Tile[]>([])
  const [tileWidth, setTileWidth] = useState(340)
  const [tileHeight, setTileHeight] = useState(340)
  const [lockedInputs, setLockedInputs] = useState(false)
  const [deadline, setDeadline] = useState(dayjs().add(3, 'days').format())
  const [isUploading, setIsUploading] = useState(false)
  const alert = useAlert()
  const [canvasId, setCanvasId] = useState(urlCanvasId)
  const [canvasSize, setCanvasSize] = useState({
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
    canvasWidth: 1,
    canvasHeight: 1,
  })

  useEffect(() => {
    console.log(tiles)
  }, [tiles])

  useEffect(() => {
    if (!urlCanvasId) setCanvasId((Math.random() + 1).toString(36).substring(7))
  }, [urlCanvasId])

  useEffect(() => {
    if (existingTiles.length > 0) {
      setTiles([...newTiles, ...existingTiles])
      setTileWidth(existingTiles[0].tileWidth)
      setTileHeight(existingTiles[0].tileHeight)
      setDeadline(existingTiles[0].deadline)
      setLockedInputs(true)
    }
  }, [existingTiles])

  useEffect(() => {
    if (tiles.length > 0) {
      const xMin = tiles.map((tile) => tile.x).reduce((result, currentValue) => Math.min(result, currentValue))
      const xMax = tiles.map((tile) => tile.x).reduce((result, currentValue) => Math.max(result, currentValue))
      const yMin = tiles.map((tile) => tile.y).reduce((result, currentValue) => Math.min(result, currentValue))
      const yMax = tiles.map((tile) => tile.y).reduce((result, currentValue) => Math.max(result, currentValue))

      if (xMin < canvasSize.xMin || xMax > canvasSize.xMax || yMin < canvasSize.yMin || yMax > canvasSize.yMax)
        setCanvasSize({
          xMin,
          xMax,
          yMin,
          yMax,
          canvasWidth: xMax - xMin + 1,
          canvasHeight: yMax - yMin + 1,
        })
    }
  }, [tiles])

  async function handleUpload(file: File, x: number, y: number) {
    const tileId = Math.floor(Math.random() * 1000000) //TODO: Implement better tileId

    try {
      setIsUploading(true)

      // Upload to IPFS
      const uploadedImage = await client.add(file)

      const json = {
        name: 'Coopart Tile',
        description: 'Coopart Tile',
        image: `ipfs://${uploadedImage.path}`,
        tileId,
        canvasId: canvasId as string,
        x,
        y,
        deadline,
        tileWidth,
        tileHeight,
      }

      const uploadedJson = await client.add(Buffer.from(JSON.stringify(json)))

      const image = `https://ipfs.infura.io/ipfs/${uploadedImage.path}`

      const tokenUri = `ipfs://${uploadedJson.path}`

      console.log('tokenUri', tokenUri)

      // const metadata = await client.store({
      //   name: 'Coopart Tile',
      //   description: 'Coopart Tile',
      //   image: file,
      // })
      // console.log('image-url', toGatewayURL(metadata.data.image.href, { gateway: 'https://ipfs.infura.io/ipfs' }))

      const tile: Tile = {
        tileId,
        canvasId: canvasId as string,
        x,
        y,
        image,
        deadline,
        tileWidth,
        tileHeight,
      }

      setNewTiles(newTiles.concat(tile))
      setTiles([...newTiles.concat(tile), ...existingTiles])

      // Mint token
      mintCallback({ tokenUri })
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

      setIsUploading(false)
    } catch (error) {
      alert.error(error.message)
      console.error(error)
      setIsUploading(false)
    }
  }

  return (
    <EditTilesStyled>
      <EditTilesMenu>
        {showGrid ? (
          <Button text="Hide grid" icon="hide" onClick={() => setShowGrid(false)} />
        ) : (
          <Button text="Show grid" icon="show" onClick={() => setShowGrid(true)} />
        )}

        {/* <Button text="Download canvas" icon="download" /> */}

        <div>Tile size:</div>
        <Input
          value={tileWidth}
          placeholder="width"
          type="text"
          onChange={(e) => setTileWidth(parseInt(e.target.value) || 1)}
          onBlur={() => {}}
          disabled={lockedInputs}
        />
        <div>x</div>
        <Input
          value={tileHeight}
          placeholder="height"
          type="text"
          onChange={(e) => setTileHeight(parseInt(e.target.value) || 1)}
          onBlur={() => {}}
          disabled={lockedInputs}
        />

        <div>Deadline:</div>
        <Input
          value={deadline}
          placeholder="days"
          type="text"
          onChange={(e) => setDeadline(e.target.value || 1)}
          onBlur={() => {}}
          disabled={lockedInputs}
        />

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

      <EditTilesCanvas width={tileWidth * canvasSize.canvasWidth}>
        <EditTilesCanvasLeft
          height={tileHeight * canvasSize.canvasHeight}
          onClick={() =>
            setCanvasSize({ ...canvasSize, xMin: canvasSize.xMin - 1, canvasWidth: canvasSize.canvasWidth + 1 })
          }
        >
          <img alt="arrow" src="/icons/arrow.svg" />
        </EditTilesCanvasLeft>

        <div>
          <EditTilesCanvasTop
            width={tileWidth * canvasSize.canvasWidth}
            onClick={() =>
              setCanvasSize({ ...canvasSize, yMin: canvasSize.yMin - 1, canvasHeight: canvasSize.canvasHeight + 1 })
            }
          >
            <img alt="arrow" src="/icons/arrow.svg" />
          </EditTilesCanvasTop>

          {/* @ts-ignore */}
          {Array.apply(null, { length: canvasSize.yMax + 1 - canvasSize.yMin })
            .map(function (_, idx) {
              return idx + canvasSize.yMin
            })
            .map((y) => (
              <EditTilesCanvasMiddle key={`y${y}`} tileWidth={tileWidth} canvasWidth={canvasSize.canvasWidth}>
                {/* @ts-ignore */}
                {Array.apply(null, { length: canvasSize.xMax + 1 - canvasSize.xMin })
                  .map(function (_, idx) {
                    return idx + canvasSize.xMin
                  })
                  .map((x) => {
                    const tilesThere = tiles.filter((tile) => tile.x === x && tile.y === y)

                    return (
                      <EditTilesTile key={`y${y}x${x}`} width={tileWidth} height={tileHeight} showGrid={showGrid}>
                        <div>
                          <div>
                            <p>{`Tile (${x}, ${y})`}</p>
                            {tilesThere.length > 0 ? (
                              <TileVoting>
                                Vote on tile:
                                <TileVotingButtons>
                                  <img
                                    alt="check"
                                    src="/icons/check.svg"
                                    onClick={() => alert.info('This feature is coming soon in phase II.')}
                                  />
                                  <img
                                    alt="cross"
                                    src="/icons/cross.svg"
                                    onClick={() => alert.info('This feature is coming soon in phase II.')}
                                  />
                                </TileVotingButtons>
                              </TileVoting>
                            ) : (
                              <UploaderFileSelector>
                                {isUploading ? (
                                  <div>Uploading...</div>
                                ) : (
                                  <input
                                    id="uploader"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e: any) => {
                                      e.target &&
                                        e.target.files &&
                                        e.target.files[0] &&
                                        handleUpload(e.target.files[0], x, y)
                                    }}
                                  />
                                )}
                              </UploaderFileSelector>
                            )}
                          </div>
                        </div>
                        {tilesThere.length > 0 && <img alt="tile" src={tilesThere.map((tile) => tile.image)[0]} />}
                      </EditTilesTile>
                    )
                  })}
              </EditTilesCanvasMiddle>
            ))}

          <EditTilesCanvasBottom
            width={tileWidth * canvasSize.canvasWidth}
            onClick={() =>
              setCanvasSize({ ...canvasSize, yMax: canvasSize.yMax + 1, canvasHeight: canvasSize.canvasHeight + 1 })
            }
          >
            <img alt="arrow" src="/icons/arrow.svg" />
          </EditTilesCanvasBottom>
        </div>

        <EditTilesCanvasRight
          height={tileHeight * canvasSize.canvasHeight}
          onClick={() =>
            setCanvasSize({ ...canvasSize, xMax: canvasSize.xMax + 1, canvasWidth: canvasSize.canvasWidth + 1 })
          }
        >
          <img alt="arrow" src="/icons/arrow.svg" />
        </EditTilesCanvasRight>
      </EditTilesCanvas>
    </EditTilesStyled>
  )
}
