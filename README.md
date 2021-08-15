## About Coopart

**Coopart** [ koh-op-ahrt ] is the first-ever cooperative tile-based NFT art marketplace. 
1. Create a canvas and add the first tile.
2. Other artists expand the canvas in any direction and add new tiles.
3. People can vote tiles in or out. Each canvas is its own DAO and self-governs. Some tiles are voted out and some tiles are voted in to replace them.
4. Canvas is sold and profits distributed to all its contributors.

## Inspiration

I first got the idea to create Coopart from looking at the [$69 million Beeple's NFT](https://www.theverge.com/2021/3/11/22325054/beeple-christies-nft-sale-cost-everydays-69-million). The piece of art is made from 5,000 tiles merged together into a common canvas. I thought it would be great if each tile was made by a different author, and so Coopart was born. Many artists can contribute tiles to a common canvas that is then sold as a single piece, and profits are shared between all of them.

## Try it out

### Getting started

The platform is live at [coop.art](https://coop.art) and running on the _Matic Mumbai Testnet_. I coded the smart contract in Solidity and integrated the frontend with IPFS for token metadata upload and storage. Before trying out the platform, make sure you have a funded account on the _Mumbai Testnet_. You can use the Matic faucet at [faucet.matic.network](https://faucet.matic.network/). 

Now, on Coopart, click _Connect wallet_ and Metamask will open to ask you for authorization. Your Eth address should then appear in the top right corner.

### Create a new canvas

You are now ready to create a new canvas or contribute to the existing canvases. If you click _Create New Canvas_, you can see the tile editor with an empty tile and a few options. First, choose a tile size. Note that all tiles in a canvas will have the same size, even for other contributors. You can also select the time period for other artists to contribute to the canvas. After that, the canvas will automatically lock and be put on sale, meaning that no more contribution will be possible.

Hover your mouse over any tile to see its coordinates and an upload button. You can click the arrows to expand the canvas on the right side, left side, top side or bottom side. There is no limit to the canvas size, this could technically scale to millions of tiles. Click _Upload_ and choose an image file. Wait while the tile is uploading. I am using **IPFS** with _Infura_ to store the NFT images and metadata, so it is fully decentralized and tile owners can be reassured that their art is stored safely forever.

Once the image is uploaded, it appears in the tile you chose. Then a Polygon transaction to mint the tile is automatically started. I am using the **ERC 721 Token Standard** in the smart contract to store the tiles as NFTs and comply with transfer and storage conventions. This makes Coopart compatible with all wallets, exchanges, DeFi dapps, etc. on Polygon.

Click confirm to start the minting transaction. A notification in the top right corner tells you that the transaction has been sent. Wait a few seconds, and another notification will tell you that the tile has been minted. You can check out [PolygonScan](https://mumbai.polygonscan.com/address/0xC5745209053E2b11122451bDaf8AeE2B4fF586d3) to confirm that the transaction is indeed successful. This canvas is now officially started. You can add more tiles yourself or wait for others to contribute. 

### Contribute to existing canvas

Head over to the marketplace to see all ongoing canvases that still have time left in their contribution period and canvases that have expired and have automatically been put on sale. You should see the canvas you just created with one tile. Click any ongoing canvases and the tile editor will open and fetch the tiles from the smart contract. Expand the canvas in any direction and contribute one or more tiles. When you are done refresh the marketplace to see the updated canvas.

### Vote on tiles

Now, what if someone ruins a canvas with an inappropriate tile? That's where voting comes into play. In phase II of the development of Coopart (see dev roadmap below), contributors will be able to vote on each tile. If they believe a tile should not be in a canvas, they can vote to remove it. On the contrary, if they believe a tile is a perfect match for the canvas, they can vote to keep it. **Each canvas will be its own DAO and self-govern.** There are two ways to implement this, and I have not yet decided which way to go:

- First possibility: Only tile contributors can vote on other tiles. Each tile contributor can cast one vote per tile (upvote or downvote). If a tile has more downvotes than upvotes, it gets removed.

- Second possibility: Anyone can vote. This gives potential buyers a way to direct the development of a canvas that they might want to buy. People vote by delegating MATIC to a tile. The more MATIC, the more the vote count. If a tile has more MATIC for downvotes than upvotes, it gets removed. On the contrary, people liking a canvas can delegate a lot of MATIC to the tiles they like. The delegation also proves that the potential buyers have enough MATIC to buy the canvas later.

Let me know your opinion about this. I'm also open to other suggestions.

### Buy/Sell canvas

Once the contribution period of a canvas expires, no one can contribute to it anymore, and it is automatically put on sale in the marketplace. For now, I've only implemented a simple fixed price sale at 1 MATIC as a proof of concept. I will develop a more robust auction sale system in phase II (more in the roadmap). You can click _Buy Canvas_ and submit the transaction. After a few seconds, all the tiles from the canvas will appear in your wallet. At first I wanted to merge all the tiles into a single ERC721 token for the whole canvas, but then I thought that keeping tiles separated might allow owners to sell them separately and create a sense of collection. Buyers would then try to buy all tiles to complete their collection and reconstitute the whole canvas. This would increase the value of a single tile to a collector that already has all of them except that one. Just like the _Infinity Stones_ in _The Avengers_, you just need to have them all! 

I am not yet fully decided on the way to go. This is still a concept that I am still playing around with. 

Anyway, when a canvas is purchased, all the tile creators (except those that were voted out) are paid according to the number of tiles they contributed. E.g., if a canvas has 10 tiles and is sold for 1 MATIC, each tile creator will receive 0.1 MATIC. If someone contributed 2 tiles to that canvas, he would receive 0.2 MATIC.

## Dev roadmap
It's been a wild journey since I started working on this project only three weeks ago! It is such a complex platform that I could not develop everything by the end of this hackathon, so I have divided its development into 3 phases. The first phase is the current proof of concept that you see. It has a functional tile creator and editor with a smart contract that can mint tiles into ERC721 tokens. Anyone can contribute new tiles. Canvases can then be sold for 1 MATIC in the marketplace.

Phase II will include the canvas DAO and voting system discussed previously. It will also have auction sales for canvases. Finally, I also plan to add a second form of cooperative art development: **layer-based**, in addition to tile-based. See the example below. An image could be a first layer from an artist. Then another artist could add a mostly transparent layer but with a triangle in the middle. Then someone could add a layer with a grid, a layer with rocks, a layer with a person, and so on. Layers could also be voted in or out of a canvas.

Phase II should be finished on August 30th as I plan to submit it to the upcoming [NFT Vision Hackathon](https://nftvisionhack.com/)

Finally, phase III will be mostly bug fixing and many tests before deploying the smart contract on the Polygon mainnet in September.

![](https://coop.art/images/roadmap.png)

![](https://coop.art/images/miami.png)


## How It's Made
- The frontend is made with React. The tile creator/editor is a 100% custom component that took me many days to code.
  
- The smart contracts are made in Solidity using modified ERC 721 contracts from Open Zeppelin.

- I built and deployed a custom subgraph at https://thegraph.com/studio/subgraph/coopart/ to query data from the frontend.

- I deployed the smart contract on the Polygon Mumbai Tesnet.

- I am using IPFS to store the tile images and token metadata. I first used [nft.storage](https://nft.storage/) but for some reason, uploading was very slow so I instead coded my own NFT metadata uploader using [ipfs-http-client](https://www.npmjs.com/package/ipfs-http-client) with the [infura](https://infura.io/docs/ipfs) gateway, leading to much faster uploads.

## Conclusion

Coopart is a revolutionary way of building NFT art cooperatively. Both tile-based canvas and layer-based canvas will lead to exceptional artistic pieces from thousands of artists working together and maybe worth millions.



----------------------------

## Video script

**Coopart** [ koh-op-ahrt ] is the first-ever cooperative tile-based NFT art marketplace. 
1- Create a canvas and add the first tile.
2- Other artists expand the canvas in any direction and add new tiles.
3- People can vote tiles in or out. Each canvas is its own DAO and self-governs. Some tiles are voted out and some tiles are voted in to replace them.
4- Canvas is sold and profits distributed to all its contributors.

Hi, I'm Aymeric, I first got the idea for Coopart from looking at the 69 million Beeple's NFT. The piece of art is made from 5,000 tiles merged together into a common canvas. I thought it would be great if each tile was made by a different author, and so Coopart was born. 

Let's try it out. Go to coop.art and and connect your Metamask wallet. Make sure your wallet is connected to the _Matic Mumbai Testnet_ as I've deployed the smart contract on the Polygon Testnet.

Once you are connected, your eth address should then appear in the top right corner.

You are now ready to create a new canvas or contribute to the existing canvases. 

Let's start by clicking _Create New Canvas_. You can see an empty tile and a few options. First, choose a tile size. Note that all tiles in a canvas will have the same size, even for other contributors. Let's choose 130 pixels by 340 pixels. You can also select the time period for other artists to contribute to the canvas. Let's choose a deadline 3 days from now. After that, the canvas will automatically lock and be put on sale, meaning that no more contribution will be possible.

Now hover your mouse over the tile to see its coordinates and an upload button. You can click the arrows to expand the canvas on the right side, left side, top side or bottom side. There is no limit to the canvas size, this could technically scale to millions of tiles. Let's upload a first tile.
I am using **IPFS** with _Infura_ to store the NFT images and token metadata, so it is fully decentralized and tile owners can be reassured that their art is stored safely forever.

Once the image is uploaded, it appears in the tile you chose. Then a transaction to mint the tile is automatically started. A notification in the top right corner tells you that the transaction has been sent. Wait a few seconds, and another notification will tell you that the tile has been minted. You can check out PolygonScan to confirm that the transaction is indeed successful. This canvas is now officially started. You can add more tiles yourself or wait for others to contribute. 

Let's now go to the marketplace. Here you can see on-going canvases that still have time left in their contribution period and canvases that have expired and have automatically been put on sale. You can see the canvas we just created with one tile. Let's say I'm another artist that want to contribute to this canvas. I can click "Contribute" and the tile editor will open and fetch the tiles from the smart contract. Let me now add two new tiles to this canvas.

[...]

I am now done contributing. If I reload the marketplace, I can see that the canvas does display the new tiles.

Let's contribute to another canvas. Here I can see tiles about typical rage comics. However there is a tile that does not seem to fit the theme of the canvas. In that case, I can vote on tiles to be removed. Each canvas is its own DAO and self-governs. You can click upvote or downvote on each tile, and those with more downvotes than upvotes will be removed automatically. For the sake of tranparency, these buttons do yet do anything. Coopart is such a big project that I have not been able to implement the DAO system just yet.

Now, once the contribution period of a canvas expires, no one can contribute to it anymore, and it is automatically put on sale in the marketplace. For now, I've only implemented a simple fixed price sale at 1 MATIC as a proof of concept. When a canvas is purchased, all the tile creators (except those that were voted out) are paid according to the number of tiles they contributed. For instance, if a canvas has 10 tiles and is sold for 1 MATIC, each tile creator will receive 0.1 MATIC. If someone contributed 2 tiles to that canvas, he would receive 0.2 MATIC.

Coopart is a revolutionary way of building NFT art cooperatively. Both tile-based canvas and layer-based canvas will lead to exceptional artistic pieces from thousands of artists working together and maybe worth millions. Thanks for wtching.
