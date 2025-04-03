
import { useState } from 'react';
import { Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Reply } from 'lucide-react';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  articleId: string;
  onCommentAdded: (comment: Comment) => void;
  depth?: number;
}

export function CommentItem({ 
  comment, 
  articleId, 
  onCommentAdded,
  depth = 0 
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const maxDepth = 3; // Maximum depth for nested comments
  
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const handleReplyClick = () => {
    setIsReplying(true);
  };
  
  const handleCancelReply = () => {
    setIsReplying(false);
  };
  
  const handleCommentAdded = (newComment: Comment) => {
    onCommentAdded(newComment);
    setIsReplying(false);
  };

  return (
    <div className={`border-l-4 pl-4 ${depth === 0 ? 'border-blog-200' : depth === 1 ? 'border-blog-300' : 'border-blog-400'}`}>
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">{comment.author}</h4>
          <span className="text-xs text-muted-foreground">{formattedDate}</span>
        </div>
        <p className="text-sm mb-3">{comment.content}</p>
        {depth < maxDepth && (
          <div className="flex justify-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReplyClick}
              disabled={isReplying}
            >
              <Reply className="h-4 w-4 mr-1" />
              Ответить
            </Button>
          </div>
        )}
        
        {isReplying && (
          <div className="mt-4 mb-6">
            <CommentForm
              articleId={articleId}
              parentId={comment.id}
              onCommentAdded={handleCommentAdded}
              onCancel={handleCancelReply}
              isReply
            />
          </div>
        )}
      </div>
      
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-2 mt-4 space-y-4">
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleId={articleId}
              onCommentAdded={onCommentAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
