import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Dashboard from './Dashboard';
import Layout from './Layout';
import { Download, Share2, ChevronLeft, FileText, LayoutDashboard } from 'lucide-react';
import LoadingAnimation from './LoadingAnimation';

const AnalysisResultPage: React.FC = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { id } = useParams<{ id?: string }>();
	const [analysisResult, setAnalysisResult] = useState<any>(null);
	const [pdfName, setPdfName] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showRawData, setShowRawData] = useState(false);
	
	useEffect(() => {
		const fetchAnalysis = async () => {
			if (id) {
				// Fetch saved analysis
				const { data, error } = await supabase
				.from('pdf_analyses')
				.select('*')
				.eq('id', id)
				.single();
				
				if (error) {
					console.error('Error fetching analysis:', error);
					setError('Failed to fetch analysis');
					setIsLoading(false);
					return;
				}
				
				if (data) {
					setAnalysisResult(data.analysis_result);
					setPdfName(data.pdf_name);
				} else {
					setError('Analysis not found');
				}
			} else if (location.state?.analysisResult) {
				// New analysis
				setAnalysisResult(location.state.analysisResult);
				setPdfName(location.state.pdfName || 'Unnamed PDF');
				
				// Save new analysis
				const { data: { session } } = await supabase.auth.getSession();
				const user = session?.user;
				if (user) {
					const { error: insertError } = await supabase.from('pdf_analyses').insert({
						user_id: user.id,
						pdf_name: location.state.pdfName || 'Unnamed PDF',
						analysis_result: location.state.analysisResult,
					});
					
					if (insertError) {
						console.error('Error saving analysis result:', insertError);
					}
				}
			} else {
				setError('No analysis result available');
			}
			setIsLoading(false);
		};
		
		fetchAnalysis();
	}, [id, location.state]);
	
	if (isLoading) {
		return (
			<Layout>
			<LoadingAnimation />
			</Layout>
		);
	}
	
	if (error) {
		return (
			<Layout>
			<div className="container mx-auto px-4 py-8">
			<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
			<strong className="font-bold">Error: </strong>
			<span className="block sm:inline">{error}</span>
			</div>
			<Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center">
			<ChevronLeft className="mr-2" size={20} />
			Return to Home
			</Link>
			</div>
			</Layout>
		);
	}
	
	if (!analysisResult) {
		return (
			<Layout>
			<div className="container mx-auto px-4 py-8">
			<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4" role="alert">
			<strong className="font-bold">Notice: </strong>
			<span className="block sm:inline">No analysis result available. Please return to the home page and try again.</span>
			</div>
			<Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center">
			<ChevronLeft className="mr-2" size={20} />
			Return to Home
			</Link>
			</div>
			</Layout>
		);
	}
	
	return (
		<Layout>
		<div className="container mx-auto px-4 py-8">
		<div className="flex justify-between items-center mb-6">
		<h1 className="text-3xl font-bold">Analysis Result: {pdfName}</h1>
		<div className="flex space-x-4">
		<button className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Download">
		<Download size={24} />
		</button>
		<button className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Share">
		<Share2 size={24} />
		</button>
		</div>
		</div>
		
		<div className="mb-6">
		<button 
		onClick={() => setShowRawData(!showRawData)}
		className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
		>
		{showRawData ? <LayoutDashboard className="mr-2" size={20} /> : <FileText className="mr-2" size={20} />}
		{showRawData ? 'Show Dashboard' : 'Show Raw Data'}
		</button>
		</div>
		
		{showRawData ? (
			<pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
			{JSON.stringify(analysisResult, null, 2)}
			</pre>
		) : (
			<Dashboard analysisResult={analysisResult} />
		)}
		
		<div className="mt-8 flex justify-between items-center">
		<Link to="/" className="text-blue-500 hover:text-blue-700 flex items-center">
		<ChevronLeft className="mr-2" size={20} />
		Return to Home
		</Link>
		<button
		onClick={() => navigate('/')}
		className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center"
		>
		<FileText className="mr-2" size={20} />
		Analyze Another PDF
		</button>
		</div>
		</div>
		</Layout>
	);
};

export default AnalysisResultPage;