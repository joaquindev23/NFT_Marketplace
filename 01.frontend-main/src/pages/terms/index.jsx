import Head from 'next/head';
import Layout from '@/hocs/Layout';
import Header from './components/Header';
import InformationCollection from './components/InformationCollection';
import AccountTerms from './components/AccountTerms';
import PlanTerms from './components/PlanTerms';
import UsageTerms from './components/UsageTerms';
import PaymentTerms from './components/PaymentTerms';
import CancellationTerms from './components/CancellationTerms';
import IntellectualProperty from './components/IntellectualProperty';
import UserContent from './components/UserContent';
import ThirdParties from './components/ThirdParties';
import Indemnification from './components/Indemnification';
import Disclaimers from './components/Disclaimers';
import Limitation from './components/Limitation';
import Copyright from './components/Copyright';
import GeneralTerms from './components/GeneralTerms';

const SeoList = {
  title: 'Terms of Service - Boomslag NFT Marketplace',
  description:
    'Read our terms of service to learn about the legal agreements between you and Boomslag. Discover your rights and responsibilities as a user of our NFT marketplace platform.',
  href: '/',
  url: 'https://boomslag.com',
  keywords: 'boomslag terms of service',
  robots: 'all',
  author: 'BoomSlag',
  publisher: 'BoomSlag',
  image:
    'https://bafybeiaor24mrcurzyzccxl7xw46zdqpor4sfuhddl6tzblujoiukchxnq.ipfs.w3s.link/friends.png',
  twitterHandle: '@BoomSlag',
};

export default function Terms() {
  return (
    <div className="dark:bg-dark-bg">
      <Head>
        <title>{SeoList.title}</title>
        <meta name="description" content={SeoList.description} />

        <meta name="keywords" content={SeoList.keywords} />
        <link rel="canonical" href={SeoList.href} />
        <meta name="robots" content={SeoList.robots} />
        <meta name="author" content={SeoList.author} />
        <meta name="publisher" content={SeoList.publisher} />

        {/* Social Media Tags */}
        <meta property="og:title" content={SeoList.title} />
        <meta property="og:description" content={SeoList.description} />
        <meta property="og:url" content={SeoList.url} />
        <meta property="og:image" content={SeoList.image} />
        <meta property="og:image:width" content="1370" />
        <meta property="og:image:height" content="849" />
        <meta property="og:image:alt" content="Boomslag Thumbnail Image" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content={SeoList.title} />
        <meta name="twitter:description" content={SeoList.description} />
        <meta name="twitter:image" content={SeoList.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={SeoList.twitterHandle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <InformationCollection />
      <AccountTerms />
      <PlanTerms />
      <UsageTerms />
      <PaymentTerms />
      <CancellationTerms />
      <IntellectualProperty />
      <UserContent />
      <ThirdParties />
      <Indemnification />
      <Disclaimers />
      <Limitation />
      <Copyright />
      <GeneralTerms />
      <div className="pb-32" />
    </div>
  );
}

Terms.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};
