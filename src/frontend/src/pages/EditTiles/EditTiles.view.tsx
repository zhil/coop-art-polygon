import { Button } from 'app/App.components/Button/Button.controller'
import { Input } from 'app/App.components/Input/Input.controller'
import { useState } from 'react'

import { Token } from './EditTiles.controller'
// prettier-ignore
import { EditTilesCanvas, EditTilesCanvasBottom, EditTilesCanvasLeft, EditTilesCanvasMiddle, EditTilesCanvasRight, EditTilesCanvasTop, EditTilesMenu, EditTilesStyled, EditTilesTile } from "./EditTiles.style";

type EditTilesViewProps = {
  existingTiles: Token[]
}

export type Tile = {
  name?: string
  description?: string
  x: number
  y: number
  img?: string
  owner: string
  id: number
}

export const EditTilesView = ({ existingTiles }: EditTilesViewProps) => {
  const [showGrid, setShowGrid] = useState(true)
  const [tiles, setTiles] = useState<Tile[]>([])
  const [tileWidth, setTileWidth] = useState(340)
  const [tileHeight, setTileHeight] = useState(340)
  const [period, setPeriod] = useState(3)

  const [canvasSize, setCanvasSize] = useState<{ xMin: number; xMax: number; yMin: number; yMax: number }>({
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  })

  const canvasWidth = canvasSize.xMax - canvasSize.xMin + 1
  const canvasHeight = canvasSize.yMax - canvasSize.yMin + 1

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
              <EditTilesCanvasMiddle tileWidth={tileWidth} canvasWidth={canvasWidth}>
                {/* @ts-ignore */}
                {Array.apply(null, { length: canvasSize.xMax + 1 - canvasSize.xMin })
                  .map(function (_, idx) {
                    return idx + canvasSize.xMin
                  })
                  .map((x) => (
                    <EditTilesTile width={tileWidth} height={tileHeight} showGrid={showGrid}>
                      {`${x}, ${y}`}
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
