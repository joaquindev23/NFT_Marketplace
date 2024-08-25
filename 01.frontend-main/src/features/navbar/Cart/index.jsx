import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Transition, Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { closeCart } from '@/redux/actions/cart/cart';

import {
  Absolute,
  ChildContainer,
  Container,
  DialogContainer,
  Panel,
  TopPanel,
} from './CartSliderElements';

export default function CartSlider() {
  const dispatch = useDispatch();
  // Cart Redux Variables
  const cartIsOpen = useSelector((state) => state.cart.open);

  return (
    <div>
      <Transition.Root show={cartIsOpen} as="div">
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => {
            closeCart();
          }}
        >
          <div className="fixed inset-0" />
          <Container>
            <Absolute>
              <ChildContainer>
                <Transition.Child
                  as="div"
                  enter="transform transition ease-in-out duration-500 md:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 md:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <Panel>
                      <TopPanel>
                        <DialogContainer>
                          <Dialog.Title className="font-semibold text-lg text-gray-900 dark:text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="mb-1 mr-2 inline-flex h-6 w-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                              />
                            </svg>
                            Your Cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md text-gray-600 hover:text-gray-500 focus:outline-none dark:text-dark-txt "
                              onClick={() => dispatch()}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </button>
                          </div>
                        </DialogContainer>
                      </TopPanel>
                    </Panel>
                  </Dialog.Panel>
                </Transition.Child>
              </ChildContainer>
            </Absolute>
          </Container>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
