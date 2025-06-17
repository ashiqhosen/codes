import { getPageBySlug, renderBlocks } from '../utils/notion';

export default function Post({ post, content }) {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>{post.title}</h1>
      <pre>{content}</pre>
    </div>
  );
}

export async function getStaticPaths() {
  const posts = await getPageBySlug();
  const paths = posts.map(post => ({
    params: { slug: post.slug },
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { post, content } = await renderBlocks(params.slug);
  return { props: { post, content }, revalidate: 60 };
}
