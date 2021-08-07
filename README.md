# COOPART

In progress...

Demo on [coopart.io](https://coopart.io) 

To redeploy the smart contracts :
```
$ cd src/contracts
$ npm install -g truffle@tezos
$ truffle compile
$ truffle migrate --network florencenet
// copy contract address e.g. KT1SS5CMP6wfqt63jtwzisb22QgpRq13b77W
```

To start the frontend locally :
```
// paste contract address to COOPART_ADDRESS in dapp/defaults.ts (or use the version already deployed)
$ cd ../frontend
$ npm install
$ npm start
```