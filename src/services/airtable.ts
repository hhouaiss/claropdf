import Airtable from 'airtable';

const AIRTABLE_API_KEY = process.env.REACT_APP_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.REACT_APP_AIRTABLE_BASE_ID;

if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
  throw new Error('Airtable API key or Base ID is missing in environment variables');
}

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  publishDate: string;
  tags: string[];
}

export const getBlogPosts = async (): Promise<BlogPost[]> => {
    console.log('Fetching blog posts from Airtable...');
    const records = await base('Blog Posts').select().all();
    console.log('Raw Airtable records:', records);
    
    return records.map(record => {
      const post = {
        id: record.id,
        title: record.get('Title') as string,
        slug: record.get('Slug') as string,
        content: record.get('Content') as string, // Make sure this field name matches your Airtable setup
        author: record.get('Author') as string,
        publishDate: record.get('PublishDate') as string,
        tags: record.get('Tags') as string[] || []
      };
      console.log('Mapped post:', post);
      return post;
    });
  };

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    console.log('Fetching blog post with slug:', slug);
    const records = await base('Blog Posts').select({
      filterByFormula: `{Slug} = '${slug}'`
    }).all();
  
    if (records.length === 0) return null;
  
    const record = records[0];
    const tags = record.get('Tags');
    console.log('Raw tags from Airtable:', tags);
  
    const post = {
      id: record.id,
      title: record.get('Title') as string,
      slug: record.get('Slug') as string,
      content: record.get('Content') as string,
      author: record.get('Author') as string,
      publishDate: record.get('PublishDate') as string,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : []
    };
  
    console.log('Processed post:', post);
    return post;
  };