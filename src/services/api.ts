
import { Article, Comment, StatisticsData } from '../types';
import { mockArticles, mockComments, mockStatistics } from '../data/mockData';
import { toast } from '@/hooks/use-toast';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Articles API
export const articlesApi = {
  // Get all articles
  getArticles: async (): Promise<Article[]> => {
    await delay(800);
    return [...mockArticles].sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  },

  // Get single article by ID
  getArticleById: async (id: string): Promise<Article | undefined> => {
    await delay(500);
    const article = mockArticles.find(article => article.id === id);
    
    if (article) {
      // Simulate view count increase
      article.viewCount += 1;
    }
    
    return article;
  },

  // Create new article
  createArticle: async (articleData: Omit<Article, 'id' | 'viewCount' | 'commentCount'>): Promise<Article> => {
    await delay(1000);
    
    const newArticle: Article = {
      ...articleData,
      id: `${mockArticles.length + 1}`,
      viewCount: 0,
      commentCount: 0
    };
    
    mockArticles.push(newArticle);
    toast({
      title: "Статья создана",
      description: "Новая статья успешно опубликована",
    });
    
    return newArticle;
  },

  // Update existing article
  updateArticle: async (id: string, articleData: Partial<Article>): Promise<Article | undefined> => {
    await delay(1000);
    
    const articleIndex = mockArticles.findIndex(article => article.id === id);
    
    if (articleIndex !== -1) {
      mockArticles[articleIndex] = {
        ...mockArticles[articleIndex],
        ...articleData,
      };
      
      toast({
        title: "Статья обновлена",
        description: "Изменения успешно сохранены",
      });
      
      return mockArticles[articleIndex];
    }
    
    return undefined;
  },

  // Delete article
  deleteArticle: async (id: string): Promise<boolean> => {
    await delay(1000);
    
    const articleIndex = mockArticles.findIndex(article => article.id === id);
    
    if (articleIndex !== -1) {
      mockArticles.splice(articleIndex, 1);
      
      // Also delete comments for this article
      const commentIndicesToRemove = mockComments
        .map((comment, index) => comment.articleId === id ? index : -1)
        .filter(index => index !== -1)
        .sort((a, b) => b - a); // Sort in descending order to remove from end first
      
      commentIndicesToRemove.forEach(index => {
        mockComments.splice(index, 1);
      });
      
      toast({
        title: "Статья удалена",
        description: "Статья и все связанные комментарии удалены",
      });
      
      return true;
    }
    
    return false;
  }
};

// Comments API
export const commentsApi = {
  // Get comments for an article
  getCommentsByArticleId: async (articleId: string): Promise<Comment[]> => {
    await delay(600);
    
    // Get top-level comments for this article
    const topLevelComments = mockComments
      .filter(comment => comment.articleId === articleId && comment.parentId === null);
    
    // Get replies for each top-level comment
    const commentsWithReplies = topLevelComments.map(comment => {
      const replies = mockComments
        .filter(reply => reply.parentId === comment.id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      return {
        ...comment,
        replies
      };
    });
    
    return commentsWithReplies.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Add a new comment
  addComment: async (comment: Omit<Comment, 'id' | 'createdAt' | 'replies'>): Promise<Comment> => {
    await delay(800);
    
    const newComment: Comment = {
      ...comment,
      id: `${mockComments.length + 1}`,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    mockComments.push(newComment);
    
    // Update comment count for the article
    const articleIndex = mockArticles.findIndex(article => article.id === comment.articleId);
    if (articleIndex !== -1) {
      mockArticles[articleIndex].commentCount += 1;
    }
    
    toast({
      title: "Комментарий добавлен",
      description: comment.parentId 
        ? "Ваш ответ успешно опубликован" 
        : "Ваш комментарий успешно опубликован",
    });
    
    return newComment;
  }
};

// Statistics API
export const statisticsApi = {
  // Get statistics data
  getStatisticsData: async (): Promise<StatisticsData> => {
    await delay(1000);
    return mockStatistics;
  },

  // This would typically connect to a real-time service
  subscribeToUpdates: (callback: (data: StatisticsData) => void) => {
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      // Generate some random changes
      const updatedStats = {
        views: {
          ...mockStatistics.views,
          daily: mockStatistics.views.daily.map(value => 
            Math.max(0, value + Math.floor(Math.random() * 20) - 10)
          ),
        },
        comments: {
          ...mockStatistics.comments,
          daily: mockStatistics.comments.daily.map(value => 
            Math.max(0, value + Math.floor(Math.random() * 5) - 2)
          ),
        }
      };
      
      Object.assign(mockStatistics, updatedStats);
      callback(mockStatistics);
    }, 10000);
    
    // Return unsubscribe function
    return () => clearInterval(interval);
  }
};
