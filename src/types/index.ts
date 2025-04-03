
export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  publishedAt: string;
  viewCount: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  articleId: string;
  parentId: string | null;
  author: string;
  content: string;
  createdAt: string;
  replies?: Comment[];
}

export interface StatisticsData {
  views: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    labels: string[];
  };
  comments: {
    daily: number[];
    weekly: number[];
    monthly: number[];
    labels: string[];
  };
}
