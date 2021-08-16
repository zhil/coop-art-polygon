import { Timer } from 'app/App.components/Timer/Timer.controller'
import dayjs from 'dayjs'
import { Tile } from 'pages/EditTiles/EditTiles.view'
import { useAlert } from 'react-alert'
import { Link } from 'react-router-dom'
import { Buy } from './Marketplace.controller'

// prettier-ignore
import { MarketplaceCanvas, MarketplaceCanvasTile, MarketplaceCanvasTileContainer, MarketplaceCanvasTileContribute, MarketplaceCanvasTileCount, MarketplaceCanvasTileExpiry, MarketplaceCanvasTiles, MarketplaceCanvasTileScaler, MarketplaceCanvasTileSold, MarketplaceContainer, MarketplaceStyled } from './Marketplace.style'

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
      <h1>Tile-based Canvases</h1>
      <MarketplaceContainer>
        {canvasIds.map((canvasId) => {
          const tilesInCanvas = tiles.filter((tile) => tile.canvasId === canvasId)
          const deadline = tiles.filter((tile) => tile.canvasId === canvasId)[0].deadline

          const xMin = tilesInCanvas
            .map((tile) => tile.x)
            .reduce((result, currentValue) => Math.min(result, currentValue))
          const xMax = tilesInCanvas
            .map((tile) => tile.x)
            .reduce((result, currentValue) => Math.max(result, currentValue))
          const yMin = tilesInCanvas
            .map((tile) => tile.y)
            .reduce((result, currentValue) => Math.min(result, currentValue))
          const yMax = tilesInCanvas
            .map((tile) => tile.y)
            .reduce((result, currentValue) => Math.max(result, currentValue))
          const canvasWidth = xMax - xMin + 1
          const canvasHeight = yMax - yMin + 1
          const tileWidth = tilesInCanvas[0].tileWidth
          const tileHeight = tilesInCanvas[0].tileHeight

          console.log(tilesInCanvas)

          const scale = Math.min(270 / (canvasWidth * tileWidth || 1), 200 / (canvasHeight * tileHeight || 1))

          return (
            <MarketplaceCanvas>
              <MarketplaceCanvasTiles>
                <MarketplaceCanvasTileScaler scale={scale}>
                  {
                    //@ts-ignore
                    Array.apply(null, { length: canvasHeight })
                      .map(function (_, idx) {
                        return idx + yMin
                      })
                      .map((y) => (
                        <MarketplaceCanvasTileContainer key={`y${y}`} tileWidth={tileWidth} canvasWidth={canvasWidth}>
                          {/* @ts-ignore */}
                          {Array.apply(null, { length: canvasWidth })
                            .map(function (_, idx) {
                              return idx + xMin
                            })
                            .map((x) => (
                              <MarketplaceCanvasTile key={`y${y}x${x}`} width={tileWidth} height={tileHeight}>
                                {tilesInCanvas.filter((tile) => tile.x === x && tile.y === y).length > 0 && (
                                  <img
                                    alt="tile"
                                    src={
                                      tilesInCanvas
                                        .filter((tile) => tile.x === x && tile.y === y)
                                        .map((tile) => tile.image)[0]
                                    }
                                  />
                                )}
                              </MarketplaceCanvasTile>
                            ))}
                        </MarketplaceCanvasTileContainer>
                      ))
                  }
                </MarketplaceCanvasTileScaler>
              </MarketplaceCanvasTiles>
              <MarketplaceCanvasTileCount>
                <svg>
                  <use xlinkHref="/icons/sprites.svg#tilesborder" />
                </svg>
                <div>{`${tiles.filter((tile) => tile.canvasId === canvasId).length} tiles`}</div>
              </MarketplaceCanvasTileCount>

              {dayjs(deadline).add(5, 'days').unix() - dayjs().unix() > 0 ? (
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
