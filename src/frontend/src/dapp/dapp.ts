import constate from 'constate'
import { ethers } from 'ethers'
import React from 'react'
import { useAlert } from 'react-alert'
import Web3Modal from 'web3modal'

import Token from '../artifacts/contracts/NFT.sol/MyNFT.json'

export const [DAppProvider, useProvider, useAccountPkh, useConnect] = constate(
  useDApp,
  (v) => v.provider,
  (v) => v.accountPkh,
  (v) => v.connect,
)

function useDApp({ appName }: { appName: string }) {
  const [{ provider, accountPkh }, setState] = React.useState(() => ({
    provider: undefined,
    accountPkh: undefined,
  }))

  const alert = useAlert()

  const providerOptions = {}

  const web3Modal = new Web3Modal({
    providerOptions,
  })

  async function updateAccount(provider: any) {
    const signer = provider.getSigner()
    const accountPkh = await signer.getAddress()

    setState({
      provider,
      accountPkh,
    })
    // const ln = account.length
    // setAccountPkhPreview(`${account.slice(0, 7)}...${account.slice(ln - 4, ln)}`)
  }

  const connect = React.useCallback(async () => {
    try {
      const web3Provider = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(web3Provider)
      await updateAccount(provider)

      web3Provider.on('accountsChanged', async (accounts: string[]) => {
        console.log('Accounts Changed', accounts)
        // onConnected(provider)
        await updateAccount(provider)
      })
      // Subscribe to provider connection
      web3Provider.on('connect', (info: { chainId: number }) => {
        console.log('on connected', info)
      })

      // Subscribe to provider disconnection
      web3Provider.on('disconnect', (error: { code: number; message: string }) => {
        console.log(error)
      })

      // onConnected(provider)
    } catch (err) {
      alert.show(err.message)
      console.error(`Failed to connect TempleWallet: ${err.message}`)
    }
  }, [alert, setState])

  return {
    provider,
    accountPkh,
    connect,
  }
}

export function useOnBlock(tezos: any, callback: any) {
  const blockHashRef = React.useRef()

  React.useEffect(() => {
    if (tezos) {
      // let sub
      // spawnSub()
      // return () => sub.close()
      // function spawnSub() {
      //   sub = tezos.stream.subscribe('head')
      //   sub.on('data', (hash) => {
      //     if (blockHashRef.current && blockHashRef.current !== hash) {
      //       callback(hash)
      //     }
      //     blockHashRef.current = hash
      //   })
      //   sub.on('error', (err) => {
      //     if (process.env.NODE_ENV === 'development') {
      //       console.error(err)
      //     }
      //     sub.close()
      //     spawnSub()
      //   })
      // }
    }
  }, [tezos, callback])
}
