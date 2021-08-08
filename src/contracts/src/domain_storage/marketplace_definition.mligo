type tile = {
    tileId: nat;
    canvasId: string;
    deadline: timestamp;
    tileWidth: nat;
    tileHeight: nat;
    x: int;
    y: int;
    image: string;
    isOwned: bool;
    owner: address;
    onSale: bool;
    price: tez option;
}

type sale = {
    token_id: token_id;
    price: tez;
}

type canvas = {
    canvasId: string;
    deadline: timestamp;
    tileWidth: nat;
    tileHeight: nat;
}

type tiles = (nat, tile) big_map

type owners = (address, token_id set) big_map