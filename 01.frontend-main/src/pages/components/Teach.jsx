import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';

const features = [
  {
    name: 'Lightning-Fast Payments',
    description:
      'Get paid instantly for your courses using our cutting-edge blockchain technology. No more waiting for 60 days to receive your earnings.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Unlock Your Earnings Potential',
    description:
      'With our decentralized approach, enjoy greater financial freedom and the ability to tap into new revenue streams through a secondary marketplace.',
    icon: LockClosedIcon,
  },
  {
    name: 'Revolutionary NFT Courses',
    description:
      'Leverage the power of NFTs to create unique, valuable, and easily tradable course content. Benefit from royalties on resales and build a lasting legacy.',
    icon: ServerIcon,
  },
];

export default function Teach() {
  return (
    <div>
      <div className="overflow-hidden  pb-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:ml-auto lg:pt-4 lg:pl-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-iris-600 dark:text-dark-accent">
                  Become an Instructor on Boomslag
                </h2>
                <p className="mt-2 text-3xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-4xl">
                  Share Your Expertise with the World
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-dark-txt-secondary">
                  Generate passive income in MATIC while making a meaningful impact.
                </p>
                <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  {features.map((feature) => (
                    <div key={feature.name} className="relative pl-9">
                      <dt className="inline font-semibold text-gray-900 dark:text-dark-txt">
                        <feature.icon
                          className="absolute top-1 left-1 h-5 w-5 text-forest-green-200"
                          aria-hidden="true"
                        />
                        {feature.name}
                      </dt>{' '}
                      <dd className="inline dark:text-dark-txt-secondary">{feature.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <div className="flex items-start justify-end lg:order-first">
              <Image
                src="/assets/img/joink.png"
                alt="Product screenshot"
                className="w-[48rem] max-w-none rounded-xl "
                width={2432}
                height={1442}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
