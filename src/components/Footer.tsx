
import { Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} НовостиБлог. Все права защищены.
        </p>
        <div className="flex items-center gap-4">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground flex items-center hover:text-foreground"
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub Репозиторий
          </a>
        </div>
      </div>
    </footer>
  );
}
