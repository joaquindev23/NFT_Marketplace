import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';
import { Popover } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import slugify from 'react-slugify';
import Navbar from '../components/Navbar';
import {
  setProductStep3Secondary,
  setProductStep3Tertiary,
  setProductStep3,
} from '@/redux/actions/create/create';
import FetchPrimaryCategories from '@/api/manage/products/GetPrimaryCategories';
import FetchSubCategories from '@/api/manage/products/GetSecondaryCategories';
import FetchThirdCategories from '@/api/manage/products/GetThirdCategories';

// import { setCourseStep1 } from '@/redux/actions/create/create';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CreateProduct3() {
  const router = useRouter();

  const myUser = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    setCategory: '',
  });

  const { setCategory } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [categories, setCategories] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const res = await FetchPrimaryCategories();

      setCategories(res.data.results);
    } catch (err) {
      // handle error
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const [formDataSub, setFormDataSub] = useState({
    setSubCategory: '',
  });

  const { setSubCategory } = formDataSub;

  const onChangeSub = (e) => {
    setFormDataSub({ ...formDataSub, [e.target.name]: e.target.value });
  };

  const [subcategories, setSubcategories] = useState([]);

  const fetchSubcategories = useCallback(async () => {
    if (setCategory) {
      try {
        const res = await FetchSubCategories(slugify(setCategory));
        setSubcategories(res.data.results);
        setFormDataSub({ setSubCategory: '' }); // reset subcategory when category changes
      } catch (err) {
        // handle error
      }
    }
  }, [setCategory]);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories, setCategory]);

  const [formDataThird, setFormDataThird] = useState({
    setThirdCategory: '',
  });

  const { setThirdCategory } = formDataThird;

  const onChangeThird = (e) => {
    setFormDataThird({ ...formDataThird, [e.target.name]: e.target.value });
  };

  const [thirdCategories, setThirdCategories] = useState([]);

  const fetchThirdcategories = useCallback(async () => {
    if (setSubCategory) {
      try {
        const res = await FetchThirdCategories(slugify(setSubCategory));
        setThirdCategories(res.data.results);
        setFormDataThird({ setThirdCategory: '' }); // reset third category when subcategory changes
      } catch (err) {
        // handle error
      }
    }
  }, [setSubCategory]);

  useEffect(() => {
    fetchThirdcategories();
  }, [fetchThirdcategories, setSubCategory]);

  const dispatch = useDispatch();
  // const title = useSelector((state) => state.create.title);
  const type = useSelector((state) => state.create.product_type);

  const handleSetCategory = () => {
    dispatch(setProductStep3(setCategory));
    router.push('/sell/products/create/4');
  };

  // useEffect(() => {
  //   if (!isAuthenticated || (!type && myUser && myUser.role !== 'seller')) {
  //     router.push('/');
  //   }
  // }, []);

  return (
    <div className="dark:bg-dark-main">
      <Navbar myUser={myUser} title="Step 3 of 4" />
      <div className="overflow-hidden  bg-gray-200">
        <div className="h-1 dark:bg-dark-primary bg-purple-800" style={{ width: '75%' }} />
      </div>
      <div className="grid w-full place-items-center py-14">
        <h2 className="font-bold mx-12 text-2xl dark:text-dark-txt md:mx-0 md:text-4xl">
          What category shall this product belong to, young Skywalker?
        </h2>
        <p className="font-regular mx-12 mt-4 text-sm md:mx-0 dark:text-dark-txt-secondary md:text-lg">
          Will it be a weapon of war, a tool of manipulation, or a symbol of power?
        </p>
        <div className="relative mt-12">
          <select
            name="setCategory"
            value={setCategory}
            required
            onChange={(e) => {
              onChange(e);
              dispatch(setProductStep3(e.target.value));
            }}
            className={classNames(
              'focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-96 rounded-md py-4 px-3 pr-10 text-base focus:outline-none sm:text-sm md:w-[750px]',
              'border-gray-500 dark:border-dark-border',
              'bg-white dark:bg-dark-bg',
              'text-gray-900 dark:text-dark-txt',
            )}
          >
            <option className="dark:text-dark-txt-secondary" value="" disabled>
              Choose a category
            </option>
            {categories &&
              categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>
        </div>
        {subcategories && subcategories.length > 0 && (
          <div className="relative mt-6">
            <select
              name="setSubCategory" // Change this to "setSubCategory"
              value={setSubCategory}
              required
              onChange={(e) => {
                onChangeSub(e);
                dispatch(setProductStep3Secondary(e.target.value));
              }}
              className={classNames(
                'focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-96 rounded-md py-4 px-3 pr-10 text-base focus:outline-none sm:text-sm md:w-[750px]',
                'border-gray-500 dark:border-dark-border',
                'bg-white dark:bg-dark-bg',
                'text-gray-900 dark:text-dark-txt',
              )}
            >
              <option value="" disabled>
                Choose a subcategory
              </option>
              {subcategories &&
                subcategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>
        )}
        {thirdCategories && thirdCategories.length > 0 && (
          <div className="relative mt-6">
            <select
              name="setThirdCategory" // Change this to "setSubCategory"
              value={setThirdCategory}
              required
              onChange={(e) => {
                onChangeThird(e);
                dispatch(setProductStep3Tertiary(e.target.value));
              }}
              className={classNames(
                'focus:border-indigo-500 focus:ring-indigo-500 mt-1 block w-96 rounded-md py-4 px-3 pr-10 text-base focus:outline-none sm:text-sm md:w-[750px]',
                'border-gray-500 dark:border-dark-border',
                'bg-white dark:bg-dark-bg',
                'text-gray-900 dark:text-dark-txt',
              )}
            >
              <option value="" disabled>
                Choose a topic
              </option>
              {thirdCategories &&
                thirdCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      <Popover
        as="footer"
        className={({ open }) =>
          classNames(
            open ? 'fixed inset-0 overflow-y-auto' : '',
            ' fixed inset-x-0 bottom-0 z-30 w-full dark:border-dark-border border bg-white  py-4 shadow-2xl dark:bg-dark-main dark:shadow-none lg:overflow-y-visible',
          )
        }
      >
        <div className="px-8 sm:flex sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => {
              router.back();
            }}
            className="text-lg font-medium leading-6 dark:text-dark-txt text-gray-900"
          >
            Previous
          </button>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            {setThirdCategory ? (
              <button
                type="button"
                onClick={() => {
                  handleSetCategory();
                }}
                className={classNames(
                  'text-md inline-flex items-center px-4 py-3 font-black',
                  'border border-transparent',
                  'bg-dark text-white hover:bg-gray-700',
                  'dark:bg-dark-primary dark:hover:bg-dark-accent',
                )}
              >
                Continue
              </button>
            ) : (
              <div className="text-md inline-flex select-none items-center border border-transparent bg-gray-300 px-4 py-3 font-black text-white dark:bg-dark-third dark:text-dark-txt">
                Continue
              </div>
            )}
          </div>
        </div>
      </Popover>
    </div>
  );
}
