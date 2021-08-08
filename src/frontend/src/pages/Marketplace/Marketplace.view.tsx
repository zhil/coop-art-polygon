// prettier-ignore
import { Tile } from "pages/EditTiles/EditTiles.view";
import { Link } from 'react-router-dom'
import { MarketplaceCanvas, MarketplaceStyled } from './Marketplace.style'

type MarketplaceViewProps = {
  tiles: Tile[]
}

export const MarketplaceView = ({ tiles }: MarketplaceViewProps) => {
  const canvasIds = [...new Set(tiles.map((tile) => tile.canvasId))]
  console.log(canvasIds)

  return (
    <MarketplaceStyled>
      {canvasIds.map((canvasId) => (
        <Link to={`/edit-tiles/${canvasId}`}>
          <MarketplaceCanvas>{canvasId}</MarketplaceCanvas>
        </Link>
      ))}
    </MarketplaceStyled>
  )
}
