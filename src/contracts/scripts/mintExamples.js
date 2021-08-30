const hre = require("hardhat");

const contractAddress = `0x3EF4090000e4d36eB130FF605a97EF0b9E2f2D04`

const tokens = [
//horse
// { uri: 'ipfs://QmQFFuK5JJmb1qdqBfQEmth4ZUkoedW1HStxxEKXtmiz4v', canvasId:'em5jv'},
// { uri: 'ipfs://QmRLnBbTqdRAAGnm2FNoXjFZwCZbbrHi3nj4bYPGFpjYjC', canvasId:'em5jv'},
// { uri: 'ipfs://QmSJsfu13XSK9axjxhPwQHVrwwX3Teme8buHtWQfdxX23q', canvasId:'em5jv'},
// { uri: 'ipfs://QmUdxKRG8yt2U8NwkfMrJog5vGM12QhW9PN3YK5R9BPijd', canvasId:'em5jv'},
// { uri: 'ipfs://QmRe7RY4rV7qVYAyYRYDGbEF3FndzKyFiSKM8Q7vwgpqpV', canvasId:'em5jv'},
// { uri: 'ipfs://QmbFB2aijp4rroPYM8tZrVnhvocuVcDoqTBRKSm8EynaMQ', canvasId:'em5jv'},
//nature
{ uri: 'ipfs://QmQFFuK5JJmb1qdqBfQEmth4ZUkoedW1HStxxEKXtmiz4v', canvasId:'em5jv'},
{ uri: 'ipfs://QmRLnBbTqdRAAGnm2FNoXjFZwCZbbrHi3nj4bYPGFpjYjC', canvasId:'em5jv'},
{ uri: 'ipfs://QmSJsfu13XSK9axjxhPwQHVrwwX3Teme8buHtWQfdxX23q', canvasId:'em5jv'},
{ uri: 'ipfs://QmUdxKRG8yt2U8NwkfMrJog5vGM12QhW9PN3YK5R9BPijd', canvasId:'em5jv'},
{ uri: 'ipfs://QmRe7RY4rV7qVYAyYRYDGbEF3FndzKyFiSKM8Q7vwgpqpV', canvasId:'em5jv'},
{ uri: 'ipfs://QmbFB2aijp4rroPYM8tZrVnhvocuVcDoqTBRKSm8EynaMQ', canvasId:'em5jv'},
//miami
{ uri: 'ipfs://QmNUTRs4Ypmyj9QKrq4jmcQKgVJo9jUPRDVVzP2izuNuTJ', canvasId:'wmlag'},
{ uri: 'ipfs://QmZ2Wn6CprF15xpqDXVZHLQ7GS9VVPiHPFX4KTTdEK3tKC', canvasId:'wmlag'},
{ uri: 'ipfs://QmWeNAkx5R1WPcBbKoGurLUwJitxg2ZqZXAJ8CfQBaPMfZ', canvasId:'wmlag'},
{ uri: 'ipfs://Qmc8ee6SWAMjeSsLjdXdcTnzsEy6rBgEccLqT5v7ks9UVH', canvasId:'wmlag'},
{ uri: 'ipfs://QmSknhaTUVoXp7S5Pace8QLPWitQUs7w8mjVgP9onyf6ug', canvasId:'wmlag'},
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


