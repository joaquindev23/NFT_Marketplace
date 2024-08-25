import React from 'react';
import { WalletIcon, StarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Innovative Reward System',
    description:
      'Maximize your earnings with our unique, multi-tiered affiliate program. Increase your rewards as you progress through the ranks and unlock new levels of income potential.',
    href: '#',
    icon: WalletIcon,
  },
  {
    name: 'Dynamic Rank Progression',
    description:
      'Advance your rank based on the number of direct referrals and sales volume generated. Higher ranks unlock greater rewards, empowering you to grow your network and income.',
    href: '#',
    icon: StarIcon,
  },
  {
    name: 'Real-Time Sales Tracking',
    description:
      'Monitor your sales volume and referral performance with our intuitive dashboard. Stay informed and motivated as you watch your progress and earnings increase.',
    href: '#',
    icon: ChartBarIcon,
  },
];

export default function AffiliatesInfo() {
  return (
    <div className=" py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-4xl">
            The best affiliate program in Crypto
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-dark-txt-secondary">
            Participate in our gamified affiliate program to generate passive income while you
            explore the exhilarating universe of NFTs. Don't miss out – join us now and
            revolutionize your online marketplace experience!
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-2xl sm:mt-10 lg:mt-12 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-dark-txt">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg ">
                    <feature.icon className="h-8 w-8 text-almond-600" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-dark-txt-secondary">
                  <p className="flex-auto">{feature.description}</p>
                  {/* <p className="mt-6">
                    <a
                      href={feature.href}
                      className="text-sm font-semibold leading-6 text-iris-600"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </p> */}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
