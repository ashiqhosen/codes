import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

export async function getDatabase() {
  const res = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Published',
      checkbox: { equals: true },
    },
    sorts: [{ property: 'Date', direction: 'descending' }],
  });

  const posts = await Promise.all(res.results.map(async (page) => {
    const contentBlocks = await notion.blocks.children.list({ block_id: page.id });
    const textContent = contentBlocks.results.map(b => b.paragraph?.text?.[0]?.plain_text || '').join(' ');
    return {
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || 'Untitled',
      slug: page.properties.Slug.rich_text[0]?.plain_text || '',
      content: textContent,
    };
  }));

  return posts;
}

export async function getPageBySlug() {
  const posts = await getDatabase();
  return posts;
}

export async function renderBlocks(slug) {
  const pages = await getDatabase();
  const post = pages.find(p => p.slug === slug);
  return { post, content: post.content };
}
