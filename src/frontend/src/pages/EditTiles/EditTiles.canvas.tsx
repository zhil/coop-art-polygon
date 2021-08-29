import { useState } from 'react'
import { Layer, Stage } from 'react-konva'

import { EditTilesImage } from './EditTiles.image'
// prettier-ignore
import { EditTilesCanvasStyled, TileVoting } from "./EditTiles.style";
import { Tile } from './EditTiles.view'

type EditTilesCanvasProps = {
  existingTiles: Tile[]
  newTile: Tile | undefined
  updateTileCallback: (tile: Tile) => void
}

export const EditTilesCanvas = ({ existingTiles, newTile, updateTileCallback }: EditTilesCanvasProps) => {
  const [imageAttrs, setImageAttrs] = useState({
    x: newTile && newTile.x ? newTile.x : 0,
    y: newTile && newTile.y ? newTile.y : 0,
    width: newTile && newTile.width ? newTile.width : 100,
    height: newTile && newTile.height ? newTile.height : 100,
    r: newTile && newTile.r ? newTile.r : 0,
  })

  console.log('existingTiles', existingTiles)

  return (
    <EditTilesCanvasStyled>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {existingTiles.map((tile) => (
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
          {newTile && (
            <EditTilesImage
              url={newTile.image.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')}
              imgProps={imageAttrs}
              isSelected={true}
              onChange={(newAttrs: any) => {
                setImageAttrs(newAttrs)
                updateTileCallback({
                  ...newTile,
                  x: newAttrs.x,
                  y: newAttrs.y,
                  r: newAttrs.r,
                  width: newAttrs.width,
                  height: newAttrs.height,
                })
              }}
            />
          )}
        </Layer>
      </Stage>
    </EditTilesCanvasStyled>
  )
}
