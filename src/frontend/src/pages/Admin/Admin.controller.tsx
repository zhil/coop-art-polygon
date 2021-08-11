// prettier-ignore
import { useAccountPkh, useOnBlock, useReady, useTezos, useWallet } from "dapp/dapp";
import { ADMIN, COOPART_ADDRESS } from 'dapp/defaults'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Message, Page } from 'styles'

import { AdminView } from './Admin.view'

type AdminProp = {
  setMintTransactionPendingCallback: (b: boolean) => void
  mintTransactionPending: boolean
}

export const Admin = ({ setMintTransactionPendingCallback, mintTransactionPending }: AdminProp) => {
  const wallet = useWallet()
  const ready = useReady()
  const tezos = useTezos()
  const accountPkh = useAccountPkh()
  const [contract, setContract] = useState(undefined)
  const [adminAdress, setAdminAdress] = useState(undefined)

  const loadStorage = React.useCallback(async () => {
    if (contract) {
      const storage = await (contract as any).storage()
      setAdminAdress(storage.market.admin)
    }
  }, [contract])

  useEffect(() => {
    loadStorage()
  }, [loadStorage])

  useEffect(() => {
    ;(async () => {
      if (tezos) {
        const ctr = await (tezos as any).wallet.at(COOPART_ADDRESS)
        setContract(ctr)
      }
    })()
  }, [tezos, mintTransactionPending])

  useOnBlock(tezos, loadStorage)

  const mint = React.useCallback(async () => {
    const ctr = await (tezos as any).wallet.at(COOPART_ADDRESS)
    // prettier-ignore
    const batch = await (tezos as any).wallet
      .batch()
      .withContractCall((ctr as any).methods.mint('horse', '2021-08-10t00:00:00Z', 'https://coopart.io/examples/horse1.png', ADMIN, ADMIN, 340, Math.floor(Math.random() * 1000000), 130, 0, 0))
      .withContractCall((ctr as any).methods.mint('horse', '2021-08-10t00:00:00Z', 'https://coopart.io/examples/horse2.png', ADMIN, ADMIN, 340, Math.floor(Math.random() * 1000000), 130, 1, 0))
      .withContractCall((ctr as any).methods.mint('horse', '2021-08-10t00:00:00Z', 'https://coopart.io/examples/horse4.png', ADMIN, ADMIN, 340, Math.floor(Math.random() * 1000000), 130, 2, 0))
      
      .withContractCall((ctr as any).methods.mint('rage', '2021-08-25t10:10:10Z', 'https://coopart.io/examples/rage1.png', ADMIN, ADMIN, 100, Math.floor(Math.random() * 1000000), 100, 0, 0))
      .withContractCall((ctr as any).methods.mint('rage', '2021-08-25t10:10:10Z', 'https://coopart.io/examples/rage2.png', ADMIN, ADMIN, 100, Math.floor(Math.random() * 1000000), 100, -1, 0))
      .withContractCall((ctr as any).methods.mint('rage', '2021-08-25t10:10:10Z', 'https://coopart.io/examples/rage3.png', ADMIN, ADMIN, 100, Math.floor(Math.random() * 1000000), 100, 2, 1))
      .withContractCall((ctr as any).methods.mint('rage', '2021-08-25t10:10:10Z', 'https://coopart.io/examples/rage4.png', ADMIN, ADMIN, 100, Math.floor(Math.random() * 1000000), 100, 3, 0))
      .withContractCall((ctr as any).methods.mint('rage', '2021-08-25t10:10:10Z', 'https://coopart.io/examples/rage5.png', ADMIN, ADMIN, 100, Math.floor(Math.random() * 1000000), 100, -2, 5))
      .withContractCall((ctr as any).methods.mint('rage', '2021-08-25t10:10:10Z', 'https://coopart.io/examples/rage6.png', ADMIN, ADMIN, 100, Math.floor(Math.random() * 1000000), 100, -3, -2))
      .withContractCall((ctr as any).methods.mint('rage', '2021-08-25t10:10:10Z', 'https://coopart.io/examples/rage7.png', ADMIN, ADMIN, 100, Math.floor(Math.random() * 1000000), 100, 0, -1))
      .withContractCall((ctr as any).methods.mint('rage', '2021-08-25t10:10:10Z', 'https://coopart.io/examples/rage8.png', ADMIN, ADMIN, 100, Math.floor(Math.random() * 1000000), 100, 1, -3))
      
      .withContractCall((ctr as any).methods.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic1.png', ADMIN, ADMIN, 270, Math.floor(Math.random() * 1000000), 192, 0, 0))
      .withContractCall((ctr as any).methods.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic2.png', ADMIN, ADMIN, 270, Math.floor(Math.random() * 1000000), 192, 0, 1))
      .withContractCall((ctr as any).methods.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic3.png', ADMIN, ADMIN, 270, Math.floor(Math.random() * 1000000), 192, 1, 0))
      .withContractCall((ctr as any).methods.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic4.png', ADMIN, ADMIN, 270, Math.floor(Math.random() * 1000000), 192, 1, 1))
      .withContractCall((ctr as any).methods.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic5.png', ADMIN, ADMIN, 270, Math.floor(Math.random() * 1000000), 192, 2, 1))
      .withContractCall((ctr as any).methods.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic6.png', ADMIN, ADMIN, 270, Math.floor(Math.random() * 1000000), 192, 2, 0))

    const batchOp = await batch.send()
    console.log(batchOp)
  }, [contract])

  return (
    <Page>
      {wallet ? (
        <>
          {ready ? (
            <>
              {accountPkh === adminAdress ? (
                <AdminView
                  mintCallBack={mint}
                  connectedUser={(accountPkh as unknown) as string}
                  setMintTransactionPendingCallback={setMintTransactionPendingCallback}
                  mintTransactionPending={mintTransactionPending}
                />
              ) : (
                <Message>You are not the admin of this smart contract</Message>
              )}
            </>
          ) : (
            <Message>Please connect your wallet</Message>
          )}
        </>
      ) : (
        <Message>Please install the Temple Wallet Chrome Extension.</Message>
      )}
    </Page>
  )
}
