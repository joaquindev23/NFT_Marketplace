import Image from 'next/image';

export default function Header() {
  return (
    <div className="relative dark:bg-dark-bg ">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
        <div className="px-6 pt-24 pb-12 sm:pb-16 lg:col-span-7 lg:px-0  lg:pb-28 xl:col-span-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h1 className="mt-24 text-4xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:mt-10 sm:text-5xl">
              Join our Affiliate Program and Boost Your Earnings
            </h1>
            <p className="mt-6 text-lg leading-8 dark:text-dark-txt-secondary text-gray-600">
              Maximize your income by becoming a part of our affiliate program! Our smart
              contract-based Multi-Level Marketing (MLM) unilevel system supports rank progression,
              levels, and rewards using ERC1155 technology. Boost your earnings with up to X%
              commission, determined by our dynamic reward matrix and the DAO investor's word. Join
              our affiliate network and start reaping the benefits today!
            </p>
          </div>
        </div>
        <div className="relative lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
          <Image
            className="aspect-[3/2] w-full  object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
            src="/assets/img/joinAffiliates.png"
            alt=""
            width={250}
            height={250}
          />
        </div>
      </div>
    </div>
  );
}
