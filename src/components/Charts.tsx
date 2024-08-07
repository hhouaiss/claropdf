import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Bar, Pie, Line, Scatter } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement);

interface ChartSuggestion {
  title: string;
  type: string;
  description: string;
  data_points: string[];
}

interface ChartsProps {
  chartSuggestions: ChartSuggestion[];
  csvData: any[];
}

const Charts: React.FC<ChartsProps> = ({ chartSuggestions, csvData }) => {
  const generateChartData = (suggestion: ChartSuggestion) => {
    const { type, data_points } = suggestion;
    
    let labels = csvData.map(row => row[data_points[0]]);
    let data = csvData.map(row => parseFloat(row[data_points[1]]) || 0);

    if (type === 'pie') {
      const aggregated = csvData.reduce((acc, row) => {
        acc[row[data_points[0]]] = (acc[row[data_points[0]]] || 0) + (parseFloat(row[data_points[1]]) || 0);
        return acc;
      }, {});
      labels = Object.keys(aggregated);
      data = Object.values(aggregated);
    }

    // Limit to top 10 for bar charts
    if (type === 'bar' && labels.length > 10) {
      const sorted = labels.map((label, i) => ({ label, value: data[i] }))
                           .sort((a, b) => b.value - a.value)
                           .slice(0, 10);
      labels = sorted.map(item => item.label);
      data = sorted.map(item => item.value);
    }

    return {
      labels,
      datasets: [
        {
          label: suggestion.title,
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const renderChart = (suggestion: ChartSuggestion) => {
    const data = generateChartData(suggestion);
    switch (suggestion.type.toLowerCase()) {
      case 'bar':
        return <Bar data={data} />;
      case 'pie':
        return <Pie data={data} />;
      case 'line':
        return <Line data={data} />;
      case 'scatter':
        return <Scatter data={data} />;
      default:
        return <p>Unsupported chart type: {suggestion.type}</p>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Chart Suggestions</h2>
      {chartSuggestions && chartSuggestions.length > 0 ? (
        <div className="space-y-8">
          {chartSuggestions.map((chart, index) => (
            <div key={index} className="border p-4 rounded">
              <h3 className="text-lg font-semibold">{chart.title}</h3>
              <p className="text-sm text-gray-500">Type: {chart.type}</p>
              <p className="mt-2 mb-4">{chart.description}</p>
              <div className="h-64">
                {renderChart(chart)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No chart suggestions available for this data.</p>
      )}
    </div>
  );
};

export default Charts;