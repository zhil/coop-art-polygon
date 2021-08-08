## About Coopart

**Coopart** [ koh-op-ahrt ] is the first-ever cooperative tile-based NFT art marketplace. 
1- Create a canvas and add the first tile.
2- Then let others expand the canvas in any direction and add new tiles.
3- Everyone can vote on tiles in or out. Each canvas is its own DAO. Some tiles are voted out and other tiles are voted in to replace them.
4- Canvas is sold and profits distributed to all tile creators.

## Inspiration

I first got the inspiration to create Coopart from looking at the [$69 million Beeple's NFT](https://www.theverge.com/2021/3/11/22325054/beeple-christies-nft-sale-cost-everydays-69-million). The piece of art is made from 5,000 tiles merged together into a common canvas. I though it would be great if each tile was made by a different author, and so Coopart was born to do just that. Many artists can contribute tiles to a common canvas that is then sold as a single piece, and profits are shared between all of them.

## In details

### Getting started

The platform is live at [coopart.io](https://coopart.io) and running on the _Tezos Florence Testnet_. I'm a big fan of Tezos and have contributed to many projects. I coded the smart contract in [CameLigo](https://ligolang.org/docs/intro/introduction/) and integrated the frontend with the [Temple wallet](https://templewallet.com/). Before you try out the platform, make sure you have a funded wallet on the _Florence Testnet_. You can easily get a faucet account at [faucet.tzalpha.net](https://faucet.tzalpha.net/). Click _Get Testnet Tez_ then download the faucet file. In _Temple_, click _Import Account_ then _Faucet File_. You should see your account appear. Make sure to select the _Florence Testnet_ and that you have at least 1 Tez. If your faucet account does not have enough Tez, email me your public address at [coopart@protonmail.com](mailto:coopart@protonmail.com) and I will send you some Tez on _Florence_. On Coopart, click _Connect wallet_ and Temple will open to ask you for authorization. You Tezos address should then appear in the top right corner.

### Create a new canvas

You are now ready to create a new canvas or contibute to existing canvas. Let's start by clicking _Create New Canvas_. You can see an empty tile and a few options. First, choose a tile size. Note that all tiles in the canvas will have the same size, even for other contributors. Let's choose 130 pixels by 340 pixel. You can also choose the time period for other artists to contribute to the canvas. Let's choose 3 days. After that, the canvas will automatically lock and be put on sale, meaning that no more contribution will be possible.

Now hover the tile to see its coordinates and an upload button. You can click the arrows to expand the canvas on the right side, left side, top side or bottom side. There is no limit to the canvas size, so this can scale to millions of creators. Let's upload a first tile at coordinates (0,0) but this not mandatory, you could start at (-1, 2) if you wanted to. Click _Upload_ and choose an image file. Wait while the tile if uploading. Note that I am using **IPFS** with _Infura_ to store the images so it is fully decentralized, and tile owners can be reassured that their art is stored safely forever.

Once the image is uploaded, it appears in the tile you chose and a Tezos transaction to mint the tile is launched. I am using the **FA2 Token Standard** in the smart contract to store the tiles as NFTs and comply with transfer and storage conventions. This makes Coopart compatible with all wallets, exchanges, DeFi dapps, etc. on Tezos. FA2 is basically the Tezos equivalent of ERC721.

Click confirm to start the minting transaction. A notification in top right corner tells you that the transaction has been sent. Wait a few seconds and another notifications will tell you that the tile has been minted. You can check out [TzStats](https://florence.tzstats.com/KT1Q5ynszvFncBQBhucnXwvwPKeHPZsLW29u) to confirm that the transaction is indeed successfull. Your canvas is now started. You can add more tiles now or just wait for others to contribute. 

### Contribute to existing canvas

Let's now log with another Tezos address by clicking the address in the top right corner to simulate another user. Click _Marketplace_, 

### Vote on tiles


### Buy/Sell canvas

## Dev roadmap
DAO

## Smart contract interaction

## Run locally

The github repo for Coopart is private. You can find github credentials to access it in the uploaded file in _Additional info for judges and organizers_. Alternatively or if you are still having issues accessing the repo, please email me your github username at [coopart@protonmail.com](mailto:coopart@protonmail.com) and I will add you as contributor. 

Once you have acces to the repo, you can run the frontend locally using:
```
$ cd src/frontend
$ yarn install
$ yarn start
```

If you want to redeploy the smart contracts:
```
$ cd src/contracts
$ yarn global add truffle@5.4.0-tezos.7
$ truffle compile
$ truffle migrate --network florencenet
```

_Make sure to use truffle@5.4.0-tezos.7 as the latest version 5.5.0-tezos.4 does not work correctly._

Copy the contract address e.g. _KT1SS5CMP6wfqt63jtwzisb22QgpRq13b77W_ and paste it into COOPART_ADDRESS in `dapp/defaults.ts`. Restart the frontend to use this address.


