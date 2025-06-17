import { useState, useEffect } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { getDatabase } from '../utils/notion';

export default function Home({ posts }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    const fuse = new Fuse(posts, {
      keys: ['title', 'content'],
      threshold: 0.3
    });
    if (searchTerm.length > 1) {
      setFilteredPosts(fuse.search(searchTerm).map(result => result.item));
    } else {
      setFilteredPosts(posts);
    }
  }, [searchTerm, posts]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📝 My Notion Blog</h1>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      <ul>
        {filteredPosts.map(post => (
          <li key={post.id}>
            <Link href={`/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const posts = await getDatabase();
  return {
    props: { posts },
    revalidate: 60,
  };
}
