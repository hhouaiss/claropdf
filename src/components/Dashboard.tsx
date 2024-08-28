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
  isAuthenticated: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisResult, isAuthenticated }) => {
  const truncateForUnauthenticated = (text: string) => {
    if (isAuthenticated) return text;
    return text.slice(0, 100) + '...';
  };

  const limitArrayForUnauthenticated = <T,>(arr: T[], limit: number) => {
    if (isAuthenticated) return arr;
    return arr.slice(0, limit);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Summary */}
      <div className="mb-6">
        <BigCard 
          title="Summary" 
          content={truncateForUnauthenticated(analysisResult.summary.text)} 
          pageReference={analysisResult.summary.page}
        />
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {limitArrayForUnauthenticated(analysisResult.key_insights, 2).map((insight, index) => (
          <MediumCard
            key={index}
            title={insight.title}
            explanation={truncateForUnauthenticated(insight.explanation)}
            pageReference={insight.page}
          />
        ))}
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {limitArrayForUnauthenticated(analysisResult.key_statistics, 2).map((stat, index) => (
          <SmallCard
            key={index}
            number={stat.value}
            explanation={stat.label}
            pageReference={stat.page}
          />
        ))}
      </div>

      {/* Action Items */}
      {isAuthenticated && (
        <div className="mb-6">
          <BigCard 
            title="Action Items" 
            content={analysisResult.action_items.map(item => `${item.text} (Page ${item.page})`).join('\n')} 
            pageReference={analysisResult.action_items[0]?.page || 0}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;