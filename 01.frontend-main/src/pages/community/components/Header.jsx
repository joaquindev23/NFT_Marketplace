export default function Header() {
  return (
    <div className="px-6  lg:px-8">
      <div className="absolute  inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <svg
          className="relative left-[calc(50%-11rem)] -z-10 h-[21.1875rem] max-w-none -translate-x-1/2 rotate-[30deg] sm:left-[calc(50%-30rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#gradient1)"
            fillOpacity=".3"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="gradient1"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00c6ff" />
              <stop offset="0.5" stopColor="#fdffa3" />
              <stop offset="1" stopColor="#7a2aff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="mx-auto max-w-2xl py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-6xl">
            Join the Boomslag Community
          </h1>
          <p className="mt-6 text-lg leading-8 dark:text-dark-txt-secondary text-gray-600">
            Looking to learn more about Boomslag and Praedium? No matter where you’re from, here are
            the best resources available in order to get educated, and become part of the Community.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="https://blog.boomslag.com"
              target="_blank"
              className="rounded-full bg-dark dark:bg-dark-primary px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-iris-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-600"
            >
              Read the blog
            </a>
            <a
              href="https://discord.gg/GtffBZWWk2"
              target="_blank"
              className="text-sm font-semibold leading-6 dark:text-dark-txt text-gray-900"
            >
              Join Devs Discord <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
        <svg
          className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
          viewBox="0 0 1155 678"
        >
          <path
            fill="url(#gradient2)"
            fillOpacity=".3"
            d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
          />
          <defs>
            <linearGradient
              id="gradient2"
              x1="1155.49"
              x2="-78.208"
              y1=".177"
              y2="474.645"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#ffcd88" />
              <stop offset={0.5} stopColor="#ffcdcc" />
              <stop offset={1} stopColor="#1f932ae7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
