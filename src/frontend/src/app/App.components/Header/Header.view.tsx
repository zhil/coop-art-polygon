import { Link } from 'react-router-dom'

// prettier-ignore
import { HeaderButton, HeaderLogo, HeaderStyled } from "./Header.style";

type HeaderViewProps = {
  accountPkhPreview?: string
  handleConnect: () => void
}

export const HeaderView = ({ accountPkhPreview, handleConnect }: HeaderViewProps) => {
  return (
    <HeaderStyled>
      <Link to="/">
        <HeaderLogo alt="logo" src="/logo.svg" />
      </Link>

      <div />

      <Link to="/marketplace">Marketplace</Link>

      <Link to="/create">New canvas</Link>

      {
        <div>
          {accountPkhPreview ? (
            <HeaderButton onClick={handleConnect}>{accountPkhPreview}</HeaderButton>
          ) : (
            <HeaderButton onClick={handleConnect}>Connect wallet</HeaderButton>
          )}
        </div>
      }
    </HeaderStyled>
  )
}
