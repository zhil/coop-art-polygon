import { Button } from 'app/App.components/Button/Button.controller'
import { Input } from 'app/App.components/Input/Input.controller'
import { create } from 'ipfs-http-client'
import { useState } from 'react'
import { useAlert } from 'react-alert'
import { Mint } from './EditTiles.controller'

// prettier-ignore
import { EditTilesCanvas, EditTilesCanvasBottom, EditTilesCanvasLeft, EditTilesCanvasMiddle, EditTilesCanvasRight, EditTilesCanvasTop, EditTilesMenu, EditTilesStyled, EditTilesTile, UploaderFileSelector, UploaderLabel } from "./EditTiles.style";

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

type EditTilesViewProps = {
  mintCallback: (mintProps: Mint) => Promise<any>
  setMintTransactionPendingCallback: (b: boolean) => void
  connectedUser: string
  mintTransactionPending: boolean
  existingTokenIds: Array<number>
  canvasId?: string
}

export type Tile = {
  tileId: number
  canvasId: string
  x: number
  y: number
  image: string
  isOwned?: boolean
  owner?: string
  onSale?: boolean
  price?: number
}

export const EditTilesView = ({
  mintCallback,
  connectedUser,
  existingTokenIds,
  setMintTransactionPendingCallback,
  mintTransactionPending,
  canvasId,
}: EditTilesViewProps) => {
  const [showGrid, setShowGrid] = useState(true)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [tileWidth, setTileWidth] = useState(340)
  const [tileHeight, setTileHeight] = useState(340)
  const [period, setPeriod] = useState(3)
  const [isUploading, setIsUploading] = useState(false)
  const alert = useAlert()
  if (!canvasId) canvasId = (Math.random() + 1).toString(36).substring(7)

  const [canvasSize, setCanvasSize] = useState<{ xMin: number; xMax: number; yMin: number; yMax: number }>({
    xMin:
      tiles.length > 0
        ? tiles.map((tile) => tile.x).reduce((result, currentValue) => Math.min(result, currentValue))
        : 0,
    xMax:
      tiles.length > 0
        ? tiles.map((tile) => tile.x).reduce((result, currentValue) => Math.max(result, currentValue))
        : 0,
    yMin:
      tiles.length > 0
        ? tiles.map((tile) => tile.y).reduce((result, currentValue) => Math.min(result, currentValue))
        : 0,
    yMax:
      tiles.length > 0
        ? tiles.map((tile) => tile.y).reduce((result, currentValue) => Math.max(result, currentValue))
        : 0,
  })

  const canvasWidth = canvasSize.xMax - canvasSize.xMin + 1
  const canvasHeight = canvasSize.yMax - canvasSize.yMin + 1

  async function handleUpload(file: any, x: number, y: number) {
    const tileId = Math.floor(Math.random() * 1000000000000000000000)

    try {
      setIsUploading(true)

      // Upload to IPFS
      const added = await client.add(file)
      const image = `https://ipfs.infura.io/ipfs/${added.path}`

      const tile: Tile = {
        tileId,
        canvasId: canvasId as string,
        x,
        y,
        image,
        owner: connectedUser,
      }

      setTiles(tiles.concat(tile))

      // Mint token
      if (mintTransactionPending) {
        alert.info('Cannot mint a new land while the previous one is not minted...', { timeout: 10000 })
      } else {
        console.log(tile)
        mintCallback(tile)
          .then((e) => {
            setMintTransactionPendingCallback(true)
            alert.info('Minting new tile...')
            e.confirmation().then((e: any) => {
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
      }

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

        <Button text="Download canvas" icon="download" />

        <div>Tile size:</div>
        <Input
          value={tileWidth}
          placeholder="width"
          type="text"
          onChange={(e) => setTileWidth(e.target.value || 1)}
          onBlur={() => {}}
        />
        <div>x</div>
        <Input
          value={tileHeight}
          placeholder="height"
          type="text"
          onChange={(e) => setTileHeight(e.target.value || 1)}
          onBlur={() => {}}
        />

        <div>Time period:</div>
        <Input
          value={period}
          placeholder="days"
          type="text"
          onChange={(e) => setPeriod(e.target.value || 1)}
          onBlur={() => {}}
        />
        <div>days</div>
      </EditTilesMenu>

      <EditTilesCanvas width={tileWidth * canvasWidth}>
        <EditTilesCanvasLeft
          height={tileHeight * canvasHeight}
          onClick={() => setCanvasSize({ ...canvasSize, xMin: canvasSize.xMin - 1 })}
        >
          <img alt="arrow" src="/icons/arrow.svg" />
        </EditTilesCanvasLeft>

        <div>
          <EditTilesCanvasTop
            width={tileWidth * canvasWidth}
            onClick={() => setCanvasSize({ ...canvasSize, yMin: canvasSize.yMin - 1 })}
          >
            <img alt="arrow" src="/icons/arrow.svg" />
          </EditTilesCanvasTop>

          {/* @ts-ignore */}
          {Array.apply(null, { length: canvasSize.yMax + 1 - canvasSize.yMin })
            .map(function (_, idx) {
              return idx + canvasSize.yMin
            })
            .map((y) => (
              <EditTilesCanvasMiddle key={`y${y}`} tileWidth={tileWidth} canvasWidth={canvasWidth}>
                {/* @ts-ignore */}
                {Array.apply(null, { length: canvasSize.xMax + 1 - canvasSize.xMin })
                  .map(function (_, idx) {
                    return idx + canvasSize.xMin
                  })
                  .map((x) => (
                    <EditTilesTile key={`y${y}x${x}`} width={tileWidth} height={tileHeight} showGrid={showGrid}>
                      <div>
                        <div>
                          <p>{`Tile (${x}, ${y})`}</p>
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
                        </div>
                      </div>
                      {tiles.filter((tile) => tile.x === x && tile.y === y).length > 0 && (
                        <img
                          alt="tile"
                          src={tiles.filter((tile) => tile.x === x && tile.y === y).map((tile) => tile.image)[0]}
                        />
                      )}
                    </EditTilesTile>
                  ))}
              </EditTilesCanvasMiddle>
            ))}

          <EditTilesCanvasBottom
            width={tileWidth * canvasWidth}
            onClick={() => setCanvasSize({ ...canvasSize, yMax: canvasSize.yMax + 1 })}
          >
            <img alt="arrow" src="/icons/arrow.svg" />
          </EditTilesCanvasBottom>
        </div>

        <EditTilesCanvasRight
          height={tileHeight * canvasHeight}
          onClick={() => setCanvasSize({ ...canvasSize, xMax: canvasSize.xMax + 1 })}
        >
          <img alt="arrow" src="/icons/arrow.svg" />
        </EditTilesCanvasRight>
      </EditTilesCanvas>
    </EditTilesStyled>
  )
}
