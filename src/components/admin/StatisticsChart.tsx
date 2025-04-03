
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatisticsData } from '@/types';
import { statisticsApi } from '@/services/api';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export function StatisticsChart() {
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'views' | 'comments'>('views');
  const [activePeriod, setActivePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await statisticsApi.getStatisticsData();
        setStatistics(data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Subscribe to real-time updates
    const unsubscribe = statisticsApi.subscribeToUpdates((data) => {
      setStatistics(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const prepareChartData = () => {
    if (!statistics) return [];

    const chartData = [];
    const values = statistics[activeTab][activePeriod];
    const labels = activePeriod === 'daily' 
      ? statistics.views.labels
      : activePeriod === 'weekly'
        ? ['Неделя 1', 'Неделя 2', 'Неделя 3', 'Неделя 4']
        : ['Январь', 'Февраль', 'Март'];

    for (let i = 0; i < values.length; i++) {
      chartData.push({
        name: labels[i],
        value: values[i]
      });
    }

    return chartData;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Статистика</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="views"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'views' | 'comments')}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="views">Просмотры</TabsTrigger>
            <TabsTrigger value="comments">Комментарии</TabsTrigger>
          </TabsList>
          
          <TabsContent value="views" className="space-y-4">
            <div className="flex justify-center">
              <Tabs 
                defaultValue="daily"
                value={activePeriod}
                onValueChange={(value) => setActivePeriod(value as 'daily' | 'weekly' | 'monthly')}
              >
                <TabsList>
                  <TabsTrigger value="daily">Дневная</TabsTrigger>
                  <TabsTrigger value="weekly">Недельная</TabsTrigger>
                  <TabsTrigger value="monthly">Месячная</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="h-[300px] mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Загрузка данных...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareChartData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Просмотры"
                      stroke="#0172c4"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="comments" className="space-y-4">
            <div className="flex justify-center">
              <Tabs 
                defaultValue="daily"
                value={activePeriod}
                onValueChange={(value) => setActivePeriod(value as 'daily' | 'weekly' | 'monthly')}
              >
                <TabsList>
                  <TabsTrigger value="daily">Дневная</TabsTrigger>
                  <TabsTrigger value="weekly">Недельная</TabsTrigger>
                  <TabsTrigger value="monthly">Месячная</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="h-[300px] mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Загрузка данных...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareChartData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Комментарии"
                      stroke="#36acf6"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
