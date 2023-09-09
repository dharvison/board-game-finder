"use strict";

/** Connect with Boardgame Geek XML API for game information */

// https://boardgamegeek.com/wiki/page/BGG_XML_API
// TODO follow TOS
// Can be timed out if too many requests!
const BGG_OBJ_PREFIX = 'https://boardgamegeek.com/xmlapi';
const BGG_SEARCH_PREFIX = 'https://boardgamegeek.com/xmlapi2';

// Objects from BGG use this as key for title
const BBG_TITLE = '$t';


const axios = require('axios');
const parser = require('xml2json');

/** Fetch the game information for list of bggId
 * 
 * returns [{ bggId, title, designer, coverUrl, year} ...]
 */

async function fetchGameInfo(bggIds) {
    // /xmlapi/boardgame/<gameid>
    // /xmlapi/boardgame/<gameid>,<gameid2>[...]
    const idsString = bggIds.reduce((acc, curId) => (acc + `${curId},`), '');
    try {
        const fetchedData = await axios.get(`${BGG_OBJ_PREFIX}/boardgame/${idsString}`, {
            headers: { accept: 'application/xml' },
            transformResponse: (data) => {
                return parser.toJson(data);
            }
        });

        const fetchedGames = [];
        const { boardgames } = JSON.parse(fetchedData.data);
        if (Array.isArray(boardgames.boardgame)) {
            for (const bggGame of boardgames.boardgame) {
                fetchedGames.push(parseGame(bggGame));
            }
        } else {
            fetchedGames.push(parseGame(boardgames.boardgame));
        }

        return fetchedGames;
    } catch (err) {
        // TODO Do something
    }
}


/** Helper to parse out BGG data for use 
 * 
 * returns { bggId, title, designer, coverUrl, year}
 */

function parseGame(bggGame) {
    // Error  if not found
    //   <boardgame>
    //     <error message="Item not found"/>
    //   </boardgame>

    if (bggGame.error) {
        // TODO handle
        console.err(bggGame.error.message);
    } else {
        const game = {
            bggId: bggGame.objectid,
            title: extractTitle(bggGame.name),
            designer: extractDesigners(bggGame.boardgamedesigner),
            // publisher: bggGame.boardgamepublisher, TODO Maybe?
            year: bggGame.yearpublished,
            coverUrl: bggGame.image,
        }
        return game;
    }
}


/** Helper to extract primary title */

function extractTitle(bggTitles, key=BBG_TITLE) {
    // multiple titles, find primary
    if (Array.isArray(bggTitles)) {
        for (const title of bggTitles) {
            if (title.primary) {
                // if (!Object.hasOwn(title, key)) {
                //     console.log(title);
                // }
                return title[key];
            }
        }
    }
    // only 1 title
    // if (!Object.hasOwn(bggTitles, key)) {
    //     console.log(bggTitles);
    // }
    return bggTitles[key];
}


/** Helper to extract designers */

function extractDesigners(bggDesigners) {
    // multiple designers, combine
    if (Array.isArray(bggDesigners)) {
        // list is sorted by bgg designer id
        let designers = bggDesigners.reduce((designStr, next, idx) => {
            if (idx === 0) return `${next[BBG_TITLE]},`;
            if (idx === bggDesigners.length - 1) return `${designStr} ${next[BBG_TITLE]}`;
            return `${designStr} ${next[BBG_TITLE]},`;
        }, '');
        return designers;
    }
    // only 1 designer
    return bggDesigners[BBG_TITLE];
}


/** Search BGG for game
 * 
 * query should support names and such
 * 
 * returns list of games { bggId, title, year }
 */

async function performSearch(query) {
    // /xmlapi/search
    // Parameters:
    // search: String to search for (required)
    //      Syntax: /xmlapi/search?search=<searchString>
    //      Example: https://boardgamegeek.com/xmlapi/search?search=Crossbows%20and%20Catapults

    // TODO build query? currently can pass exact=1 just fine

    try {
        const fetchedData = await axios.get(`${BGG_SEARCH_PREFIX}/search?query=${query}&type=boardgame`, {
            headers: { accept: 'application/xml' },
            transformResponse: (data) => {
                return parser.toJson(data);
            }
        });

        const searchParse = (bggGame) => {
            const parsed = {
                bggId: bggGame.id,
                title: extractTitle(bggGame.name, "value"),
                year: bggGame.yearpublished ? bggGame.yearpublished.value : 'Unknown',
            };
            return parsed;
        }

        const { items } = JSON.parse(fetchedData.data);
        const resultGames = [];
        if (items.total > 1) {
            for (const game of items.item) {
                resultGames.push(searchParse(game));
            }
        } else if (items.total == 1) {
            resultGames.push(searchParse(items.item));
        } else {
            return {error: 'No games!'};
        }

        return resultGames;
    } catch (err) {
        console.log(err);
    }
}

/** Search BGG for hot items
 * 
 * returns list of games { bggId, title, year, coverUrl }
 */

async function hotItems(type='boardgame') {
    // /xmlapi2/hot?type
    // valid types: boardgame, rpg, videogame, boardgameperson, rpgperson, boardgamecompany, rpgcompany, videogamecompany

    try {
        const fetchedData = await axios.get(`${BGG_SEARCH_PREFIX}/hot?${type}`, {
            headers: { accept: 'application/xml' },
            transformResponse: (data) => {
                return parser.toJson(data);
            }
        });

        const hotParse = (bggGame) => {
            return {
                bggId: bggGame.id,
                title: extractTitle(bggGame.name, "value"),
                year: bggGame.yearpublished.value,
                coverUrl: bggGame.thumbnail.value,
            }
        }

        const { items } = JSON.parse(fetchedData.data);
        const hotGames = [];
        if (Array.isArray(items.item)) {
            for (const game of items.item) {
                hotGames.push(hotParse(game));
            }
        } else {
            hotGames.push(hotParse(items.item));
        }

        return hotGames;
    } catch (err) {
        // TODO Do something
    }
}

/** Import a users games? */

async function importGames(bggUser) {
    // /xmlapi/collection/<username>
    // own: In (or exclude for 0) a user's collection. That is, the user currently owns it. Collections include games that
    //      Syntax: /xmlapi/collection/<username>?own=<0,1>
    //      Example: https://boardgamegeek.com/xmlapi/collection/zefquaavius?own=1 - games zefquaavius owns
    // wanttoplay
    //     Syntax: /xmlapi/collection/<username>?wanttoplay=<0,1>
    //     Example: https://boardgamegeek.com/xmlapi/collection/zefquaavius?wanttoplay=1 - games zefquaavius currently wants to play

    throw Error("TODO Implement me");
}


module.exports = {
    fetchGameInfo,
    performSearch,
    hotItems,
    importGames,
};