
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, BarChart3, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            className="font-bold text-xl text-blog-700"
            onClick={() => navigate('/')}
          >
            НовостиБлог
          </Button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Home className="mr-2 h-4 w-4" />
            Главная
          </Button>
          <Button variant="ghost" onClick={() => navigate('/admin')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Админ панель
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 bg-background border-t">
          <nav className="flex flex-col space-y-2">
            <Button variant="ghost" onClick={() => { navigate('/'); setIsMenuOpen(false); }}>
              <Home className="mr-2 h-4 w-4" />
              Главная
            </Button>
            <Button variant="ghost" onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Админ панель
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
