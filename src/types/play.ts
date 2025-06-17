
export interface Play {
  id: string;
  video_url: string;
  caption: string;
  play_type: string;
  formation: string;
  tags: string[];
  shared_by: string;
  created_at: string;
  likes: number;
  liked: boolean;
  saved: boolean;
  source: string;
  description: string;
}
