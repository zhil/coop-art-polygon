type sale = {
    token_id: token_id;
    price: tez;
}

type tiles = (nat, tile) big_map

type owners = (address, token_id set) big_map