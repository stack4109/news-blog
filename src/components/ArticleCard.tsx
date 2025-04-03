
import { Article } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const navigate = useNavigate();
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => navigate(`/article/${article.id}`)}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <CardHeader className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{publishedDate}</span>
        </div>
        <CardTitle className="line-clamp-2 text-xl">{article.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-3">{article.summary}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t py-3">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{article.viewCount}</span>
        </div>
        <Badge variant="secondary" className="flex gap-1">
          <MessageSquare className="h-3 w-3" />
          <span>{article.commentCount}</span>
        </Badge>
      </CardFooter>
    </Card>
  );
}
