import styled from 'styled-components/macro'

export const MarketplaceStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 290px);
  grid-gap: 20px;
`

export const MarketplaceCanvas = styled.div`
  width: 290px;
  height: 330px;
  background-color: #000;
  color: #fff;
  border-radius: 10px;
  padding: 10px;
`

export const MarketplaceCanvasTiles = styled.div`
  width: 270px;
  height: 200px;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
`

export const MarketplaceCanvasTileCount = styled.div`
  margin-top: 10px;

  > svg {
    width: 24px;
    height: 24px;
    stroke: #fff;
    display: inline-block;
  }

  > div {
    display: inline-block;
    line-height: 24px;
    margin-left: 10px;
    vertical-align: top;
  }
`

export const MarketplaceCanvasTileExpiry = styled.div`
  margin-top: 5px;

  > svg {
    width: 24px;
    height: 24px;
    stroke: #fff;
    display: inline-block;
  }

  > div {
    display: inline-block;
    line-height: 24px;
    margin-left: 10px;
    vertical-align: top;
  }
`

export const MarketplaceCanvasTileContribute = styled.div`
  width: 270px;
  height: 32px;
  background-color: #fff;
  color: #000;
  font-weight: bold;
  border-radius: 5px;
  overflow: hidden;
  text-align: center;
  line-height: 32px;
  margin-top: 10px;
`

export const MarketplaceCanvasTileScaler = styled.div`
  transform: scale(0.3) translate3d(-50%, -50%, 0px);
`

export const MarketplaceCanvasTileContainer = styled.div<{ tileWidth: number; canvasWidth: number }>`
  display: grid;
  grid-template-columns: repeat(${({ canvasWidth }) => canvasWidth}, ${({ tileWidth }) => tileWidth}px);
`

export const MarketplaceCanvasTile = styled.div<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  box-sizing: border-box;
  position: relative;

  > img {
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
  }
`
