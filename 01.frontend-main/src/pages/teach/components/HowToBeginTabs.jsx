import { Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function HowToBeginTabs() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:py-32 py-20 sm:px-6 lg:px-8">
      {/* We've used 3xl here, but feel free to try other max-widths based on your needs */}
      <div className="mx-auto max-w-4xl">
        {/* Content goes here */}
        <div className="mx-auto max-w-7xl ">
          <div className="text-center">
            <p className="font-bold mt-1 text-3xl tracking-tight dark:text-dark-txt text-gray-900 sm:text-4xl lg:text-5xl">
              How to begin
            </p>
          </div>
        </div>
        <Tab.Group>
          <Tab.List className=" mt-8 -mb-px grid space-x-1 space-y-1 rounded-xl p-1 sm:flex sm:space-x-2 sm:space-y-0">
            <Tab
              className={({ selected }) =>
                classNames(
                  'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                  '',
                  selected
                    ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                    : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                )
              }
            >
              Plan your curriculum
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                  '',
                  selected
                    ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                    : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                )
              }
            >
              Record your video
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'col-span-1 w-full py-2.5 text-lg leading-5 md:col-span-2',
                  '',
                  selected
                    ? 'flex items-center justify-center space-x-2 border-b-4 border-gray-900 p-1 font-bold text-black focus:outline-none dark:text-dark-txt dark:border-dark-primary'
                    : 'flex items-center justify-center border-b-2 border-gray-50 p-1 font-semibold text-gray-600 hover:border-gray-200 dark:border-dark-third dark:text-dark-txt dark:hover:border-dark-border md:space-x-2',
                )
              }
            >
              Launch your course
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="relative mt-12 ">
                <div className="relative px-4 pb-16 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                  <div className="lg:pr-8">
                    <div className="mx-auto max-w-prose text-base lg:ml-auto lg:mr-0 lg:max-w-lg">
                      <p className="mt-2 text-lg dark:text-dark-txt-secondary text-gray-900">
                        Get started with your passion and expertise! Use our incredible Marketplace
                        Insights tool to discover the most promising topics to teach.
                      </p>
                      <p className="mt-2 text-lg dark:text-dark-txt-secondary text-gray-900">
                        Your unique teaching style and personality are what make your course special
                        – embrace it and let it shine!
                      </p>
                      <h2 className="mt-6 text-xl font-bold dark:text-dark-txt">
                        Our support for your success
                      </h2>
                      <p className="mt-2 text-lg dark:text-dark-txt-secondary text-gray-900">
                        Don't worry, we've got your back! We provide extensive resources to help you
                        create your first course with ease. Our intuitive instructor dashboard and
                        well-structured curriculum pages make organization a breeze.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="lg:absolute lg:inset-0">
                  <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                      className="h-56 w-full object-cover lg:absolute lg:h-full"
                      src="https://bafybeiesc24rn642cvxfstcubui4ae254e7wf3lanoro7khd5uerto6c7e.ipfs.w3s.link/plan_curriculum.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="relative mt-12 ">
                <div className="relative px-4 pb-16 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                  <div className="lg:pr-8">
                    <div className="mx-auto max-w-prose text-base lg:ml-auto lg:mr-0 lg:max-w-lg">
                      <p className="mt-2 text-lg dark:text-dark-txt-secondary text-gray-900">
                        Getting started is easy with basic tools like a smartphone or DSLR camera.
                        Just add a high-quality microphone, and you're all set to create engaging
                        content!
                      </p>
                      <p className="mt-2 text-lg dark:text-dark-txt-secondary text-gray-900">
                        Camera-shy? No problem! Simply capture your screen instead. We recommend a
                        minimum of two hours of video content for a paid course to provide optimal
                        value.
                      </p>
                      <h2 className="mt-6 text-xl font-bold dark:text-dark-txt">
                        Our commitment to your success
                      </h2>
                      <p className="mt-2 text-lg dark:text-dark-txt-secondary text-gray-900">
                        We're here to support you every step of the way! Our dedicated support team
                        is always available to help you throughout the process and provide valuable
                        feedback on test videos.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="lg:absolute lg:inset-0">
                  <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                      className="h-56 w-full object-cover lg:absolute lg:h-full"
                      src="https://bafybeidcoujui2npttcrxa7nqo6cssehreoqpqzp6dirfnzc2zrlazta24.ipfs.w3s.link/production.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="relative mt-12 ">
                <div className="relative px-4 pb-16 sm:px-6 lg:mx-auto lg:grid lg:max-w-7xl lg:grid-cols-2 lg:px-8">
                  <div className="lg:pr-8">
                    <div className="mx-auto max-w-prose text-base lg:ml-auto lg:mr-0 lg:max-w-lg">
                      <p className="mt-2 text-lg dark:text-dark-txt-secondary text-gray-900">
                        Kickstart your course's success by promoting it through social media and
                        leveraging your professional networks to gather those essential first
                        ratings and reviews.
                      </p>
                      <p className="mt-2 text-lg dark:text-dark-txt-secondary text-gray-900">
                        Your course will be featured in our marketplace, where you'll earn revenue
                        from each paid enrollment, giving you the opportunity to profit from your
                        expertise.
                      </p>
                      <h2 className="mt-6 text-xl font-bold dark:text-dark-txt">
                        Empowering your growth
                      </h2>
                      <p className="mt-2 text-lg dark:text-dark-txt-secondary text-gray-900">
                        We provide tools like custom coupons to help you offer attractive enrollment
                        incentives, while our global promotions drive traffic to your course. Plus,
                        there's even more potential for success when your course is chosen for
                        Boomslag Business.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="lg:absolute lg:inset-0">
                  <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
                    <img
                      className="h-56 w-full object-cover lg:absolute lg:h-full"
                      src="./assets/img/launch-your-course-2x-v3.jpg"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
