import * as React from 'react'
import { Link } from 'react-router-dom'

//prettier-ignore
import { HomeStyled, HomeTitle } from './Home.style'

export const HomeView = () => {
  return (
    <HomeStyled>
      <HomeTitle>The cooperative art market</HomeTitle>
    </HomeStyled>
  )
}
