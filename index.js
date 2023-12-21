/*
  Pseudocode:
  Note: Make sure to install the required dependencies using npm install express pg cors.

    1. Import necessary libraries and modules.
    2. Set up Express application.
    3. Enable CORS for cross-origin requests.
    4. Define PostgreSQL client connection and configuration.
    5. Define a task to create the necessary database and tables.
    6. Define API routes for video games and board games.

    Video Games API Endpoints:
      - GET /api/videogames - Retrieve all video games.
      - GET /api/videogames/:id - Retrieve a specific video game by ID.
      - POST /api/videogames - Add a new video game.
      - PUT /api/videogames/:id - Update a video game by ID.
      - DELETE /api/videogames/:id - Delete a video game by ID.

    Board Games API Endpoints:
      - GET /api/boardgames - Retrieve all board games.
      - GET /api/boardgames/:id - Retrieve a specific board game by ID.
      - POST /api/boardgames - Add a new board game.
      - PUT /api/boardgames/:id - Update a board game by ID.
      - DELETE /api/boardgames/:id - Delete a board game by ID.

    7. Define functions for handling each API endpoint.
    8. Define a start function to connect to the database, create tables, and start the server.
    9. Start the server on a specified port.

*/






const express = require('express');
const pg = require('pg');
const client = new pg.Client('postgres://localhost/gamestore_db');
const app = express();
const cors = require('cors')

app.use(cors());

app.use(express.json());

app.get('/api/videogames', async (req,res,next) =>{
    try {
        const SQL = `
        SELECT *
        FROM videogames;
        `
        const response = await client.query(SQL)
        console.log(response.rows)
        res.send(response.rows)

    } catch (error) {
        next(error)
    }
})

app.get('/api/videogames/:id', async (req, res, next) => {
    try {
        const gameId = req.params.id;

        const SQL = `
            SELECT *
            FROM videogames
            WHERE id = $1;
        `;

        const response = await client.query(SQL, [gameId]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const game = response.rows[0];
        res.send(game);

    } catch (error) {
        next(error);
    }
});

app.post('/api/videogames', async (req, res, next) => {
    try {
    
        const SQL = `
            INSERT INTO videogames (name, rating, img)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const response = await client.query(SQL, [req.body.name, req.body.rating, req.body.img]);
        const newGame = response.rows[0];

        res.send(newGame);

    } catch (error) {
        next(error);
    }
});


app.put('/api/videogames/:id', async (req, res, next) => {
    try {
        const gameId = req.params.id;
        

        const SQL = `
            UPDATE videogames
            SET name = $1, rating = $2, img = $3
            WHERE id = $4
            RETURNING *;
        `;

        const response = await client.query(SQL, [req.body.name, req.body.rating, req.body.img, gameId]);

        if (response.rows.length === 0) {
            return res.status(404).send({ error: 'Game not found' });
        }

        const updatedGame = response.rows[0];
        res.send(updatedGame);

    } catch (error) {
        next(error);
    }
});


app.delete('/api/videogames/:id', async (req, res, next) => {
    try {
        const gameId = req.params.id;

        const SQL = `
            DELETE FROM videogames
            WHERE id = $1
            RETURNING *;
        `;

        const response = await client.query(SQL, [gameId]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const deletedGame = response.rows[0];
        res.send({ message: 'Game deleted successfully', deletedGame });

    } catch (error) {
        next(error);
    }
});




app.get('/api/boardgames', async (req,res,next) =>{
    try {
        const SQL = `
        SELECT *
        FROM boardgames;
        `
        const response = await client.query(SQL)
        console.log(response.rows)
        res.send(response.rows)

    } catch (error) {
        next(error)
    }
})

app.get('/api/boardgames/:id', async (req, res, next) => {
    try {
        const gameId = req.params.id;

        const SQL = `
            SELECT *
            FROM boardgames
            WHERE id = $1;
        `;

        const response = await client.query(SQL, [gameId]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        const game = response.rows[0];
        res.send(game);

    } catch (error) {
        next(error);
    }
});


app.post('/api/boardgames', async (req, res, next) => {
    try {
        const SQL = `
            INSERT INTO boardgames (name, complexity, players_min, players_max, img)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const response = await client.query(SQL, [req.body.name, req.body.complexity, req.body.players_min, req.body.players_max, req.body.img]);
        const newBoardGame = response.rows[0];

        res.send(newBoardGame);

    } catch (error) {
        next(error);
    }
});



app.put('/api/boardgames/:id', async (req, res, next) => {
    const gameId = req.params.id;
    try {
      const SQL = `
            UPDATE boardgames
            SET name = $1, complexity = $2, players_min = $3, players_max = $4, img = $5
            WHERE id = $6
            RETURNING *;
        `;

        const response = await client.query(SQL, [req.body.name, req.body.complexity, req.body.players_min, req.body.players_max, req.body.img, gameId]);

        if (response.rows.length === 0) {
            return res.send({ error: 'Board game not found' });
        }

        const updatedBoardGame = response.rows[0];
        res.send(updatedBoardGame);

    } catch (error) {
        next(error);
    }
});

app.delete('/api/boardgames/:id', async (req, res, next) => {
    try {
        const gameId = req.params.id;

        const SQL = `
            DELETE FROM boardgames
            WHERE id = $1
            RETURNING *;
        `;

        const response = await client.query(SQL, [gameId]);

        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Board game not found' });
        }

        const deletedBoardGame = response.rows[0];
        res.json({ message: 'Board game deleted successfully', deletedBoardGame });

    } catch (error) {
        next(error);
    }
});

