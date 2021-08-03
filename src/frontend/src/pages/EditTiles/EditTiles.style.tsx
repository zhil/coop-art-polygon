import styled, { css } from 'styled-components/macro'
import { backgroundTextColor, borderColor, subTextColor } from 'styles'

export const EditTilesStyled = styled.div``

export const EditTilesMenu = styled.div`
  margin-top: 60px;
  display: grid;
  grid-template-columns: 140px 200px 100px 90px 10px 90px 130px 90px 60px;
  grid-gap: 20px;

  > div {
    line-height: 36px;
    color: ${subTextColor};
  }

  > div:nth-child(3),
  div:nth-child(7) {
    text-align: right;
  }
`

export const EditTilesCanvas = styled.div<{ width: number }>`
  margin-top: 40px;
  display: grid;
  grid-template-columns: 50px ${({ width }) => width}px 50px;
`

export const EditTilesCanvasTop = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  height: 50px;
  background-color: ${backgroundTextColor};
  border: 1px solid ${borderColor};
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;

  > img {
    margin: 14px auto;
  }
`

export const EditTilesCanvasBottom = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  height: 50px;
  background-color: ${backgroundTextColor};
  border: 1px solid ${borderColor};
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;

  > img {
    margin: 14px auto;
    transform: rotate(180deg);
  }
`

export const EditTilesCanvasLeft = styled.div<{ height: number }>`
  margin-top: 50px;
  width: 50px;
  height: ${({ height }) => height}px;
  background-color: ${backgroundTextColor};
  border: 1px solid ${borderColor};
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;

  > img {
    margin: auto 14px;
    transform: rotate(270deg);
  }
`

export const EditTilesCanvasRight = styled.div<{ height: number }>`
  margin-top: 50px;
  width: 50px;
  height: ${({ height }) => height}px;
  background-color: ${backgroundTextColor};
  border: 1px solid ${borderColor};
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;

  > img {
    margin: auto 14px;
    transform: rotate(90deg);
  }
`

export const EditTilesCanvasMiddle = styled.div<{ tileWidth: number; canvasWidth: number }>`
  display: grid;
  grid-template-columns: repeat(${({ canvasWidth }) => canvasWidth}, ${({ tileWidth }) => tileWidth}px);
`

export const EditTilesTile = styled.div<{ width: number; height: number; showGrid: boolean }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  box-sizing: border-box;

  ${({ showGrid }) =>
    showGrid &&
    css`
      border: 1px solid ${borderColor};
    `}
`
