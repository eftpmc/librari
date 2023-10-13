"use client"

import { NextPage } from 'next';
import Head from 'next/head';
import styles from '@/styles/page.module.css';
import NovelPage from '@/components/novel-page';

const Page: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Home</title>
        <meta name="description" content="Description for my new page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Librari
        </h1>

        <NovelPage></NovelPage>
      </main>

      <footer className={styles.footer}>
        Powered by {' '}
        <a
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js
        </a>
      </footer>
    </div>
  );
}

export default Page;