const start = async () => {
    await client.connect();
    const SQL = `
        DROP TABLE IF EXISTS videogames;
        CREATE TABLE videogames (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            rating FLOAT,
            img VARCHAR(500)
        );

        INSERT INTO videogames (name, rating, img) VALUES ('The Witcher 3: Wild Hunt', 9.3, 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000033071/3f7ee6aa3482b514bd443e116022b038a9728f017916ed37da3f09f731a7d5f2');
        INSERT INTO videogames (name, rating, img) VALUES ('Red Dead Redemption 2', 9.7, 'https://cdn1.epicgames.com/epic/offer/RDR2PC1227_Epic%20Games_860x1148-860x1148-b4c2210ee0c3c3b843a8de399bfe7f5c.jpg');
        INSERT INTO videogames (name, rating, img) VALUES ('God of War (2018)', 9.6, 'https://image.api.playstation.com/vulcan/img/rnd/202010/2217/LsaRVLF2IU2L1FNtu9d3MKLq.jpg');
        INSERT INTO videogames (name, rating, img) VALUES ('Cyberpunk 2077', 7.2, 'https://static.cdprojektred.com/cms.cdprojektred.com/16x9_big/b9ea2dc46d95cf9fa3f77209e27ae7a6488368f1-1280x720.jpg');
        INSERT INTO videogames (name, rating, img) VALUES ('The Legend of Zelda: Breath of the Wild', 9.5, 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/ncom/software/switch/70010000000025/7137262b5a64d921e193653f8aa0b722925abc5680380ca0e18a5cfd91697f58');
        INSERT INTO videogames (name, rating, img) VALUES ('Assassin''s Creed Odyssey', 8.4, 'https://cdn.akamai.steamstatic.com/steam/apps/812140/capsule_616x353.jpg?t=1692034673');
        INSERT INTO videogames (name, rating, img) VALUES ('FIFA 22', 7.8, 'https://cdn.akamai.steamstatic.com/steam/apps/1506830/capsule_616x353.jpg?t=1695934909');
        INSERT INTO videogames (name, rating, img) VALUES ('Minecraft', 9.1, 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000000964/811461b8d1cacf1f2da791b478dccfe2a55457780364c3d5a95fbfcdd4c3086f');
        INSERT INTO videogames (name, rating, img) VALUES ('Among Us', 8.0, 'https://cdn1.epicgames.com/salesEvent/salesEvent/amoguslandscape_2560x1440-3fac17e8bb45d81ec9b2c24655758075');
        INSERT INTO videogames (name, rating, img) VALUES ('Fortnite', 6.8, 'https://cdn2.unrealengine.com/social-image-chapter4-s3-3840x2160-d35912cc25ad.jpg');
    ;


        DROP TABLE IF EXISTS boardgames;
        CREATE TABLE boardgames (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        complexity INT,
        players_min INT,
        players_max INT,
        img VARCHAR(500)
    );

    INSERT INTO boardgames (name, complexity, players_min, players_max, img) VALUES ('Catan', 2, 3, 4, 'https://www.google.com/search?q=Catan&tbm=isch&ved=2ahUKEwid5JnnkaGDAxWZN94AHUyqDnwQ2-cCegQIABAA&oq=Catan&gs_lcp=CgNpbWcQAzIICAAQgAQQsQMyCAgAEIAEELEDMggIABCABBCxAzIFCAAQgAQyCAgAEIAEELEDMgUIABCABDIFCAAQgAQyBQgAEIAEMgUIABCABDILCAAQgAQQsQMQgwE6DQgAEIAEEIoFEEMQsQM6CggAEIAEEIoFEENQ7AxYyw5gmRJoAXAAeACAAVuIAacBkgEBMpgBAKABAaoBC2d3cy13aXotaW1nsAEAwAEB&sclient=img&ei=OoGEZZ3fPJnv-LYPzNS64Ac&bih=909&biw=958&hl=en#imgrc=erCvOIuajbLSoM');
    INSERT INTO boardgames (name, complexity, players_min, players_max, img) VALUES ('Carcassonne', 1, 2, 5, 'https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/81mj6maLP3L._AC_UF894,1000_QL80_.jpg');
        INSERT INTO boardgames (name, complexity, players_min, players_max, img) VALUES ('Pandemic', 3, 2, 4, 'https://target.scene7.com/is/image/Target/GUEST_0313f621-d762-4e1d-9855-e32163314488?wid=488&hei=488&fmt=pjpeg');
        INSERT INTO boardgames (name, complexity, players_min, players_max, img) VALUES ('Splendor', 2, 2, 4, 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/BoardGameSplendorLogoFairUse.jpg/220px-BoardGameSplendorLogoFairUse.jpg');
        INSERT INTO boardgames (name, complexity, players_min, players_max, img) VALUES ('7 Wonders', 2, 3, 7, 'https://m.media-amazon.com/images/I/81v6X774I3L.__AC_SX300_SY300_QL70_FMwebp_.jpg');
        INSERT INTO boardgames (name, complexity, players_min, players_max, img) VALUES ('Codenames', 1, 4, 8, 'https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/81RTivGRV6L._AC_UF894,1000_QL80_.jpg');
        INSERT INTO boardgames (name, complexity, players_min, players_max, img) VALUES ('Scythe', 4, 1, 5, 'https://m.media-amazon.com/images/I/713GAFkeRBL.__AC_SY300_SX300_QL70_FMwebp_.jpg');
        INSERT INTO boardgames (name, complexity, players_min, players_max, img) VALUES ('Gloomhaven', 4, 1, 4, 'https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71KfUf4ySkL.jpg');
        INSERT INTO boardgames (name, complexity, players_min, players_max, img) VALUES ('Azul', 2, 2, 4, 'https://www.boardgamequest.com/wp-content/uploads/2017/10/Azul.jpg');
`;


    await client.query(SQL);

    const port = process.env.PORT || 3000;

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};

start();
