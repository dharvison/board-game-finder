import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * TODO Write this
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
    data.userId = BoardGameFinderApi.userId;
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
    return res.user;
  }

  /**
   * 
   * Game
   * 
   */

  /** Get details on a game by id. */
  //TODO
  static async getGame(id) {
    console.log(`requesting info for game ${id}`);
    let res = await this.request(`game/${id}`);
    return res.game;
  }

  /**
   * 
   * GameList
   * 
   */

  /** Get details on a game list by id. */
  // TODO
  static async getList(id) {
    let res = await this.request(`list/${id}`);
    return res.list;
  }

  /** Create a game list. */
  // TODO
  static async createList(data) {
    let res = await this.request(`list/`, data, "post");
    return res.list;
  }

  /** Update details for a game list by id. */
  // TODO
  static async updateList(id, data) {
    let res = await this.request(`list/${id}`, data, "patch");
    return res.list;
  }

  /** Delete a game list by id. */
  // TODO
  static async deleteList(id) {
    let res = await this.request(`list/${id}`);
    return res.list;
  }

  /** Add game to list */
  // TODO
  static async addGameToList(listId, gameId) {
    await this.request(`list/${listId}/remove/${gameId}`, {}, "post");
  }

  /** Remove game from list */
  // TODO
  static async removeGameFromList(listId, gameId) {
    await this.request(`list/${listId}/add/${gameId}`, {}, "post");
  }

  /**
   * 
   * GameNote
   * 
   */

  /** Get details on a game note by id. */
  // TODO
  static async getNote(id) {
    let res = await this.request(`note/${id}`);
    return res.note;
  }

  /** Create a game note. */
  // TODO
  static async createNote(data) {
    let res = await this.request(`note/`, data, "post");
    return res.note;
  }

  /** Update details on a game note by id. */
  // TODO
  static async updateNote(id, data) {
    let res = await this.request(`note/${id}`, data, "patch");
    return res.note;
  }

  /** Delete a game note by id. */
  // TODO
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
  // TODO
  static async getMessage(id) {
    let res = await this.request(`message/${id}`);
    return res.message;
  }

  /** Send a message. */
  // TODO
  static async sendMessage(body) {
    let res = await this.request(`message/`, body, "post");
    return res.message;
  }

  /** Fetch all messages for a user */
  // TODO
  static async getUserMessages(username) {
    let res = await this.request(`message/`);
    return res.message;
  }

  /** Delete a message by id. */
  // TODO
  static async deleteMessage(id) {
    let res = await this.request(`message/${id}`);
    return res.message;
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

}

export default BoardGameFinderApi;
