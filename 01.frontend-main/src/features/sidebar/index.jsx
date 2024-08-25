import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  ChartBarIcon,
  ChatBubbleLeftIcon,
  QuestionMarkCircleIcon,
  ShoppingCartIcon,
  WrenchIcon,
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import SidebarIcon from './SidebarIcon';

export default function Sidebar() {
  const [sidebarHidden, setSidebarHidden] = useState(true);

  const showSidebar = () => {
    setSidebarHidden(false);
  };

  const hideSidebar = () => {
    setSidebarHidden(true);
  };

  const router = useRouter();

  useEffect(() => {
    setSidebarHidden(true);
  }, [router.pathname]);

  return (
    <motion.div
      id="sidebar-container"
      initial={{ width: '65px' }}
      animate={{ width: sidebarHidden ? '65px' : '250px' }}
      exit={{ width: '65px' }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      onMouseEnter={showSidebar}
      onMouseLeave={hideSidebar}
      className="z-20 hidden h-screen bg-dark-main pt-5 shadow-2xl md:fixed md:inset-y-0 md:flex md:flex-col"
    >
      <div className="sticky top-0  text-white">
        <Link href="/sell/dashboard" className=" flex">
          <Image
            className="mb-2 ml-2 inline-flex h-12 w-auto object-cover"
            src="/assets/img/logos/triangle.png"
            width={60}
            height={60}
            alt="Boomslag"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{
              opacity: sidebarHidden ? 0 : 1,
            }}
            transition={{
              duration: sidebarHidden ? 0.15 : 0.3,
              delay: sidebarHidden ? 0 : 0.15,
              ease: 'easeInOut',
            }}
            className="ml-4 mt-2 inline-flex text-2xl font-bold"
            style={{ pointerEvents: sidebarHidden ? 'none' : 'auto' }}
          >
            Boomslag
          </motion.span>
        </Link>
        <ul className="relative">
          {/* Courses */}
          <button
            type="button"
            onClick={() => {
              router.push('/sell/courses');
            }}
            className={`${
              router.pathname === '/sell/courses'
                ? 'border-l-4 border-iris-400'
                : 'border-l-4 border-transparent'
            } absolute flex w-full  py-3 hover:bg-dark-gray`}
            style={{ top: 0, left: 0 }}
          >
            <motion.span
              initial={{ opacity: 1, scale: 1, rotate: 0, skewX: 0, skewY: 0 }}
              animate={{
                opacity: sidebarHidden ? 1 : 1,
                scale: sidebarHidden ? 1 : 1.1,
                rotate: sidebarHidden ? 0 : 10,
                skewX: sidebarHidden ? 0 : 10,
                skewY: sidebarHidden ? 0 : -10,
              }}
              transition={{
                duration: sidebarHidden ? 0.15 : 0.3,
                delay: sidebarHidden ? 0 : 0.15,
                ease: 'easeInOut',
              }}
              className="ml-4 inline-flex"
            >
              <SidebarIcon text="Courses" icon={<AcademicCapIcon className="h-6 w-auto" />} />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: sidebarHidden ? 0 : 1, x: sidebarHidden ? -20 : 0 }}
              transition={{
                duration: 0.3,
                delay: sidebarHidden ? 0 : 0.1,
                ease: 'easeInOut',
              }}
              className="ml-4 inline-flex font-bold"
              style={{ pointerEvents: sidebarHidden ? 'none' : 'auto' }}
            >
              Courses
            </motion.span>
          </button>
          {/* Products */}
          <button
            type="button"
            onClick={() => {
              router.push('/sell/products');
            }}
            className={`${
              router.pathname === '/sell/products'
                ? 'border-l-4 border-iris-400'
                : 'border-l-4 border-transparent'
            } absolute flex w-full py-3 hover:bg-dark-gray`}
            style={{ top: '3rem', left: 0 }}
          >
            <motion.span
              initial={{ opacity: 1, scale: 1, rotate: 0, skewX: 0, skewY: 0 }}
              animate={{
                opacity: sidebarHidden ? 1 : 1,
                scale: sidebarHidden ? 1 : 1.1,
                rotate: sidebarHidden ? 0 : 10,
                skewX: sidebarHidden ? 0 : 10,
                skewY: sidebarHidden ? 0 : -10,
              }}
              transition={{
                duration: sidebarHidden ? 0.15 : 0.3,
                delay: sidebarHidden ? 0 : 0.15,
                ease: 'easeInOut',
              }}
              className="ml-4 inline-flex"
            >
              <SidebarIcon text="Products" icon={<ShoppingCartIcon className="h-6 w-auto" />} />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: sidebarHidden ? 0 : 1, x: sidebarHidden ? -20 : 0 }}
              transition={{
                duration: 0.3,
                delay: sidebarHidden ? 0 : 0.1,
                ease: 'easeInOut',
              }}
              className="ml-4 inline-flex font-bold"
              style={{ pointerEvents: sidebarHidden ? 'none' : 'auto' }}
            >
              Products
            </motion.span>
          </button>
          {/* Communications */}
          <button
            type="button"
            onClick={() => {
              router.push('/sell/communication');
            }}
            className={`${
              router.pathname === '/sell/communication'
                ? 'border-l-4 border-iris-400'
                : 'border-l-4 border-transparent'
            } absolute flex w-full  py-3 hover:bg-dark-gray`}
            style={{ top: '6rem', left: 0 }}
          >
            <motion.span
              initial={{ opacity: 1, scale: 1, rotate: 0, skewX: 0, skewY: 0 }}
              animate={{
                opacity: sidebarHidden ? 1 : 1,
                scale: sidebarHidden ? 1 : 1.1,
                rotate: sidebarHidden ? 0 : 10,
                skewX: sidebarHidden ? 0 : 10,
                skewY: sidebarHidden ? 0 : -10,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="ml-4 inline-flex"
            >
              <SidebarIcon
                text="Communication"
                icon={<ChatBubbleLeftIcon className="h-6 w-auto" />}
              />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: sidebarHidden ? 0 : 1, x: sidebarHidden ? -20 : 0 }}
              transition={{
                duration: 0.3,
                delay: sidebarHidden ? 0 : 0.1,
                ease: 'easeInOut',
              }}
              className="ml-4 inline-flex font-bold"
              style={{ pointerEvents: sidebarHidden ? 'none' : 'auto' }}
            >
              Communication
            </motion.span>
          </button>
          {/* Perfomance */}
          <button
            type="button"
            onClick={() => {
              router.push('/sell/performance');
            }}
            className={`${
              router.pathname === '/sell/performance'
                ? 'border-l-4 border-iris-400'
                : 'border-l-4 border-transparent'
            } absolute flex w-full  py-3 hover:bg-dark-gray`}
            style={{ top: '9rem', left: 0 }}
          >
            <motion.span
              initial={{ opacity: 1, scale: 1, rotate: 0, skewX: 0, skewY: 0 }}
              animate={{
                opacity: sidebarHidden ? 1 : 1,
                scale: sidebarHidden ? 1 : 1.1,
                rotate: sidebarHidden ? 0 : 10,
                skewX: sidebarHidden ? 0 : 10,
                skewY: sidebarHidden ? 0 : -10,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="ml-4 inline-flex"
            >
              <SidebarIcon text="Performance" icon={<ChartBarIcon className="h-6 w-auto" />} />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: sidebarHidden ? 0 : 1, x: sidebarHidden ? -20 : 0 }}
              transition={{
                duration: 0.3,
                delay: sidebarHidden ? 0 : 0.1,
                ease: 'easeInOut',
              }}
              className="ml-4 inline-flex font-bold"
              style={{ pointerEvents: sidebarHidden ? 'none' : 'auto' }}
            >
              Performance
            </motion.span>
          </button>
          {/* Tools */}
          <button
            type="button"
            onClick={() => {
              router.push('/sell/tools');
            }}
            className={`${
              router.pathname === '/sell/tools'
                ? 'border-l-4 border-iris-400'
                : 'border-l-4 border-transparent'
            } absolute flex w-full  py-3 hover:bg-dark-gray`}
            style={{ top: '12rem', left: 0 }}
          >
            <motion.span
              initial={{ opacity: 1, scale: 1, rotate: 0, skewX: 0, skewY: 0 }}
              animate={{
                opacity: sidebarHidden ? 1 : 1,
                scale: sidebarHidden ? 1 : 1.1,
                rotate: sidebarHidden ? 0 : 10,
                skewX: sidebarHidden ? 0 : 10,
                skewY: sidebarHidden ? 0 : -10,
              }}
              transition={{
                duration: 1,
                ease: 'easeOut',
              }}
              className="ml-4 inline-flex"
            >
              <SidebarIcon text="Tools" icon={<WrenchIcon className="h-6 w-auto" />} />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: sidebarHidden ? 0 : 1, x: sidebarHidden ? -20 : 0 }}
              transition={{
                duration: 0.3,
                delay: sidebarHidden ? 0 : 0.1,
                ease: 'easeInOut',
              }}
              className="ml-4 inline-flex font-bold"
              style={{ pointerEvents: sidebarHidden ? 'none' : 'auto' }}
            >
              Tools
            </motion.span>
          </button>
          {/* Help */}
          <button
            type="button"
            onClick={() => {
              router.push('/sell/resources');
            }}
            className={`${
              router.pathname === '/sell/resources'
                ? 'border-l-4 border-iris-400'
                : 'border-l-4 border-transparent'
            } absolute flex w-full  py-3 hover:bg-dark-gray`}
            style={{ top: '15rem', left: 0 }}
          >
            <motion.span
              initial={{ opacity: 1, scale: 1, rotate: 0, skewX: 0, skewY: 0 }}
              animate={{
                opacity: sidebarHidden ? 1 : 1,
                scale: sidebarHidden ? 1 : 1.1,
                rotate: sidebarHidden ? 0 : 10,
                skewX: sidebarHidden ? 0 : 10,
                skewY: sidebarHidden ? 0 : -10,
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="ml-4 inline-flex"
            >
              <SidebarIcon
                text="Resources"
                icon={<QuestionMarkCircleIcon className="h-6 w-auto" />}
              />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: sidebarHidden ? 0 : 1, x: sidebarHidden ? -20 : 0 }}
              transition={{
                duration: 0.3,
                delay: sidebarHidden ? 0 : 0.1,
                ease: 'easeInOut',
              }}
              className="ml-4 inline-flex font-bold"
              style={{ pointerEvents: sidebarHidden ? 'none' : 'auto' }}
            >
              Resources
            </motion.span>
          </button>
        </ul>
      </div>
    </motion.div>
  );
}
