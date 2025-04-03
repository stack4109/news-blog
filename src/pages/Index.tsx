
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleCard } from '@/components/ArticleCard';
import { Article } from '@/types';
import { articlesApi } from '@/services/api';
import { Separator } from '@/components/ui/separator';

export default function Index() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const data = await articlesApi.getArticles();
        setArticles(data);
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <section className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Новостной блог</h1>
          <p className="text-muted-foreground">
            Актуальные статьи о технологиях, науке и инновациях
          </p>
          <Separator className="my-4" />
        </section>
        
        <section>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Загрузка статей...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Статьи не найдены</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
