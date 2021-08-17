export interface User {
  broadcaster_type: string;
  description: string;
  display_name: string;
  email: string;
  id: string;
  login: string;
  offline_image_url: string;
  profile_image_url: string;
  type: string;
  view_count: number;
}

export interface Game {
  box_art_url: string;
  id: string;
  name: string;
}

export interface Stream {
  game_id: string;
  id: string;
  language: string;
  started_at: string;
  tag_ids: string[];
  thumbnail_url: string;
  getThumbnailUrl: (options?: { width: number; height: number }) => string;
  title: string;
  type: string;
  user_id: string;
  user_name: string;
  viewer_count: number;
}
