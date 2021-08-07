import { DAppProvider } from 'dapp/dapp'
import { APP_NAME } from 'dapp/defaults'
import { Admin } from 'pages/Admin/Admin.controller'
import { Buy } from 'pages/Buy/Buy.controller'
import { Create } from 'pages/Create/Create.controller'
import { EditTiles } from 'pages/EditTiles/EditTiles.controller'
import { Help } from 'pages/Help/Help.controller'
import { Home } from 'pages/Home/Home.controller'
import { Marketplace } from 'pages/Marketplace/Marketplace.controller'
import { Sell } from 'pages/Sell/Sell.controller'
import React from 'react'
import { useState } from 'react'
import { positions, Provider, types } from 'react-alert'
//@ts-ignore
import AlertTemplate from 'react-alert-template-basic'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import { Header } from './App.components/Header/Header.controller'
import { AppBg, AppContainer } from './App.style'

const options = {
  timeout: 5000,
  position: positions.TOP_RIGHT,
  type: types.ERROR,
}

export const App = () => {
  const [transactionPending, setTransactionPending] = useState<boolean>(false)

  return (
    <Router>
      <Provider template={AlertTemplate} {...options}>
        <DAppProvider appName={APP_NAME}>
          <React.Suspense fallback={null}>
            <AppContainer>
              <AppBg />
              <Header />
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/create">
                  <Create />
                </Route>
                <Route exact path="/edit-tiles">
                  <EditTiles
                    mintTransactionPending={transactionPending}
                    setMintTransactionPendingCallback={setTransactionPending}
                  />
                </Route>
                <Route exact path="/edit-tiles/:canvasId">
                  <EditTiles
                    mintTransactionPending={transactionPending}
                    setMintTransactionPendingCallback={setTransactionPending}
                  />
                </Route>
                <Route exact path="/admin">
                  <Admin
                    mintTransactionPending={transactionPending}
                    setMintTransactionPendingCallback={setTransactionPending}
                  />
                </Route>
                <Route exact path="/buy">
                  <Buy transactionPending={transactionPending} setTransactionPendingCallback={setTransactionPending} />
                </Route>
                <Route exact path="/sell">
                  <Sell transactionPending={transactionPending} setTransactionPendingCallback={setTransactionPending} />
                </Route>
                <Route exact path="/marketplace">
                  <Marketplace
                    transactionPending={transactionPending}
                    setTransactionPendingCallback={setTransactionPending}
                  />
                </Route>
                <Route exact path="/help">
                  <Help />
                </Route>
              </Switch>
            </AppContainer>
          </React.Suspense>
        </DAppProvider>
      </Provider>
    </Router>
  )
}
