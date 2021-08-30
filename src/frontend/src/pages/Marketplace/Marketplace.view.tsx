import { Timer } from 'app/App.components/Timer/Timer.controller'
import dayjs from 'dayjs'
import { Tile } from 'pages/EditTiles/EditTiles.view'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom'
import { Buy } from './Marketplace.controller'
import { Layer, Stage } from 'react-konva'

// prettier-ignore
import { MarketplaceCanvas, MarketplaceCanvasTileContribute, MarketplaceCanvasTileCount, MarketplaceCanvasTileExpiry, MarketplaceCanvasTiles, MarketplaceCanvasTileScaler, MarketplaceContainer, MarketplaceStyled } from './Marketplace.style'
import { EditTilesImage } from 'pages/EditTiles/EditTiles.image'

type MarketplaceViewProps = {
  tiles: Tile[]
  buyCallback: (buyProps: Buy) => Promise<any>
}

export const MarketplaceView = ({ tiles, buyCallback }: MarketplaceViewProps) => {
  const alert = useAlert()

  const canvasIds = [...new Set(tiles.map((tile) => tile.canvasId))]
  console.log(canvasIds)

  async function handleBuy(canvasId: string) {
    buyCallback({ canvasId })
      .then((e) => {
        alert.info('Buying canvas...')
        e.wait().then((e: any) => {
          console.log('Canvas purchased')
          alert.success('Canvas purchased')
          return e
        })
        return e
      })
      .catch((e: any) => {
        alert.show(e.message)
        console.error(e)
      })
  }

  return (
    <MarketplaceStyled>
      <MarketplaceContainer>
        {canvasIds.map((canvasId) => {
          const tilesInCanvas = tiles.filter((tile) => tile.canvasId === canvasId)
          const deadline = tiles.filter((tile) => tile.canvasId === canvasId)[0].deadline
          console.log(tilesInCanvas)

          return (
            <MarketplaceCanvas>
              <MarketplaceCanvasTiles>
                <MarketplaceCanvasTileScaler scale={0.22}>
                  <Stage width={1240} height={920}>
                    <Layer>
                      {tilesInCanvas.map((tile: Tile) => (
                        <EditTilesImage
                          key={tile.tileId}
                          url={tile.image.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')}
                          imgProps={{
                            x: tile.x,
                            y: tile.y,
                            r: tile.r,
                            width: tile.width,
                            height: tile.height,
                          }}
                          isSelected={false}
                        />
                      ))}
                    </Layer>
                  </Stage>
                </MarketplaceCanvasTileScaler>
              </MarketplaceCanvasTiles>
              <MarketplaceCanvasTileCount>
                <svg>
                  <use xlinkHref="/icons/sprites.svg#tilesborder" />
                </svg>
                <div>{`${tiles.filter((tile) => tile.canvasId === canvasId).length} tiles`}</div>
              </MarketplaceCanvasTileCount>

              {dayjs(deadline).unix() - dayjs().unix() > 0 ? (
                <>
                  <MarketplaceCanvasTileExpiry>
                    <svg>
                      <use xlinkHref="/icons/sprites.svg#clock" />
                    </svg>
                    <Timer deadline={deadline} />
                  </MarketplaceCanvasTileExpiry>
                  <Link to={`/edit-tiles/${canvasId}`}>
                    <MarketplaceCanvasTileContribute>Contribute</MarketplaceCanvasTileContribute>
                  </Link>
                </>
              ) : (
                <>
                  <MarketplaceCanvasTileExpiry>
                    <svg>
                      <use xlinkHref="/icons/sprites.svg#clock" />
                    </svg>
                    <div>Finished</div>
                  </MarketplaceCanvasTileExpiry>
                  <MarketplaceCanvasTileContribute onClick={() => handleBuy(canvasId)}>
                    Buy for 1 MATIC
                  </MarketplaceCanvasTileContribute>
                </>
              )}
            </MarketplaceCanvas>
          )
        })}
      </MarketplaceContainer>
    </MarketplaceStyled>
  )
}
