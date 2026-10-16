export interface InstagramMediaAuthor {
  username: string;
  name: string;
  avatarUrl?: string;
  profileUrl: string;
}

export interface InstagramMediaData {
  id: string;
  shortcode: string;
  originalUrl: string;
  type: 'reel' | 'video' | 'post' | 'story' | 'igtv';
  title: string;
  caption: string;
  hashtags: string[];
  author: InstagramMediaAuthor;
  videoUrl: string;
  downloadUrl: string;
  thumbnailUrl: string;
  quality: string;
  likesCount?: string;
  commentsCount?: string;
  duration?: number;
  isAudioAvailable: boolean;
  downloadedAt?: number;
}

export interface DownloadHistoryItem extends InstagramMediaData {
  timestamp: number;
}
