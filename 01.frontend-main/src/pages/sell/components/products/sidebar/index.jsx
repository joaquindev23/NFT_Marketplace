import React from 'react';
import Link from 'next/link';
import { AcademicCapIcon, ShoppingCartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

export default function Sidebar({ product, productUUID }) {
  const router = useRouter();
  const details = product && product.details;

  const targetAudienceBool = details && details.target_audience_bool;
  const features = details && details.features_bool;
  const supplyChain = details && details.supply_chain_bool;
  const delivery = details && details.delivery_bool;
  const warehousing = details && details.warehousing_bool;
  const valueProp = details && details.value_proposition_bool;
  const marketing = details && details.marketing_strategy_bool;
  const productDetails = details && details.product_details_bool;
  const accessibility = details && details.accessibility_bool;
  const documentation = details && details.documentation_bool;
  const landingPage = details && details.landing_page_bool;
  const pricing = details && details.pricing_bool;
  const promotions = details && details.promotions_bool;
  const shipping = details && details.shipping_bool;
  const messages = details && details.messages_bool;

  const plan = [
    {
      id: 1,
      uuid: '7cc5e209-10b5-4604-90ba-c7311dd74214',
      name: 'Target audience',
      href: `/sell/products/manage/goals/${productUUID}`,
      icon: AcademicCapIcon,
      current: router.pathname === `/sell/products/manage/goals/`,
      ready: targetAudienceBool,
    },

    {
      id: 2,
      uuid: 'd363dae0-622f-4194-b91a-8d72e19d76bd',
      name: 'Features',
      href: `/sell/products/manage/features/${productUUID}`,
      icon: ChatBubbleLeftIcon,
      current: router.pathname === `/sell/products/manage/features/`,
      ready: features,
    },
    {
      id: 3,
      uuid: '004666d1-1f72-4f22-bad2-c685362fbc93',
      name: 'Supply chain',
      href: `/sell/products/manage/supply_chain/${productUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname === `/sell/products/manage/supply_chain/`,
      ready: supplyChain,
    },
    {
      id: 4,
      uuid: '003686hj-hy68-d46h-asw3-c685123ftg86',
      name: 'Delivery',
      href: `/sell/products/manage/delivery/${productUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname === `/sell/products/manage/delivery/`,
      ready: delivery,
    },
    {
      id: 5,
      uuid: '243685hk-sd8u-sp09-sd6t-sdf41aw3tdcx',
      name: 'Warehousing',
      href: `/sell/products/manage/warehousing/${productUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname === `/sell/products/manage/warehousing/`,
      ready: warehousing,
    },
  ];

  const create = [
    {
      id: 1,
      uuid: '6b029a53-6124-4992-9702-3f900b1c27eb',
      name: 'Value proposition',
      href: `/sell/products/manage/proposition/${productUUID}`,
      icon: AcademicCapIcon,
      current: router.pathname === `/sell/products/manage/proposition/`,
      ready: valueProp,
    },
    {
      id: 2,
      uuid: '463b7572-cea4-4fa4-a88d-4f5c92d695ed',
      name: 'Marketing Strategy',
      href: `/sell/products/manage/marketing/${productUUID}`,
      icon: ChatBubbleLeftIcon,
      current: router.pathname === `/sell/products/manage/marketing/`,
      ready: marketing,
    },
    {
      id: 3,
      uuid: '7e25b991-8955-4dbf-95f7-981e91162416',
      name: 'Product Details',
      href: `/sell/products/manage/details/${productUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname === `/sell/products/manage/details/`,
      ready: productDetails,
    },
    {
      id: 4,
      uuid: 'ad18d088-3f98-4d89-ab13-292f7103893e',
      name: 'Accessibility',
      href: `/sell/products/manage/accessibility/${productUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname === `/sell/products/manage/accessibility/`,
      ready: accessibility,
    },
    {
      id: 5,
      uuid: '7a70be3f-89b6-4c7e-a878-7e8364101677',
      name: 'Documentation',
      href: `/sell/products/manage/documentation/${productUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname === `/sell/products/manage/documentation/`,
      ready: documentation,
    },
  ];

  const publish = [
    {
      id: 1,
      uuid: '7a87e3b9-4c85-41d4-8047-d039b347918f',
      name: 'Landing Page',
      href: `/sell/products/manage/landing_page/${productUUID}`,
      icon: AcademicCapIcon,
      current: router.pathname === `/sell/products/manage/landing_page/`,
      ready: landingPage,
    },
    {
      id: 2,
      uuid: 'c73676e5-827c-4675-8459-ef3e3a9c5708',
      name: 'Pricing',
      href: `/sell/products/manage/pricing/${productUUID}`,
      icon: ChatBubbleLeftIcon,
      current: router.pathname === `/sell/products/manage/pricing/`,
      ready: pricing,
    },
    {
      id: 3,
      uuid: 'd5988edd-8fa3-407e-a932-abe6c57e64fa',
      name: 'Promotions',
      href: `/sell/products/manage/promotions/${productUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname === `/sell/products/manage/promotions/${productUUID}`,
      ready: promotions,
    },
    {
      id: 4,
      uuid: '7a70be3f-89b6-4c7e-a878-7e8364101677',
      name: 'Shipping',
      href: `/sell/products/manage/shipping/${productUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname === `/sell/products/manage/shipping/${productUUID}`,
      ready: shipping,
    },
    {
      id: 5,
      uuid: '7a70be3f-asdd-asdas-fsdf-7e8364101677',
      name: 'Messages',
      href: `/sell/products/manage/messages/${productUUID}`,
      icon: ShoppingCartIcon,
      current: router.pathname === `/sell/products/manage/messages/${productUUID}`,
      ready: messages,
    },
  ];

  return (
    <div className="w-full space-y-6 p-6">
      <div className="lg:pt-16" />

      <div>
        <div className="ml-6">
          <p className="text-md ml-4 font-black leading-6 text-gray-900">Plan your product</p>
        </div>
        <ul className="mt-2">
          {plan.map((item) => (
            <Link key={item.uuid} href={item.href}>
              <li
                className={`${
                  item.current ? 'border-l-4 border-gray-900' : 'border-l-6 border-transparent'
                } cursor-pointer py-3 hover:bg-gray-50 `}
              >
                {/* Your content */}
                <div className="ml-4 flex">
                  {item.ready ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-forest-green-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}

                  <p className="ml-3">{item.name}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>

      <div>
        <div className="ml-6">
          <p className="text-md ml-4 font-black leading-6 text-gray-900">Create your product</p>
        </div>
        <ul className="mt-2">
          {create.map((item) => (
            <Link key={item.uuid} href={item.href}>
              <li
                className={`${
                  item.current ? 'border-l-4 border-gray-900' : 'border-l-6 border-transparent'
                } cursor-pointer py-3 hover:bg-gray-50 `}
              >
                {/* Your content */}
                <div className="ml-4 flex">
                  {item.ready ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-forest-green-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <p className="ml-3">{item.name}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>

      <div>
        <div className="ml-6">
          <p className="text-md ml-4 font-black leading-6 text-gray-900">Publish product</p>
        </div>
        <ul className="mt-2">
          {publish.map((item) => (
            <Link key={item.uuid} href={item.href}>
              <li
                className={`${
                  item.current ? 'border-l-4 border-gray-900' : 'border-l-6 border-transparent'
                } cursor-pointer py-3 hover:bg-gray-50 `}
              >
                {/* Your content */}
                <div className="ml-4 flex">
                  {/* <i class='bx bx-radio-circle text-2xl inline-flex text-gray-700'></i> */}
                  {/* <div className='border p-1.5 px-3 border-gray-500 rounded-full relative'>
                            <i className='bx bx-check absolute top-3 left-4 transform -translate-x-1/2 -translate-y-1/2 w-full h-full '></i>
                        </div> */}
                  {item.ready ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-forest-green-300"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 text-gray-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  <p className="ml-3">{item.name}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
