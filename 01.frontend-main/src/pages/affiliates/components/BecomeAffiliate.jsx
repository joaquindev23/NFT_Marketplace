import { CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid';

export default function BecomeAffiliate() {
  return (
    <div className="bg-white dark:bg-dark-bg px-6 pb-32 lg:px-8">
      <div className="mx-auto max-w-7xl text-base leading-7 text-gray-700">
        <p className="text-base font-semibold leading-7 dark:text-dark-accent text-iris-600">
          How to join the program
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-4xl">
          Become an Affiliate
        </h1>
        <p className="mt-6 text-xl leading-8 dark:text-dark-txt-secondary">
          Joining our affiliate program is a simple and straightforward process, offering two
          primary ways to get started. First, you can purchase the course you're interested in
          promoting, which will grant you access to the affiliate program for that specific course.
          Alternatively, you can receive an invitation from an existing affiliate who has bought the
          course, allowing you to purchase the course and gain access to promote it as well. By
          participating in our affiliate program, you'll have the opportunity to earn rewards while
          helping others discover valuable educational content.
        </p>
      </div>
    </div>
  );
}
