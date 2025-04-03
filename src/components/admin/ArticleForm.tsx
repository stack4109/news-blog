
import { useState } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X } from 'lucide-react';
import { articlesApi } from '@/services/api';

interface ArticleFormProps {
  article?: Article;
  onSave: (article: Article) => void;
  onCancel: () => void;
}

export function ArticleForm({ article, onSave, onCancel }: ArticleFormProps) {
  const [title, setTitle] = useState(article?.title || '');
  const [summary, setSummary] = useState(article?.summary || '');
  const [content, setContent] = useState(article?.content || '');
  const [image, setImage] = useState(article?.image || '');
  const [author, setAuthor] = useState(article?.author || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !summary || !content || !image || !author) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let savedArticle: Article | undefined;
      
      if (article) {
        // Update existing article
        savedArticle = await articlesApi.updateArticle(article.id, {
          title,
          summary,
          content,
          image,
          author
        });
      } else {
        // Create new article
        savedArticle = await articlesApi.createArticle({
          title,
          summary,
          content,
          image,
          author,
          publishedAt: new Date().toISOString()
        });
      }
      
      if (savedArticle) {
        onSave(savedArticle);
      }
    } catch (error) {
      console.error('Failed to save article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{article ? 'Редактировать статью' : 'Новая статья'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="summary">Краткое описание</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">URL изображения</Label>
            <Input
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
            {image && (
              <div className="mt-2 aspect-video w-full max-w-sm overflow-hidden rounded-md">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Автор</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Содержание статьи</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px]"
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Отмена
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {article ? 'Сохранить изменения' : 'Опубликовать статью'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
