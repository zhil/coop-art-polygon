import { Button } from 'app/App.components/Button/Button.controller'
import { Input } from 'app/App.components/Input/Input.controller'
import { create } from 'ipfs-http-client'
import { useState } from 'react'
import { useAlert } from 'react-alert'

// prettier-ignore
import { EditTilesCanvas, EditTilesCanvasBottom, EditTilesCanvasLeft, EditTilesCanvasMiddle, EditTilesCanvasRight, EditTilesCanvasTop, EditTilesMenu, EditTilesStyled, EditTilesTile, UploaderFileSelector, UploaderLabel } from "./EditTiles.style";

const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

type MintProps = {
  owner: string
  landType: string
  xCoordinates: number
  yCoordinates: number
  landName: string
  description: string
}

type EditTilesViewProps = {
  mintCallBack: (mintProps: MintProps) => Promise<any>
  setMintTransactionPendingCallback: (b: boolean) => void
  connectedUser: string
  mintTransactionPending: boolean
  existingTokenIds: Array<number>
}

export type Tile = {
  name?: string
  image?: string
  x: number
  y: number
  owner: string
  id: number
  canvasId: number
}

const exampleTiles: Tile[] = [
  {
    name: 'hello0',
    image: 'https://bafybeigvy3cwjbx6hflxxtog5yp7iorsl4z2oyiriaovdzhrbahlekjplu.ipfs.infura-ipfs.io/',
    x: 0,
    y: 0,
    owner: '0x',
    id: 0,
    canvasId: 0,
  },
  {
    name: 'hello1',
    image: 'https://bafybeigvy3cwjbx6hflxxtog5yp7iorsl4z2oyiriaovdzhrbahlekjplu.ipfs.infura-ipfs.io/',
    x: 3,
    y: -2,
    owner: '0x',
    id: 1,
    canvasId: 0,
  },
]

export const EditTilesView = ({
  mintCallBack,
  connectedUser,
  existingTokenIds,
  setMintTransactionPendingCallback,
  mintTransactionPending,
}: EditTilesViewProps) => {
  const [showGrid, setShowGrid] = useState(true)
  const [tiles, setTiles] = useState<Tile[]>(exampleTiles)
  const [tileWidth, setTileWidth] = useState(340)
  const [tileHeight, setTileHeight] = useState(340)
  const [period, setPeriod] = useState(3)
  const [isUploading, setIsUploading] = useState(false)
  const [hover, setHover] = useState({ x: -1, y: -1 })
  const alert = useAlert()

  const [canvasSize, setCanvasSize] = useState<{ xMin: number; xMax: number; yMin: number; yMax: number }>({
    xMin: tiles.map((tile) => tile.x).reduce((result, currentValue) => Math.min(result, currentValue)),
    xMax: tiles.map((tile) => tile.x).reduce((result, currentValue) => Math.max(result, currentValue)),
    yMin: tiles.map((tile) => tile.y).reduce((result, currentValue) => Math.min(result, currentValue)),
    yMax: tiles.map((tile) => tile.y).reduce((result, currentValue) => Math.max(result, currentValue)),
  })

  const canvasWidth = canvasSize.xMax - canvasSize.xMin + 1
  const canvasHeight = canvasSize.yMax - canvasSize.yMin + 1

  async function handleUpload(file: any) {
    const x = hover.x
    const y = hover.y
    console.log(x, y)

    try {
      setIsUploading(true)

      // Upload to IPFS
      const added = await client.add(file)
      const image = `https://ipfs.infura.io/ipfs/${added.path}`
      setTiles(
        tiles.concat({
          name: 'hello1',
          image,
          x,
          y,
          owner: '0x',
          id: tiles.length,
          canvasId: 0,
        }),
      )

      // Mint token
      if (mintTransactionPending) {
        alert.info('Cannot mint a new land while the previous one is not minted...', { timeout: 10000 })
      } else {
        mintCallBack({
          owner: connectedUser,
          landType: 'land',
          xCoordinates: x,
          yCoordinates: y,
          landName: 'test',
          description: 'test',
        })
          .then((e) => {
            setMintTransactionPendingCallback(true)
            alert.info('Minting a new tile...')
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
            console.error(e.message)
          })
      }

      setIsUploading(false)
    } catch (error) {
      alert.error(error.message)
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
                      <div onMouseOver={() => setHover({ x, y })}>
                        <div>
                          <p>{`Tile coordinates (${x}, ${y})`}</p>
                          <UploaderFileSelector>
                            <UploaderLabel htmlFor="uploader">
                              <svg>
                                <use xlinkHref="/icons/sprites.svg#upload" />
                              </svg>
                              {isUploading ? 'Uploading...' : `Upload tile with IPFS`}
                            </UploaderLabel>
                            <input
                              id="uploader"
                              type="file"
                              accept="image/*"
                              onChange={(e: any) => {
                                e.target && e.target.files && e.target.files[0] && handleUpload(e.target.files[0])
                              }}
                            />
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
