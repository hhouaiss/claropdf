import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FaLightbulb, FaChartBar, FaClipboardList } from 'react-icons/fa';
import { IconContext } from "react-icons";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface KeyStatistic {
  label: string;
  value: string | number;
  page: number;
}

interface AnalysisResult {
  summary: { text: string; page: number };
  key_insights: Array<{ title: string; explanation: string; page: number }>;
  key_statistics: KeyStatistic[];
  takeaways?: Array<{ text: string; page: number }>;
}

interface DashboardProps {
  analysisResult: AnalysisResult;
}

const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options: IntersectionObserverInit = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
};

const useCountUp = (end: number, duration: number = 2000, start: number = 0) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!isAnimating) return;

    let startTime: number | null = null;
    const animateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);

    return () => setCount(start);
  }, [start, end, duration, isAnimating]);

  return { count, setIsAnimating };
};

const AnimatedNumber: React.FC<{ value: string | number }> = ({ value }) => {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const { count, setIsAnimating } = useCountUp(isNaN(numericValue) ? 0 : numericValue);
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.5 });

  useEffect(() => {
    if (isInView) {
      setIsAnimating(true);
    }
  }, [isInView, setIsAnimating]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {isNaN(numericValue) ? value : count.toLocaleString()}
    </motion.span>
  );
};

const Takeaways: React.FC<{ takeaways: Array<{ text: string; page: number }> }> = ({ takeaways = [] }) => {
  const [expandedTakeaway, setExpandedTakeaway] = useState<number | null>(null);

  const toggleTakeaway = (index: number) => {
    setExpandedTakeaway(expandedTakeaway === index ? null : index);
  };

  if (takeaways.length === 0) {
    return null; // Or return a message saying no takeaways are available
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-md p-6"
    >
      <h2 className="text-3xl font-bold mb-6 flex items-center">
        <FaLightbulb className="mr-2" /> Key Takeaways
      </h2>
      <div className="space-y-4">
        {takeaways.map((takeaway, index) => (
          <motion.div 
            key={index}
            className="bg-white bg-opacity-20 rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.02 }}
            layout
          >
            <div 
              className="p-4 flex items-start"
              onClick={() => toggleTakeaway(index)}
            >
              <span className="text-3xl font-bold mr-4">{index + 1}</span>
              <div>
                <p className="font-semibold">{takeaway.text}</p>
                {expandedTakeaway === index && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-sm"
                  >
                    Reference: Page {takeaway.page}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ analysisResult }) => {
  const renderStatChart = () => {
    const data = {
      labels: analysisResult.key_statistics.map(stat => stat.label),
      datasets: [
        {
          label: 'Key Statistics',
          data: analysisResult.key_statistics.map(stat => {
            const numericValue = typeof stat.value === 'number' 
              ? stat.value 
              : parseFloat(stat.value);
            return isNaN(numericValue) ? 0 : numericValue;
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Key Statistics',
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  return (
    <IconContext.Provider value={{ className: "inline-block mr-2 text-2xl" }}>
      <div className="container mx-auto p-4 space-y-6 text-white">
        {/* Summary Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md p-6"
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <FaLightbulb /> Summary
          </h2>
          <p className="text-lg">{analysisResult.summary.text}</p>
        </motion.div>

        {/* Key Insights Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-md p-6"
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <FaLightbulb /> Key Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysisResult.key_insights.map((insight, index) => (
              <div key={index} className="bg-white bg-opacity-20 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{insight.title}</h3>
                <p>{insight.explanation}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Key Statistics Section */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-md p-6"
        >
          <h2 className="text-3xl font-bold mb-4 flex items-center">
            <FaChartBar /> Key Statistics
          </h2>
          {renderStatChart()}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {analysisResult.key_statistics.map((stat, index) => (
              <motion.div 
                key={index}
                className="bg-white bg-opacity-20 p-4 rounded-lg text-center"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-4xl font-bold mb-2">
                  <AnimatedNumber value={stat.value} />
                </h3>
                <p>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Takeaways Section */}
        <Takeaways takeaways={analysisResult.takeaways || []} />
      </div>
    </IconContext.Provider>
  );
};

export default Dashboard;