import styled, { css, keyframes } from 'styled-components/macro'
import { backgroundColor, borderColor, textColor } from 'styles'

export const EditTilesStyled = styled.div``

export const EditTilesMenu = styled.div`
  margin: 60px 0 20px 0;
  display: grid;
  grid-template-columns: 200px 200px 200px;
  grid-gap: 20px;
`

export const SimpleButton = styled.div`
  cursor: pointer;
  background: ${textColor};
  border-radius: 5px;
  padding: 10px;
  color: ${backgroundColor};
  text-align: center;
  font-weight: bold;
  height: 36px;
`

export const EditTilesCanvasGrid = styled.div<{ width: number }>`
  margin-top: 40px;
  display: grid;
  grid-template-columns: 50px ${({ width }) => width}px 50px;
`

export const EditTilesCanvasTop = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  height: 50px;
  border: 1px solid ${borderColor};
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  border-radius: 10px 10px 0 0;

  > img {
    margin: 14px auto;
  }
`

export const EditTilesCanvasBottom = styled.div<{ width: number }>`
  width: ${({ width }) => width}px;
  height: 50px;
  border: 1px solid ${borderColor};
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  border-radius: 0 0 10px 10px;

  > img {
    margin: 14px auto;
    transform: rotate(180deg);
  }
`

export const EditTilesCanvasLeft = styled.div<{ height: number }>`
  margin-top: 50px;
  width: 50px;
  height: ${({ height }) => height}px;
  border: 1px solid ${borderColor};
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 10px 0 0 10px;

  > img {
    margin: auto 14px;
    transform: rotate(270deg);
  }
`

export const EditTilesCanvasRight = styled.div<{ height: number }>`
  margin-top: 50px;
  width: 50px;
  height: ${({ height }) => height}px;
  border: 1px solid ${borderColor};
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 0 10px 10px 0;

  > img {
    margin: auto 14px;
    transform: rotate(90deg);
  }
`

export const EditTilesCanvasMiddle = styled.div<{ width: number; canvasWidth: number }>`
  display: grid;
  grid-template-columns: repeat(${({ canvasWidth }) => canvasWidth}, ${({ width }) => width}px);
`

export const EditTilesTile = styled.div<{ width: number; height: number; showGrid: boolean }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  box-sizing: border-box;
  position: relative;
  font-weight: bold;

  ${({ showGrid }) =>
    showGrid &&
    css`
      outline: 1px solid ${borderColor};
    `}

  > div {
    position: absolute;
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
    background-color: #000000a0;
    opacity: 0;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;

    p {
      margin: 0;
    }

    &:hover {
      opacity: 1;
    }
  }

  > img {
    width: ${({ width }) => width}px;
    height: ${({ height }) => height}px;
  }
`

export const UploaderFileSelector = styled.div`
  margin: 15px 0;
  cursor: pointer;

  > input {
    width: 86px;
  }
`

export const UploaderLabel = styled.label`
  border: 1px dashed ${textColor};
  box-sizing: border-box;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  color: ${textColor};
  font-weight: bold;
  padding: 10px;

  > svg {
    width: 24px;
    height: 24px;
    stroke: ${textColor};
    margin-right: 10px;
    margin-bottom: -8px;
  }
`

const turn = keyframes`
  100% {
      transform: rotate(-360deg);
  }
`

export const EditTilesLoading = styled.div`
  > div {
    display: inline-block;
  }

  > svg {
    animation: ${turn} 1.6s linear infinite forwards;
    display: inline-block;
    width: 24px;
    height: 24px;
    stroke: ${textColor};
    margin-right: 10px;
    margin-bottom: -8px;
  }
`

export const TileVoting = styled.div`
  margin: 10px 0;
`

export const TileVotingButtons = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 10px;
  margin: 10px 0;
  cursor: pointer;
`

export const EditTilesCanvasStyled = styled.div`
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #000;
  background: linear-gradient(115deg, transparent 75%, rgba(30, 30, 30, 0.8) 75%) 0 0,
    linear-gradient(245deg, transparent 75%, rgba(30, 30, 30, 0.8) 75%) 0 0,
    linear-gradient(115deg, transparent 75%, rgba(30, 30, 30, 0.8) 75%) 7px -15px,
    linear-gradient(245deg, transparent 75%, rgba(30, 30, 30, 0.8) 75%) 7px -15px, #000;
  background-size: 15px 30px;
`
