import { useAccountPkh, useConnect } from 'dapp/dapp'
import * as React from 'react'
import { useAlert } from 'react-alert'

import { HeaderView } from './Header.view'

export const Header = () => {
  const accountPkh = useAccountPkh()
  const connect = useConnect()

  const alert = useAlert()

  const handleConnect = React.useCallback(async () => {
    try {
      await connect()
    } catch (err) {
      alert.show(err.message)
      console.error(err.message)
    }
  }, [alert, connect])

  const accountPkhPreview = React.useMemo(() => {
    if (!accountPkh) return undefined
    else {
      const accPkh = (accountPkh as unknown) as string
      const ln = accPkh.length
      return `${accPkh.slice(0, 7)}...${accPkh.slice(ln - 4, ln)}`
    }
  }, [accountPkh])

  return <HeaderView accountPkhPreview={accountPkhPreview} handleConnect={handleConnect} />
}
