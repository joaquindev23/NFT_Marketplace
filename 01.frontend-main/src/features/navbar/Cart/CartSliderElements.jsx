export const Container = ({ children }) => (
  <div className="fixed inset-0 overflow-hidden">{children}</div>
);

export const Absolute = ({ children }) => (
  <div className="absolute inset-0 overflow-hidden">{children}</div>
);

export const ChildContainer = ({ children }) => (
  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
    {children}
  </div>
);

export const Panel = ({ children }) => (
  <div className="flex h-full flex-col overflow-y-scroll dark:bg-dark-main bg-white py-6 shadow-xl">
    {children}
  </div>
);

export const TopPanel = ({ children }) => <div className="px-4 md:px-6">{children}</div>;

export const BottomPanel = ({ children }) => (
  <div className="relative mt-6 flex-1 px-4 md:px-6 space-y-2">{children}</div>
);

export const DialogContainer = ({ children }) => (
  <div className="flex items-start justify-between">{children}</div>
);

export const CartListUL = ({ children }) => (
  <div className="divide-y dark:divide-dark-second divide-gray-200 border-t dark:border-dark-second border-b border-gray-200">
    {children}
  </div>
);

export const OrderSection = ({ children }) => (
  <div className="mt-16 rounded-lg bg-gray-50 dark:bg-dark-second px-4 py-6 md:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
    {children}
  </div>
);
