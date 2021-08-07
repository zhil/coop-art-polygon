type tile = {
    tileId: nat;
    canvasId: string;
    x: int;
    y: int;
    image: string;
    isOwned: bool;
    owner: address;
    onSale: bool;
    price: tez option;
}