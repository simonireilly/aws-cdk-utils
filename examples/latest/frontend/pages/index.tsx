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
          Secrets were imported using{' '}
          <a href="https://github.com/simonireilly/aws-cdk-utils">cdk-Utils</a>
        </h1>

        <p className={styles.description}>
          Secrets were sent securely, from your AWS to vercel, with now steps in
          between. Also, when you delete the cloudformation stack, the preview
          secrets will be cleaned up for you 👍
        </p>

        <p className={styles.description}>
          Public secrets for this preview URL:
        </p>
        <pre>secret: {process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}</pre>
        <pre>timestamp: {process.env.NEXT_PUBLIC_UPDATED_TIMESTAMP_TEST}</pre>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
}
