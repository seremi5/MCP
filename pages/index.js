// pages/index.js
import Head from 'next/head';
import DynamicV0ComponentGenerator from '../components/DynamicV0ComponentGenerator';

export default function Home() {
  return (
    <>
      <Head>
        <title>v0.dev AI Component Generator - Claude × MCP × Vercel</title>
        <meta name="description" content="Generate v0.dev-style React components from Claude prompts via MCP" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      
      <DynamicV0ComponentGenerator />
    </>
  );
}
