import { User } from "./objects";
import { Game } from "./objects";
import { Stream } from "./objects";

export interface APIBaseResponse {
  total?: number;
  pagination?: {
    cursor: string;
  };
}

export interface APIUserResponse extends APIBaseResponse {
  data: User[];
}

export interface APIGenericResponse extends APIBaseResponse {
  data: Game[] | User[];
}

export interface APIStreamResponse extends APIBaseResponse {
  data: Stream[];
}
