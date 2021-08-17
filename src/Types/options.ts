import { Scope } from "./scopes";

export interface TwitchConfig {
  client_id: string;
  client_secret: string;
  scopes?: Scope[];
  access_token?: string;
  refresh_token?: string;
  redirect_uri?: string;
}

export interface GetStreamsOptions extends BaseOptions {
  game_id?: string[] | string | number[] | number;
  language?: string[] | string;
  channels?: string[];
  channel?: string;
}

export interface BaseOptions {
  first?: number;
  after?: string;
  before?: string;
}

export interface TwitchWeb {
  port?: number;
}