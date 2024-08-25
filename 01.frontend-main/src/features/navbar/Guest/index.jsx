import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import DarkModeButton from '@/components/DarkModeButton.jsx';
import GlobeButton from '@/components/GlobeButton';
import CartComponent from '../Cart/CartComponent';

export default function GuestLinks() {
  const [effectLogin, setEffectLogin] = useState(false);
  const [effectRegister, setEffectRegister] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <ul className="flex space-x-2">
      {/* Cart */}
      <div className="mr-4 mt-2">
        <CartComponent isAuthenticated={isAuthenticated} />
      </div>
      <Link href="/auth/login">
        <button
          type="button"
          onMouseDown={() => {
            setEffectLogin(true);
          }}
          onMouseUp={() => setEffectLogin(false)}
          className={`${
            effectLogin &&
            'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm'
          } inline-flex items-center justify-center 
            border
          border-dark-bg
          bg-white 
            px-4 
            py-2 
            text-sm 
            font-bold 
            shadow-neubrutalism-sm 
            transition 
            duration-300 
            ease-in-out
            hover:-translate-x-0.5  hover:-translate-y-0.5 hover:bg-gray-50 hover:text-iris-600  
            hover:shadow-neubrutalism-md
          dark:border-dark-third dark:bg-dark-second dark:text-dark-txt dark:hover:text-white `}
        >
          Log in
        </button>
      </Link>
      <Link href="/auth/signup">
        <button
          type="button"
          onMouseDown={() => {
            setEffectRegister(true);
          }}
          onMouseUp={() => setEffectRegister(false)}
          className={`${
            effectRegister &&
            'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm'
          } inline-flex items-center justify-center 
          border
        border-dark-bg
        bg-white 
        px-4 
        py-2 
        text-sm 
        font-bold 
        shadow-neubrutalism-sm 
        transition 
        duration-300 
        ease-in-out
            hover:-translate-x-0.5  hover:-translate-y-0.5 hover:bg-gray-50 hover:text-iris-600  
            hover:shadow-neubrutalism-md
             dark:border-dark-third dark:bg-dark-second dark:text-dark-txt dark:hover:text-white `}
        >
          Sign up
        </button>
      </Link>
      <GlobeButton />
      <DarkModeButton />
    </ul>
  );
}
