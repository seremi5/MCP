import Head from 'next/head';
import DynamicUIGenerator from '../components/DynamicUIGenerator';

export default function Home() {
  return (
    <div>
      <Head>
        <title>AI UI Generator - Claude × Vercel</title>
        <meta name="description" content="Transform Claude prompts into beautiful interfaces via MCP" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <main>
        <DynamicUIGenerator />
      </main>
    </div>
  );
}
