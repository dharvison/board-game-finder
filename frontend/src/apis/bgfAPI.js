import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Fetch data from backend
 *
 */

class BoardGameFinderApi {
  // the token for interactive with the API will be stored here.
  static token;
  static userId;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${BoardGameFinderApi.token}` };

    const params = (method === "get")
      ? data
      : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /**
   * 
   * User & Login
   * 
   */

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`user/${username}`);
    console.log(res.user);
    return res.user;
  }

  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`user/${username}`, data, "patch");
    return { success: true, user: res.user };
  }

  /** Get user lists. */

  static async getUserLists(userId) {
    let res = await this.request(`user/${userId}/lists`);
    return res.lists;
  }

  /** Get user lists with gameId. */

  static async getUserListsWithGameId(userId, gameId) {
    let res = await this.request(`user/${userId}/lists/${gameId}`);
    return res.lists;
  }

  /** Get user notes. */

  static async getUserNotes(userId) {
    let res = await this.request(`user/${userId}/notes`);
    return res.notes;
  }

  /** Get user note for game. */

  static async getUserNoteForGame(userId, bggId) {
    let res = await this.request(`user/${userId}/note/${bggId}`);

    // there is no note!
    if (res.result && res.result === 'none') {
      return null;
    }

    return res.note;
  }

  /** Fetch all messages for a user */

  static async getUserMessages(userId) {
    let res = await this.request(`user/${userId}/msgs`);
    return res.messages;
  }

  /** Get user profile. */

  static async getUserProfile(userId) {
    let res = await this.request(`user/${userId}/public`);
    return res.user;
  }

  /** Get user smartlists. */

  static async getUserSmartlists(userId) {
    let res = await this.request(`user/${userId}/smartlists`);
    return res.user;
  }

  /**
   * 
   * Game
   * 
   */

  /** Get details on a game by id. */

  static async getGame(id) {
    let res = await this.request(`game/${id}`);
    return res.game;
  }

  /**
   * 
   * GameList
   * 
   */

  /** Get details on a game list by id. */

  static async getList(id) {
    let res = await this.request(`list/${id}`);
    return res.list;
  }

  /** Create a game list. */

  static async createList(data) {
    let res = await this.request(`list/`, data, "post");
    return { success: true, list: res.list };
  }

  /** Update details for a game list by id. */

  static async updateList(id, data) {
    let res = await this.request(`list/${id}`, data, "patch");
    return { success: true, list: res.list };
  }

  /** Delete a game list by id. */

  static async deleteList(id) {
    let res = await this.request(`list/${id}`);
    return res.list;
  }

  /** Add game to list */

  static async addGameToList(listId, gameId) {
    const res = await this.request(`list/${listId}/add`, { gameId }, "post");
    return res;
  }

  /** Remove game from list */

  static async removeGameFromList(listId, gameId) {
    const res = await this.request(`list/${listId}/remove`, { gameId }, "post");
    return res;
  }

  /**
   * 
   * GameNote
   * 
   */

  /** Get details on a game note by id. */

  static async getNote(id) {
    let res = await this.request(`note/${id}`);
    return res.note;
  }

  /** Create a game note. */

  static async createNote(data) {
    let res = await this.request(`note/`, data, "post");
    return { success: true, note: res.note };
  }

  /** Update details on a game note by id. */

  static async updateNote(id, data) {
    let res = await this.request(`note/${id}`, data, "patch");
    return { success: true, note: res.note };
  }

  /** Delete a game note by id. */

  static async deleteNote(id) {
    let res = await this.request(`note/${id}`);
    return res.note;
  }

  /**
   * 
   * Message
   * 
   */

  /** Get details on a message by id. */

  static async getMessage(id) {
    let res = await this.request(`msg/${id}`);
    return res.message;
  }

  /** Send a message. */

  static async sendMessage(body) {
    let res = await this.request(`msg/`, body, "post");
    return { success: true, message: res.message };
  }

  /** Delete a message by id. */

  static async deleteMessage(id) {
    let res = await this.request(`msg/${id}`, {}, "delete");
    return { success: true, message: res.message };
  }

  /**
   * 
   * Search
   * 
   */

  /** Perform basic search */

  static async search(term) {
    let res = await this.request(`search/${term}`);
    return res;
  }

  /**
   * 
   * Trending
   * 
   */

  /** Fetch trending */

  static async trending() {
    let res = await this.request(`trending/hot`);
    return res;
  }

  /**
   * 
   * Find Players
   * 
   */

  /** Find local players */

  static async localPlayers(userId) {
    let res = await this.request(`user/${userId}/local`);
    return res;
  }

  /** Find local players for game*/

  static async localPlayersForGame(userId, bggId) {
    let res = await this.request(`user/${userId}/local/${bggId}`);
    return res;
  }

  /** Find state players */

  static async statePlayers(userId) {
    let res = await this.request(`user/${userId}/state`);
    return res;
  }

  /** Find state players for game */

  static async statePlayersForGame(userId, bggId) {
    let res = await this.request(`user/${userId}/state/${bggId}`);
    return res;
  }

}

export default BoardGameFinderApi;
