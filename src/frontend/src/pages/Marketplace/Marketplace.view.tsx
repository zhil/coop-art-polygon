import { Tile } from 'pages/EditTiles/EditTiles.view'
import { Link } from 'react-router-dom'

// prettier-ignore
import { MarketplaceCanvas, MarketplaceCanvasTile, MarketplaceCanvasTileContainer, MarketplaceCanvasTileContribute, MarketplaceCanvasTileCount, MarketplaceCanvasTileExpiry, MarketplaceCanvasTiles, MarketplaceCanvasTileScaler, MarketplaceStyled } from './Marketplace.style'

type MarketplaceViewProps = {
  tiles: Tile[]
}

export const MarketplaceView = ({ tiles }: MarketplaceViewProps) => {
  const canvasIds = [...new Set(tiles.map((tile) => tile.canvasId))]
  console.log(canvasIds)

  return (
    <MarketplaceStyled>
      {canvasIds.map((canvasId) => {
        const tilesInCanvas = tiles.filter((tile) => tile.canvasId === canvasId)
        if (tilesInCanvas.length === 0) return <div />

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

        return (
          <Link to={`/edit-tiles/${canvasId}`}>
            <MarketplaceCanvas>
              <MarketplaceCanvasTiles>
                <MarketplaceCanvasTileScaler>
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
              <MarketplaceCanvasTileExpiry>
                <svg>
                  <use xlinkHref="/icons/sprites.svg#clock" />
                </svg>
                <div>{`${tiles.filter((tile) => tile.canvasId === canvasId)[0].deadline}`}</div>
              </MarketplaceCanvasTileExpiry>
              <MarketplaceCanvasTileContribute>Contribute</MarketplaceCanvasTileContribute>
            </MarketplaceCanvas>
          </Link>
        )
      })}
    </MarketplaceStyled>
  )
}
