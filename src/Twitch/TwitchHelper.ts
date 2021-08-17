import { EventEmitter } from "events";
import { User } from "../Types/objects";
import { TwitchConfig, GetStreamsOptions } from "../Types/options";
import { Scope } from "../Types/scopes";
import { MyTeamsError } from "../Utils/Error";
import fetch from "node-fetch";
import { AuthEvent } from "../Types/events";
import { APIUserResponse, APIStreamResponse } from "../Types/responses";
import {
  isNumber,
  parseMixedParam,
  parseOptions,
  addThumbnailMethod,
} from "../Types/util";

export class TwitchHelper extends EventEmitter {
  client_secret: string;
  client_id: string;

  user?: User;
  access_token?: string;
  refresh_token?: string;
  scopes?: Scope[];
  redirect_uri?: string;

  base: string;
  refresh_attempts: number;
  ready: boolean;

  constructor(config: TwitchConfig) {
    super();

    this.client_secret = config.client_secret;
    this.client_id = config.client_id;
    this.access_token = config.access_token;
    this.refresh_token = config.refresh_token;
    this.scopes = config.scopes;
    this.redirect_uri = config.redirect_uri;
    this.base = "https://api.twitch.tv/helix";
    this.refresh_attempts = 0;
    this.ready = false;

    this._init();
  }

  private async _init(): Promise<void> {
    if (this.access_token) {
      const currentUser = await this.getCurrentUser();
      this.user = currentUser;
    }
  }

  private async _get<T>(endpoint: string): Promise<T> {
    if (!this.access_token) {
      const accessToken = await this._getAppAccessToken();

      if (!accessToken)
        throw new MyTeamsError(
          "App access token could not be fetched. Please make sure your `client_id` and `client_secret` are correct."
        );
      this.access_token = accessToken;
    }

    const url = this.base + endpoint;
    const options = {
      method: "GET",
      headers: {
        "Client-ID": this.client_id,
        Authorization: `Bearer ${this.access_token}`,
      },
    };

    const response = await fetch(url, options);

    if (response.status === 401) {
      await this._refresh();
      return this._get(endpoint);
    }

    const result: T = await response.json();
    return result;
  }

  private async _getAppAccessToken(): Promise<string | undefined> {
    const data = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "client_credentials",
      scope: this.scopes?.join(" "),
    };
    const endpoint = "https://id.twitch.tv/oauth2/token";
    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.text();

    try {
      const data = JSON.parse(result);
      return data.access_token;
    } catch (err) {
      throw new MyTeamsError(
        `Error getting app access token. Expected twitch to return JSON object but got: ${result}`
      );
    }
  }

  private async _refresh(): Promise<void> {
    const valid = await this._validate();
    if (valid) return;

    if (!this.refresh_token)
      throw new MyTeamsError("Refresh token is not set.");

    const refreshData = {
      client_id: this.client_id,
      client_secret: this.client_secret,
      grant_type: "refresh_token",
      refresh_token: encodeURIComponent(this.refresh_token),
    };

    const url = "https://id.twitch.tv/oauth2/token";
    const options = {
      method: "POST",
      body: JSON.stringify(refreshData),
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, options);
    const result: AuthEvent = await response.json();

    const accessToken = result.access_token;
    const refreshToken = result.refresh_token;

    this.access_token = accessToken || this.access_token;
    this.refresh_token = refreshToken || this.refresh_token;

    if (this._isListeningFor("refresh")) this.emit("refresh", result);

    if (!accessToken) this.refresh_attempts++;
  }

  private async _validate(): Promise<boolean> {
    const url = "https://id.twitch.tv/oauth2/validate";
    const options = {
      headers: {
        Authorization: `OAuth ${this.access_token}`,
      },
    };

    const response = await fetch(url, options);
    const result = await response.json();

    const message = result.message;
    const valid = response.status === 200;

    if (message === "missing authorization token")
      throw new MyTeamsError(message);

    return valid;
  }

  private _isListeningFor(event: string): boolean {
    return this.eventNames().includes(event);
  }

  async getCurrentUser(): Promise<User | undefined> {
    const endpoint = "/users";
    const result = await this._get<APIUserResponse>(endpoint);

    if (!result) {
      throw new MyTeamsError(
        "Failed to get current user. This could be because you haven't provided an access_token connected to a user."
      );
    }

    const user = result.data[0];
    return user;
  }

  async getStreams(options: GetStreamsOptions): Promise<APIStreamResponse> {
    let query = "?";
    const endpoint = "/streams";

    if (!options) return this._get<APIStreamResponse>(endpoint);

    const { channel, channels } = options;

    if (channel) {
      const key = isNumber(channel) ? "user_id" : "user_login";

      query += `${key}=${channel}&`;
    }

    if (channels)
      query += parseMixedParam({
        values: channels,
        stringKey: "user_login",
        numericKey: "user_id",
      });

    query += "&";
    query += parseOptions(options);
    const response = await this._get<APIStreamResponse>(endpoint + query);
    response.data.map(addThumbnailMethod);
    return response;
  }
}
