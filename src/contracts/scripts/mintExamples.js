const hre = require("hardhat");

const contractAddress = `0xC5745209053E2b11122451bDaf8AeE2B4fF586d3`

const tokens = [
//horse
// 'ipfs://QmWsM6Xa6DCfS2MvvMNdAwPMuY8iBmJ66NTHoyLVdGC4RR',
// 'ipfs://QmVZZHjGUKZLXbr6FrVXoqPpju9P1RR4rnZEtrv8ZGpagL',
// 'ipfs://QmavnC9Q3TLUYGxXgr2yBiBL88pzGyRcr9QixJiAR4kdJ2',
//rage
{ uri: 'ipfs://QmYqWC1DaxFnRFDmBnvjUXRH69pyknS9N1j8Krd6ZxkgEQ', canvasId:'3jwho'},
{ uri: 'ipfs://QmbE4i2efrK8dEJ5tY9CRS2L6irpjJE68b3rme9p6yPZcg', canvasId:'3jwho'},
{ uri: 'ipfs://QmWYujjetgxNrqKJV3ezt7TGCiBz8UkTvFn7YEJs9Eotjr', canvasId:'3jwho'},
{ uri: 'ipfs://QmWECYF6qa8nWoDYrZ8nv2AbWKPiMUzRX3A4gPzPSg67Qt', canvasId:'3jwho'},
{ uri: 'ipfs://QmUmZ238hS527phJGh14VTi9mE6kJMXHk7uJHn8fNYe7zs', canvasId:'3jwho'},
{ uri: 'ipfs://QmPynaeabVtRsEYKyirgQajg5tNnLDjFPf1qJzVtiDrctN', canvasId:'3jwho'},
{ uri: 'ipfs://QmWj1HDMgeTBxqJe1gYcyQJDgxisopLyqYK7KSb4Wuyp9b', canvasId:'3jwho'},
// 'ipfs://QmTc2cGt1fCQktqrtKJwLGZtqgCFFAJu4x5TLy7L7A6qFV',
//comic
{ uri: 'ipfs://Qmf6VuVFVR9ZErWBDVYRAhXSsNBT2Nh46mcxKh3eHNqM8D', canvasId:'jiqnu'},
{ uri: 'ipfs://QmevWvzDBKJqr8E812y4JHiygYXZSu1rQKZ7zkWyFzQXGN', canvasId:'jiqnu'},
{ uri: 'ipfs://QmYroeNndoo1N48s55Yq19HD6tECncCDtMWhnTEB3Xq9Vf', canvasId:'jiqnu'},
{ uri: 'ipfs://QmdQNBdG7vMpkp47Ewi86ZCBxrobL6vxEP8zy6JWshfLLg', canvasId:'jiqnu'},
{ uri: 'ipfs://QmQF2iBHSx4enxUEJRiAaHxJCVQn46SgB5qzfcSRTWg5ih', canvasId:'jiqnu'},
{ uri: 'ipfs://Qme7sSnfJmLVfS4AymPXT8zCBLWAiRf9x1SHVRf3jcdRHB', canvasId:'jiqnu'}
]

//takes array of thunks
//thunks are functions that return promises
function mapSeries(arr) {
  if (!Array.isArray(arr)) throw new Error('mapSeries requires an Array');
  const length = arr.length;
  const results = new Array(length);
  
  return arr.reduce((chain, item, i) => {
    return chain.then(item).then(val => results[i] = val);
  }, Promise.resolve())
  .then(() => results)
}

function thunkify(token) {
  return async () => {
    const [owner] = await hre.ethers.getSigners();
    const NFTContract = await hre.ethers.getContractAt("CoopartNFT", contractAddress);
    const tx = await NFTContract.mint(owner.address, token.uri, token.canvasId);
    const receipt = await tx.wait();
    console.log('Transaction mined: ', token.uri);
  }
}

async function main() {
  const thunks = tokens.map((token) => thunkify(token))
  await mapSeries(thunks); //do the transactions serially to avoid `replacement fee too low` error
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


