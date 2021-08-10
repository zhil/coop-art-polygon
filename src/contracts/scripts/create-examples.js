const Coopart = artifacts.require('Coopart')
const ADMIN = 'tz1YWK1gDPQx9N1Jh4JnmVre7xN6xhGGM4uC';

module.exports = async function(callback) {
    let coopart = await Coopart.deployed()
    // mint(canvasId, deadline, image, ADMIN, owner, tileHeight, tileId, tileWidth, x, y)

    try {
        await coopart.mint('horse', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/horse1.png', ADMIN, ADMIN, 340, 1001, 130, 0, 0)
        await coopart.mint('horse', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/horse2.png', ADMIN, ADMIN, 340, 1002, 130, 1, 0)
        await coopart.mint('horse', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/horse3.png', ADMIN, ADMIN, 340, 1003, 130, 2, 0)

        await coopart.mint('rage', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/rage1.png', ADMIN, ADMIN, 100, 2001, 100, 0, 0)
        await coopart.mint('rage', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/rage2.png', ADMIN, ADMIN, 100, 2002, 100, -1, 0)
        await coopart.mint('rage', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/rage3.png', ADMIN, ADMIN, 100, 2003, 100, 2, 1)
        await coopart.mint('rage', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/rage4.png', ADMIN, ADMIN, 100, 2004, 100, 3, 0)
        await coopart.mint('rage', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/rage5.png', ADMIN, ADMIN, 100, 2005, 100, -2, 5)
        await coopart.mint('rage', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/rage6.png', ADMIN, ADMIN, 100, 2006, 100, -3, -2)
        await coopart.mint('rage', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/rage7.png', ADMIN, ADMIN, 100, 2007, 100, 0, -1)
        await coopart.mint('rage', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/rage8.png', ADMIN, ADMIN, 100, 2008, 100, 1, -3)

        await coopart.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic1.png', ADMIN, ADMIN, 270, 1001, 192, 0, 0)
        await coopart.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic2.png', ADMIN, ADMIN, 270, 1002, 192, 0, 1)
        await coopart.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic3.png', ADMIN, ADMIN, 270, 1003, 192, 1, 0)
        await coopart.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic4.png', ADMIN, ADMIN, 270, 1001, 192, 1, 1)
        await coopart.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic5.png', ADMIN, ADMIN, 270, 1002, 192, 2, 0)
        await coopart.mint('comic', '2021-08-15t00:00:00Z', 'https://coopart.io/examples/comic6.png', ADMIN, ADMIN, 270, 1003, 192, 2, 1)
    } catch(e) {
        console.log(e)
    }

    console.log("Examples created")
    callback()
}
