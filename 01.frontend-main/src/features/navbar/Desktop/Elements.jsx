// eslint-disable-next-line
export const Container = ({ children }) => (
  <header className="hidden md:block md:static md:overflow-y-visible  max-w-full mx-auto  px-4 sm:px-6 md:px-8">
    {children}
  </header>
);
// eslint-disable-next-line
export const Header = ({ children }) => (
  <div className="relative w-full flex justify-between md:gap-8">{children}</div>
);
// eslint-disable-next-line
export const LogoContainer = ({ children }) => (
  <div className="flex sm:absolute md:inset-y-0 md:left-0 md:static">{children}</div>
);
// eslint-disable-next-line
export const Logo = ({ children }) => <div className="flex items-center">{children}</div>;
// eslint-disable-next-line
export const Categories = ({ children }) => (
  <div className="inline-flex items-center border-b-2 ml-6 -mr-2 dark:border-dark-main border-white hover:text-iris-600  px-1 pt-1 text-sm text-gray-900">
    {children}
  </div>
);
// eslint-disable-next-line
export const SearchContainer = ({ children }) => (
  <div className="min-w-0 flex-1 sm:px-8 md:px-0 flex items-center w-full py-3 md:mx-auto md:max-w-full lg:mx-0 lg:max-w-none">
    {children}
  </div>
);
// eslint-disable-next-line
export const RightMenuContainer = ({ children }) => (
  <div className="flex items-center justify-end space-x-4">{children}</div>
);
// eslint-disable-next-line
export const NavbarLink = ({ children }) => (
  <div className="hidden lg:inline-flex items-center mr-1 px-1  text-base font-medium text-gray-900 dark:text-dark-txt  hover:text-iris-500">
    {children}
  </div>
);
