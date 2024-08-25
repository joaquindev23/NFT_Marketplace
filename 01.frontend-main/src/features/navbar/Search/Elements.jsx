// eslint-disable-next-line
import { motion } from 'framer-motion';
import { useState } from 'react';

export const containerVariants = {
  expanded: {
    height: '3em',
  },
  collapsed: {
    height: '3em',
  },
};

export const containerTransition = {
  type: 'spring',
  damping: 22,
  stiffness: 150,
};

export const SearchInput = ({ ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <input
      {...props}
      className={`w-full h-full outline-none border-none pl-2 text-gray-400 text-sm font-light rounded-md bg-transparent focus:placeholder-opacity-0 transition-all duration-200 ${
        focused ? 'placeholder-opacity-0' : ''
      }`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

export const SearchIcon = () => <span className="text-gray-400 pt-0.5 text-lg align-middle"></span>;
// eslint-disable-next-line
export const SearchBarContainer = ({ children }) => (
  <motion.div className="w-full h-12 bg-white rounded-full border border-gray-400">
    {children}
  </motion.div>
);

export const CloseIcon = ({ zIndex = 1, ...props }) => (
  <motion.span
    className={`text-gray-400 text-xl align-middle transition-all duration-200 ease-in-out cursor-pointer hover:text-gray-600 ${
      zIndex === 1 ? '' : 'pointer-events-none'
    }`}
    style={{ zIndex }}
    {...props}
  />
);

export const SearchKeyIcon = ({ zIndex = 1, ...props }) => (
  <motion.span
    className={`text-gray-400 text-xl align-middle transition-all duration-200 ease-in-out cursor-pointer hover:text-gray-600`}
    style={{ zIndex }}
    {...props}
  />
);

export const LoadingWrapper = ({ children }) => (
  <div className="w-full h-full flex items-center justify-center">{children}</div>
);

export const WarningMessage = ({ children }) => (
  <span className="text-gray-400 text-sm flex items-center justify-center">{children}</span>
);
