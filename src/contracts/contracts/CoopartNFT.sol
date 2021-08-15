pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract CoopartNFT is ERC721, Ownable, ERC721Enumerable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIds;
    mapping(uint256 => string) private _tokenURIs;
    mapping(string => uint256[]) public canvasIdToTileIds;
    mapping(uint256 => int256) tileIdToVotes;
    event CanvasBought(address _buyer);
    event HasVoted(address _voter);

    constructor() ERC721('COOPART', 'COOPART') {}

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), 'ERC721Metadata: URI query for nonexistent token');
        string memory _tokenURI = _tokenURIs[tokenId];
        return _tokenURI;
    }

    function mint(
        address recipient,
        string memory uri,
        string memory canvasId
    ) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, uri);
        canvasIdToTileIds[canvasId].push(newItemId);
        return newItemId;
    }

    function buy(string memory _canvasId) external payable {
        require(msg.value > 0, 'Please send some tokens'); // Temporary. Just checking if some money was sent.
        uint256[] memory tiles = canvasIdToTileIds[_canvasId];
        require(tiles.length > 0, 'This canvas has no tile');

        // Pay tile creators
        for (uint256 i = 0; i < tiles.length; i++) {
            address seller = ownerOf(tiles[i]);
            _transfer(seller, msg.sender, tiles[i]);
            payable(seller).transfer(msg.value / tiles.length);
        }

        emit CanvasBought(msg.sender);
    }

    function upvote(uint256 _tileId) external {
        tileIdToVotes[_tileId] += 1;
        emit HasVoted(msg.sender);
    }

    function downvote(uint256 _tileId) external {
        tileIdToVotes[_tileId] -= 1;
        emit HasVoted(msg.sender);
    }
}
