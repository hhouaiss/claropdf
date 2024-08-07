import React from 'react';
import SmallCard from './SmallCard';
import MediumCard from './MediumCard';
import BigCard from './BigCard';

interface AnalysisResult {
  summary: { text: string; page: number };
  key_insights: Array<{ title: string; explanation: string; page: number }>;
  key_statistics: Array<{ label: string; value: string; page: number }>;
  action_items: Array<{ text: string; page: number }>;
}

interface DashboardProps {
  analysisResult: AnalysisResult;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisResult }) => {
  const isError = analysisResult.summary.text.startsWith('Error:');

  // Ensure we always have 4 items for key_insights and 3 items for key_statistics
  const filledKeyInsights = [...analysisResult.key_insights, ...Array(4)].slice(0, 4);
  const filledKeyStatistics = [...analysisResult.key_statistics, ...Array(3)].slice(0, 3);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">PDF Analysis Dashboard</h1>
      
      {/* Summary */}
      <div className="mb-6">
        <BigCard 
          title="Summary" 
          content={analysisResult.summary.text} 
          pageReference={analysisResult.summary.page}
        />
      </div>
      
      {!isError && (
        <>
          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {filledKeyInsights.map((insight, index) => (
              <MediumCard
                key={index}
                title={insight?.title || 'N/A'}
                explanation={insight?.explanation || 'No data available'}
                pageReference={insight?.page || 0}
              />
            ))}
          </div>
          
          {/* Key Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {filledKeyStatistics.map((stat, index) => (
              <SmallCard
                key={index}
                number={stat?.value || 'N/A'}
                explanation={stat?.label || 'No data available'}
                pageReference={stat?.page || 0}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Action Items */}
      <div className="mb-6">
        <BigCard 
          title="Action Items" 
          content={analysisResult.action_items.map(item => `${item.text} (Page ${item.page})`).join('\n')} 
          pageReference={analysisResult.action_items[0]?.page || 0}
        />
      </div>
    </div>
  );
};

export default Dashboard;