
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CommentItem } from '@/components/CommentItem';
import { CommentForm } from '@/components/CommentForm';
import { Article, Comment } from '@/types';
import { articlesApi, commentsApi } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, MessageSquare, ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await articlesApi.getArticleById(id);
        if (data) {
          setArticle(data);
        } else {
          // Article not found, redirect to home
          navigate('/');
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      setIsLoadingComments(true);
      try {
        const data = await commentsApi.getCommentsByArticleId(id);
        setComments(data);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    if (article) {
      fetchComments();
    }
  }, [id, article]);

  const handleCommentAdded = (newComment: Comment) => {
    // If it's a top-level comment
    if (!newComment.parentId) {
      setComments([{ ...newComment, replies: [] }, ...comments]);
      return;
    }
    
    // If it's a reply to an existing comment
    const updatedComments = comments.map(comment => {
      if (comment.id === newComment.parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newComment]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container py-8 flex justify-center items-center">
          <p className="text-muted-foreground">Загрузка статьи...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container py-8 flex justify-center items-center">
          <p className="text-muted-foreground">Статья не найдена</p>
        </main>
        <Footer />
      </div>
    );
  }

  const publishedDate = new Date(article.publishedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Convert Markdown-like content to HTML (very basic implementation)
  const formatContent = (content: string) => {
    let formattedContent = content;
    
    // Format headers
    formattedContent = formattedContent.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold my-4">$1</h1>');
    formattedContent = formattedContent.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold my-3">$1</h2>');
    formattedContent = formattedContent.replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold my-2">$1</h3>');
    
    // Format paragraphs
    formattedContent = formattedContent.replace(/^(?!(#|<))(.*$)/gm, (match) => {
      if (match.trim() === '') return match;
      return `<p class="my-2">${match}</p>`;
    });
    
    return formattedContent;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к списку статей
        </Button>
        
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{article.viewCount} просмотров</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{article.commentCount} комментариев</span>
              </div>
            </div>
            
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex items-center mb-6">
              <div>
                <p className="font-medium">{article.author}</p>
              </div>
            </div>
          </header>
          
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
          />
          
          <Separator className="my-10" />
          
          <section className="mt-10">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Комментарии ({article.commentCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <CommentForm 
                  articleId={article.id} 
                  onCommentAdded={handleCommentAdded} 
                />
                
                <div className="mt-8 space-y-6">
                  {isLoadingComments ? (
                    <p className="text-center text-muted-foreground">Загрузка комментариев...</p>
                  ) : comments.length === 0 ? (
                    <p className="text-center text-muted-foreground">Пока нет комментариев. Будьте первым, кто оставит комментарий!</p>
                  ) : (
                    comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        articleId={article.id}
                        onCommentAdded={handleCommentAdded}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
