
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { commentsApi } from '@/services/api';
import { Comment } from '@/types';
import { Reply, Send, X } from 'lucide-react';

interface CommentFormProps {
  articleId: string;
  parentId?: string | null;
  onCommentAdded: (comment: Comment) => void;
  onCancel?: () => void;
  isReply?: boolean;
}

export function CommentForm({ 
  articleId, 
  parentId = null, 
  onCommentAdded,
  onCancel,
  isReply = false 
}: CommentFormProps) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author.trim() || !content.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newComment = await commentsApi.addComment({
        articleId,
        parentId,
        author,
        content
      });
      
      onCommentAdded(newComment);
      setAuthor('');
      setContent('');
      
      if (onCancel && isReply) {
        onCancel();
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Ваше имя"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReply ? "Напишите ваш ответ..." : "Оставьте комментарий..."}
          className="min-h-[100px]"
          required
        />
      </div>
      <div className="flex gap-2 justify-end">
        {isReply && onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Отмена
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isReply ? (
            <>
              <Reply className="h-4 w-4 mr-2" />
              Ответить
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Отправить
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
