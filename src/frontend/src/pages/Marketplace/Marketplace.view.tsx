// prettier-ignore
import { Tile } from "pages/EditTiles/EditTiles.view";
import { MarketplaceStyled } from './Marketplace.style'

type MarketplaceViewProps = {
  tiles: Tile[]
}

export const MarketplaceView = ({ tiles }: MarketplaceViewProps) => {
  return (
    <MarketplaceStyled>
      {tiles.map((tile) => (
        <div>{tile.image}</div>
      ))}
    </MarketplaceStyled>
  )
}
