import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Vercel Secret Sync</title>
        <meta name="description" content="cdk-utils - Vercel Secret Sync" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Vercel Secret Sync by{' '}
          <a href="https://github.com/simonireilly/aws-cdk-utils">cdk-Utils</a>
        </h1>

        <p className={styles.description}>
          Secrets were sent securely, from your AWS Account to vercel, with now
          steps in between.
        </p>

        <pre>secret: {process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}</pre>
        <pre>timestamp: {process.env.NEXT_PUBLIC_UPDATED_TIMESTAMP_TEST}</pre>
        <p className={styles.description}>
          Also, when you delete the cloudformation stack, the preview secrets
          will be cleaned up for you 👍
        </p>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/simonireilly/aws-cdk-utils"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Simon
        </a>
      </footer>
    </div>
  );
}
