import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '../Layout';
import { getBlogPosts, BlogPost } from '../../services/airtable';

const BlogListingPage: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        console.log('Fetching blog posts...');
        const posts = await getBlogPosts();
        console.log('Fetched posts:', posts);
        setBlogPosts(posts);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to fetch blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Function to strip HTML tags and get plain text
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Function to get a snippet of the content
  const getSnippet = (content: string, length: number = 150) => {
    const strippedContent = stripHtml(content);
    return strippedContent.length > length 
      ? strippedContent.substring(0, length) + '...' 
      : strippedContent;
  };

  if (isLoading) return <Layout><div>Loading...</div></Layout>;
  if (error) return <Layout><div>{error}</div></Layout>;

  return (
    <Layout>
      <Helmet>
        <title>Blog | ClaroPDF</title>
        <meta name="description" content="Explore articles about AI-powered PDF analysis, document processing, and more on the ClaroPDF blog." />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">ClaroPDF Blog</h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  <Link to={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">
                  {getSnippet(post.content)}
                </p>
                <div className="text-sm text-gray-500">
                  <span>{post.author}</span> • <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BlogListingPage;