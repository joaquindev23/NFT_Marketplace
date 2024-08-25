import Link from 'next/link';

export default function TeachCTA() {
  return (
    <div className="">
      <div className="py-24 px-6 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-4xl">
            Become a seller today and monetize your skills and products as NFTs!
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 dark:text-dark-txt-secondary text-gray-600">
            With our platform, you can easily create and sell online courses and physical products
            as ERC1155 NFTs. Take advantage of the booming NFT market and start earning money today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/teach"
              className="rounded-md bg-iris-600 dark:bg-dark-primary px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-iris-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-600"
            >
              Get started
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold leading-6 text-gray-900 dark:text-dark-txt"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
