
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleList } from '@/components/admin/ArticleList';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { StatisticsChart } from '@/components/admin/StatisticsChart';
import { Article } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | undefined>(undefined);

  const handleEditArticle = (article: Article) => {
    setCurrentArticle(article);
    setShowForm(true);
  };

  const handleCreateArticle = () => {
    setCurrentArticle(undefined);
    setShowForm(true);
  };

  const handleSaveArticle = () => {
    setShowForm(false);
    setCurrentArticle(undefined);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
        
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="articles">Управление статьями</TabsTrigger>
            <TabsTrigger value="statistics">Статистика</TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="space-y-6">
            {showForm ? (
              <ArticleForm
                article={currentArticle}
                onSave={handleSaveArticle}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <ArticleList
                onEditArticle={handleEditArticle}
                onCreateArticle={handleCreateArticle}
              />
            )}
          </TabsContent>
          
          <TabsContent value="statistics">
            <StatisticsChart />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
}
