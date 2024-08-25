import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LogoImg from '@/components/LogoImg';
import {
  Logo,
  LogoContainer,
  SearchContainer,
  RightMenuContainer,
  NavbarLink,
  Header,
  Container,
} from './Elements';
import AnimatedTippy from '@/components/tooltip';
import AuthLinks from '../Auth';
import GuestLinks from '../Guest';
import NavSearchbar from '../Search/NavSearchbar';
import FetchPrimaryCategories from '@/api/GetPrimaryCategories';
import slugify from 'react-slugify';

export default function DesktopNavbar() {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await FetchPrimaryCategories();
      setCategories(res.data.results);
    };
    fetchCategories();
  }, []);

  return (
    <Container>
      <Header>
        <LogoContainer>
          <Logo>
            <Link href="/">
              <LogoImg />
            </Link>
          </Logo>
        </LogoContainer>
        <NavbarLink>
          <Link
            className={`${
              router.pathname === '/marketplace' ? 'text-iris-500 dark:text-dark-primary' : ''
            }`}
            href="/marketplace"
          >
            Market
          </Link>
        </NavbarLink>
        <SearchContainer>
          <NavSearchbar />
        </SearchContainer>
        <RightMenuContainer>
          <NavbarLink>
            <Link
              className={`${
                router.pathname === '/games' ? 'text-iris-500 dark:text-dark-primary' : ''
              }`}
              href="/games"
            >
              Games
            </Link>
          </NavbarLink>
          <NavbarLink>
            <Link
              className={`${
                router.pathname === '/products' ? 'text-iris-500 dark:text-dark-primary' : ''
              }`}
              href="/products"
            >
              Products
            </Link>
          </NavbarLink>
          <AnimatedTippy
            offsetY={15}
            content={
              <div className="w-72   space-y-2 justify-center  py-2 text-center text-lg font-medium leading-6 ">
                <div className="flex flex-wrap justify-center gap-2 px-4">
                  <div className="my-2 cursor-default select-none">Categories:</div>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/categories/c/${slugify(category)}`}
                      className="my-2 dark:hover:text-dark-primary hover:text-iris-500 cursor-pointer"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>
            }
          >
            <div className="hidden lg:inline-flex items-center mr-1 px-1  text-base font-medium text-gray-900 dark:text-dark-txt  hover:text-iris-500">
              <Link
                className={`${
                  router.pathname === '/courses' ? 'text-iris-500 dark:text-dark-primary' : ''
                }`}
                href="/courses"
              >
                Courses
              </Link>
            </div>
          </AnimatedTippy>
          {isAuthenticated ? <AuthLinks /> : <GuestLinks />}
        </RightMenuContainer>
      </Header>
    </Container>
  );
}
