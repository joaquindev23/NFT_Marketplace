// eslint-disable-next-line
export const Container = ({ children }) => (
  <nav className="bg-white py-[6px] border-b dark:border-dark-second border-gray-300 dark:bg-dark-main shadow-navbar md:hidden block">
    {children}
  </nav>
);
// eslint-disable-next-line
export const Nav = ({ children }) => <nav className="mx-auto max-w-7xl px-2">{children}</nav>;
// eslint-disable-next-line
export const LeftMenu = ({ children }) => (
  <div className="absolute inset-y-0 left-0 flex items-center">{children}</div>
);
// eslint-disable-next-line
export const LeftMenuButton = ({ children }) => (
  <button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400  hover:text-gray-500">
    {children}
  </button>
);
// eslint-disable-next-line
export const MiddleMenu = ({ children }) => (
  <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
    {children}
  </div>
);
// eslint-disable-next-line
export const MiddleLogo = ({ children }) => <div className="flex items-center">{children}</div>;
// eslint-disable-next-line
export const RightMenu = ({ children }) => (
  <ul className="absolute inset-y-0 right-0 flex items-center mr-2 space-x-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
    {children}
  </ul>
);
// eslint-disable-next-line
export const CartContainer = ({ children }) => (
  <div className="fixed inset-0 overflow-hidden">{children}</div>
);
// eslint-disable-next-line
export const Absolute = ({ children }) => (
  <div className="absolute inset-0 overflow-hidden">{children}</div>
);
// eslint-disable-next-line
export const ChildContainer = ({ children }) => (
  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
    {children}
  </div>
);
// eslint-disable-next-line
export const Panel = ({ children }) => (
  <div className="flex h-full flex-col overflow-y-scroll dark:bg-dark-main bg-white py-6 shadow-xl">
    {children}
  </div>
);
// eslint-disable-next-line
export const TopPanel = ({ children }) => <div className="px-4 md:px-6">{children}</div>;
// eslint-disable-next-line
export const BottomPanel = ({ children }) => (
  <div className="relative mt-6 flex-1 px-4 md:px-6 space-y-2">{children}</div>
);
// eslint-disable-next-line
export const DialogContainer = ({ children }) => (
  <div className="flex items-start justify-between">{children}</div>
);
// eslint-disable-next-line
export const CartListUL = ({ children }) => (
  <div className="divide-y dark:divide-dark-second divide-gray-200 border-t dark:border-dark-second border-b border-gray-200">
    {children}
  </div>
);
// eslint-disable-next-line
export const OrderSection = ({ children }) => (
  <div className="mt-16 rounded-lg bg-gray-50 dark:bg-dark-second px-4 py-6 md:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
    {children}
  </div>
);
