import React, { useState } from 'react';

import Link from 'next/link';
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon, WalletIcon } from '@heroicons/react/24/outline';
import { Transition, Dialog } from '@headlessui/react';
import {
  BottomPanel,
  Container,
  DialogContainer,
  LeftMenu,
  LeftMenuButton,
  MiddleLogo,
  MiddleMenu,
  Nav,
  RightMenu,
  TopPanel,
} from './Elements';
import LogoImg from '@/components/LogoImg';
import GlobeButton from '@/components/GlobeButton';
import DarkModeButton from '@/components/DarkModeButton.jsx';
import CartComponent from '../Cart/CartComponent';
import NavSearchbar from '../Search/NavSearchbar';
import CartComponentButton from './CartComponent';
import { useSelector } from 'react-redux';
import AuthLinkNavigation from './AuthLinkNavigation';
import GuestLinkNavigation from './GuestLinkNavigation';

export default function MobileNavbar() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const myUser = useSelector((state) => state.auth.user);
  const myProfile = useSelector((state) => state.auth.profile);

  const [searchNav, setSearchNav] = useState(false);
  const [openPanel, setOpenPanel] = useState(false);

  const [effectLogin, setEffectLogin] = useState(false);
  const [effectRegister, setEffectRegister] = useState(false);
  const [effectWallet, setEffectWallet] = useState(false);

  return (
    <div>
      {/* Search Bar */}
      <div
        className={`
                ${searchNav ? 'flex' : 'hidden'}
                fixed z-30 w-full bg-white py-[14px] px-2 shadow-navbar dark:bg-dark-main md:hidden`}
      >
        <NavSearchbar />
        <button
          type="button"
          className="ml-2 mr-1"
          onClick={() => {
            setSearchNav(false);
          }}
        >
          <XMarkIcon className="h-5 w-5 text-gray-500 dark:text-dark-txt" aria-hidden="true" />
        </button>
      </div>
      <Container>
        <Nav>
          <div className="relative flex h-16 justify-between">
            <LeftMenu>
              <LeftMenuButton>
                {openPanel ? (
                  <XMarkIcon
                    onClick={() => {
                      setOpenPanel(false);
                    }}
                    className="block h-6 w-6"
                    aria-hidden="true"
                  />
                ) : (
                  <Bars3Icon
                    onClick={() => {
                      setOpenPanel(true);
                    }}
                    className="block h-6 w-6 dark:hover:text-dark-primary hover:text-iris-400 transition duration-100 ease-in-out"
                    aria-hidden="true"
                  />
                )}
              </LeftMenuButton>
              {/* Transition */}
              <Transition.Root show={openPanel} as="div">
                <Dialog as="div" className="relative z-10 flex md:hidden" onClose={setOpenPanel}>
                  <div className="fixed inset-0" />

                  <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-16">
                        <Transition.Child
                          as="div"
                          enter="transform transition ease-in-out duration-500 md:duration-700"
                          enterFrom="-translate-x-full"
                          enterTo="-translate-x-0"
                          leave="transform transition ease-in-out duration-500 md:duration-700"
                          leaveFrom="-translate-x-0"
                          leaveTo="-translate-x-full"
                        >
                          <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                            <div className="flex h-screen flex-col overflow-y-scroll bg-white py-6 shadow-xl dark:bg-dark-main">
                              <TopPanel>
                                <DialogContainer>
                                  {isAuthenticated ? (
                                    <ul className="px-2 flex space-x-2">
                                      {/* <CartComponentButton /> */}
                                      <Link
                                        href="/wallet"
                                        onMouseDown={() => {
                                          setEffectWallet(true);
                                        }}
                                        onMouseUp={() => setEffectWallet(false)}
                                        className={`${
                                          effectWallet &&
                                          'duration-400 animate-click hover:translate-x-0.5  hover:translate-y-0.5 hover:shadow-neubrutalism-sm '
                                        } inline-flex items-center justify-center 
                                          border
                                        border-dark-bg
                                        bg-white 
                                          p-2.5
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
                                        <WalletIcon
                                          className="h-5  w-5 md:h-5 md:w-5"
                                          aria-hidden="true"
                                        />
                                      </Link>
                                      <DarkModeButton />
                                    </ul>
                                  ) : (
                                    <div className="flex space-x-2">
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
                                    </div>
                                  )}
                                  <button
                                    onClick={() => {
                                      setOpenPanel(false);
                                    }}
                                    type="button"
                                  >
                                    <XMarkIcon className="h-5 w-auto" />
                                  </button>
                                </DialogContainer>
                              </TopPanel>
                              <BottomPanel>
                                {isAuthenticated ? (
                                  <AuthLinkNavigation
                                    isAuthenticated={isAuthenticated}
                                    myProfile={myProfile}
                                    myUser={myUser}
                                  />
                                ) : (
                                  <GuestLinkNavigation />
                                )}
                              </BottomPanel>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            </LeftMenu>
            <MiddleMenu>
              <MiddleLogo>
                <Link href="/">
                  <LogoImg />
                </Link>
              </MiddleLogo>
            </MiddleMenu>
            <RightMenu>
              <button
                type="button"
                onClick={() => setSearchNav(true)}
                className="  p-1 dark:hover:text-dark-primary hover:text-iris-400 text-gray-400 transition duration-100 ease-in-out "
              >
                <span className="sr-only">Search</span>
                <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
              </button>
              <CartComponent />
            </RightMenu>
          </div>
        </Nav>
      </Container>
    </div>
  );
}
