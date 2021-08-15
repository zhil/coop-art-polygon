const hre = require("hardhat");

const contractAddress = `0xaa71521B33f97CF7466519025BC6d60F55B9dD44`

const tokenUris = [
//horse
// 'ipfs://QmWsM6Xa6DCfS2MvvMNdAwPMuY8iBmJ66NTHoyLVdGC4RR',
// 'ipfs://QmVZZHjGUKZLXbr6FrVXoqPpju9P1RR4rnZEtrv8ZGpagL',
// 'ipfs://QmavnC9Q3TLUYGxXgr2yBiBL88pzGyRcr9QixJiAR4kdJ2',
//rage
'ipfs://QmYqWC1DaxFnRFDmBnvjUXRH69pyknS9N1j8Krd6ZxkgEQ',
'ipfs://QmbE4i2efrK8dEJ5tY9CRS2L6irpjJE68b3rme9p6yPZcg',
'ipfs://QmWYujjetgxNrqKJV3ezt7TGCiBz8UkTvFn7YEJs9Eotjr',
'ipfs://QmWECYF6qa8nWoDYrZ8nv2AbWKPiMUzRX3A4gPzPSg67Qt',
'ipfs://QmUmZ238hS527phJGh14VTi9mE6kJMXHk7uJHn8fNYe7zs',
'ipfs://QmPynaeabVtRsEYKyirgQajg5tNnLDjFPf1qJzVtiDrctN',
'ipfs://QmWj1HDMgeTBxqJe1gYcyQJDgxisopLyqYK7KSb4Wuyp9b',
// 'ipfs://QmTc2cGt1fCQktqrtKJwLGZtqgCFFAJu4x5TLy7L7A6qFV',
//comic
'ipfs://Qmf6VuVFVR9ZErWBDVYRAhXSsNBT2Nh46mcxKh3eHNqM8D',
'ipfs://Qmf6VuVFVR9ZErWBDVYRAhXSsNBT2Nh46mcxKh3eHNqM8D',
'ipfs://QmYroeNndoo1N48s55Yq19HD6tECncCDtMWhnTEB3Xq9Vf',
'ipfs://QmdQNBdG7vMpkp47Ewi86ZCBxrobL6vxEP8zy6JWshfLLg',
'ipfs://QmQF2iBHSx4enxUEJRiAaHxJCVQn46SgB5qzfcSRTWg5ih',
'ipfs://QmQF2iBHSx4enxUEJRiAaHxJCVQn46SgB5qzfcSRTWg5ih'
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

function thunkify(tokenUri) {
  return async () => {
    const [owner] = await hre.ethers.getSigners();
    const NFTContract = await hre.ethers.getContractAt("MyNFT", contractAddress);
    const tx = await NFTContract.mint(owner.address, tokenUri);
    const receipt = await tx.wait();
    console.log('Transaction mined: ', tokenUri);
  }
}

async function main() {
  const thunks = tokenUris.map((tokenUri) => thunkify(tokenUri))
  await mapSeries(thunks); //do the transactions serially to avoid `replacement fee too low` error
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });


