import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '../Layout';
import { getBlogPostBySlug, BlogPost } from '../../services/airtable';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!slug) return;
      try {
        const post = await getBlogPostBySlug(slug);
        console.log('Fetched article:', post); // For debugging
        setArticle(post);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('Failed to fetch article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  if (isLoading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>{error}</div></Layout>;
  if (!article) return <Layout><div>Article not found</div></Layout>;

  // Ensure tags is always an array
  const tags = Array.isArray(article.tags) ? article.tags : article.tags ? [article.tags] : [];

  return (
    <Layout>
      <Helmet>
        <title>{article.title} | ClaroPDF Blog</title>
        <meta name="description" content={`${article.title} - Learn about AI-powered PDF analysis on ClaroPDF`} />
      </Helmet>
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">&larr; Back to Blog</Link>

        <article>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="text-gray-600 mb-4">
            By {article.author} | Published on {new Date(article.publishDate).toLocaleDateString()}
          </div>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
          
          {tags.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </Layout>
  );
};

export default ArticlePage;