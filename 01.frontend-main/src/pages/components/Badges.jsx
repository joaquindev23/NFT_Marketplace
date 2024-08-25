import Link from 'next/link';
import Image from 'next/image';

export default function Badges() {
  return (
    <div className=" pb-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          <img
            className="dark:hidden flex col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="/assets/img/badges/lcc.png"
            alt="LCCPERU"
            width={200}
            height={200}
          />
          <img
            className="hidden dark:flex col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="/assets/img/badges/lccWhite.png"
            alt="LCCPERU"
            width={200}
            height={200}
          />
          {/* <Image
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg"
            alt="Reform"
            width={158}
            height={48}
          />
          <Image
            className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg"
            alt="Tuple"
            width={158}
            height={48}
          />
          <Image
            className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg"
            alt="SavvyCal"
            width={158}
            height={48}
          />
          <Image
            className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
            src="https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg"
            alt="Statamic"
            width={158}
            height={48}
          /> */}
        </div>
        <div className="mt-16 flex justify-center">
          <div className="relative rounded-full bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-1.5 text-sm leading-6 text-gray-900 shadow-md ring-1 ring-inset ring-purple-300/50 dark:bg-gradient-to-r dark:from-dark-second dark:to-dark-third dark:text-dark-txt dark:ring-inset dark:ring-dark-border">
            <span className="hidden font-semibold text-gray-800 md:inline dark:text-dark-txt-secondary">
              5% of every transaction is donated to raise awareness and funds for cancer research
            </span>
            <Link
              href="/ecosystem"
              className="ml-2 font-semibold text-iris-600 dark:text-dark-accent"
            >
              <span className="absolute inset-0" aria-hidden="true" /> Read about our donations.{' '}
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
