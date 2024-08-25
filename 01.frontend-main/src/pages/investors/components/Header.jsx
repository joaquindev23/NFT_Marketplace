export default function Header() {
  return (
    <div className="relative isolate overflow-hidden bg-gradient-to-b dark:from-dark-bg from-iris-100/20 ">
      <div
        className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg]  shadow-xl dark:shadow-dark-third shadow-iris-600/10 ring-1 dark:ring-dark-border ring-iris-50 sm:-mr-80 lg:-mr-96"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-6 pb-32 pt-40 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight dark:text-dark-txt text-gray-900 sm:text-6xl lg:col-span-2 xl:col-auto">
            Boomslag Investors Overview
          </h1>
          <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
            <p className="text-lg leading-8 text-gray-600 dark:text-dark-txt-secondary">
              Here you may find some information about our company, company mission statement and
              more relevant investor metrics.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1567532900872-f4e906cbf06a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80"
            alt=""
            className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t dark:from-dark-bg from-white sm:h-32" />
    </div>
  );
}
