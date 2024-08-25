import { CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Web3 from 'web3';
import LoadingMoon from '@/components/loaders/LoadingMoon';
import { ToastError } from '@/components/toast/ToastError';
import {
  getItems,
  removeCartItem,
  removeCartItemAnonymous,
  removeCartItemAuthenticated,
  updateCartItem,
} from '@/redux/actions/cart/cart';
import GetContractABIPolygon from '@/api/tokens/GetContractABIPolygon';

export default function CartItem({ data }) {
  const web3 = new Web3(process.env.NEXT_PUBLIC_APP_RPC_POLYGON_PROVIDER);
  const [contractABI, setContractABI] = useState('');

  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const nftAddress = data && data.product_nft_address;
  const ticketId = data && data.product_token_id;
  const [stock, setStock] = useState(false);

  useEffect(() => {
    if (nftAddress) {
      const fetchData = async () => {
        let retry = true;
        while (retry) {
          const res = await GetContractABIPolygon(nftAddress);
          if (res.data.result === 'Contract source code not verified') {
            console.warn('Contract ABI not available: Contract source code not verified');
            setContractABI('');
            break;
          } else {
            try {
              const abi = JSON.parse(res.data.result);
              const contract = new web3.eth.Contract(abi, nftAddress);
              const fetchedStock = await contract.methods.getStock(Number(ticketId)).call();
              setStock(Number(fetchedStock));
              setContractABI(abi);
              retry = false;
            } catch (error) {
              console.warn('Invalid JSON data. Retrying...');
              await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
            }
          }
        }
      };
      fetchData();
    }
  }, [nftAddress, ticketId, data]);

  const [loading, setLoading] = useState(false);
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => {
    setHover(true);
  };
  const handleMouseLeave = () => {
    setHover(false);
  };

  const heartIcon = useRef(null);
  const handleMouseTrashEnter = () => {
    heartIcon.current.classList.remove('bx-trash');
    heartIcon.current.classList.add('bxs-trash');
  };

  const handleMouseTrashLeave = () => {
    heartIcon.current.classList.remove('bxs-trash');
    heartIcon.current.classList.add('bx-trash');
  };

  const [qtyList, setQtyList] = useState([]);
  const [val, setVal] = useState(data.count || '');
  const [prevVal, setPrevVal] = useState(val);

  useEffect(() => {
    const list = [];
    for (let i = 0; i < stock; i += 1) {
      const newItem = `${i + 1}`;
      list.push(newItem);
      setQtyList(list);
    }
  }, [data, stock]);

  const [unlimitedStock, setUnlimitedStock] = useState(false);

  useEffect(() => {
    if (stock) {
      setPrevVal(val);
      setLoading(true);
      const fetchData = async () => {
        try {
          // Wait for stock to be fetched
          if (stock !== false) {
            if (stock >= val) {
              // dispatch(updateCartItem(data.product_id, val));
              // dispatch(getItems());
            }
            if (stock === -1) {
              setUnlimitedStock(true);
            }
          } else {
            // Handle case when stock is not fetched yet
            console.warn('Stock not fetched yet');
          }
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
      };
      fetchData();
    }
    // eslint-disable-next-line
  }, [dispatch, val, stock]);

  const handleQtyChange = async (newVal) => {
    setVal(newVal);
    if (stock) {
      setPrevVal(val);
      setLoading(true);
      try {
        if (stock >= newVal) {
          dispatch(updateCartItem(data.product_id, newVal));
          dispatch(getItems());
        } else {
          ToastError('Not enough in stock');
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    } else {
      console.warn('Stock not fetched yet');
    }
  };

  async function handleRemoveCartItem() {
    setLoading(true);
    if (isAuthenticated) {
      dispatch(removeCartItemAuthenticated(data.product_id, 'Product'));
    } else {
      dispatch(removeCartItemAnonymous(data.product_id, 'Product'));
    }
    // await dispatch(getCartTotal(cartItems));
    setLoading(false);
  }

  const productPrice =
    data && data.product_compare_price && data.product_discount
      ? data.product_compare_price
      : data.product_price;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="flex w-full flex-col justify-center dark:bg-dark-second  bg-white"
    >
      <div className="relative mx-auto flex h-full w-full max-w-xs flex-col border-t-2 border-l-2 border-r-2 dark:border-b-2 dark:border-dark-border border-dark-bg dark:shadow-none shadow-neubrutalism-md transition duration-300  ease-in-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neubrutalism-xl md:max-w-full md:flex-row ">
        <Link href={`/products/${data.product_id}`} className=" flex-shrink-0 sm:mb-0 sm:mr-4">
          <Image
            src={data.product_image}
            alt=""
            width={256}
            height={256}
            className="mt-3 ml-2 h-16 w-16"
          />
        </Link>
        <div className="w-full p-2">
          <div className=" flex w-full flex-wrap items-center justify-between sm:flex-nowrap">
            <div className=" ">
              <Link
                href={`/product/${data.product_id}`}
                className={`text-left text-sm font-bold ${
                  hover
                    ? 'text-iris-500 dark:text-dark-primary'
                    : 'text-gray-800 dark:text-dark-txt'
                }`}
              >
                {data.product_title}
              </Link>
            </div>
            <div className=" flex flex-shrink-0">
              {stock > 0 ? (
                <div className="flex">
                  <CheckIcon
                    className=" mt-1 h-5 w-5 flex-shrink-0 text-forest-green-200"
                    aria-hidden="true"
                  />
                  <span className="inline-flex">
                    {stock >= 10 ? (
                      <div className=" mt-1 text-sm font-medium text-forest-green-200">{stock}</div>
                    ) : (
                      <div className=" mt-1 text-sm font-medium text-rose-500">{stock}</div>
                    )}
                  </span>
                </div>
              ) : unlimitedStock === true ? (
                <div className="flex">
                  <span className="dark:text-dark-txt-secondary mt-0.5 mx-1 text-sm">
                    Unlimited stock
                  </span>
                </div>
              ) : (
                <div className="flex">
                  <ClockIcon
                    className="mt-1 h-5 w-5 flex-shrink-0 dark:text-dark-txt text-gray-300"
                    aria-hidden="true"
                  />{' '}
                  <span className="dark:text-dark-txt-secondary mt-0.5 mx-1 text-sm">
                    No stock left
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="my-1 flex items-start space-x-2 text-xs">
            {data.size ? (
              <div className="inline-flex dark:text-dark-txt-secondary">Size: {data.size}</div>
            ) : (
              <div />
            )}
            {data.shipping ? (
              <div className="inline-flex dark:text-dark-txt-secondary">Ship: {data.shipping}</div>
            ) : (
              <div />
            )}
            {data.weight ? (
              <div className="inline-flex dark:text-dark-txt-secondary">Weight: {data.weight}g</div>
            ) : (
              <div />
            )}
            {data.color ? (
              <div className="inline-flex">
                Color:
                <div
                  className="mt-1 ml-1 h-3 w-3 rounded-full dark:bg-dark-bg bg-gray-50"
                  style={{ backgroundColor: data.color }}
                />
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* <p className="my-1 text-xs" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(data.short_description)}}/> */}

          <div className="relative flex flex-wrap items-center justify-between sm:flex-nowrap">
            {data.coupon && (
              <span className="ml-1 inline-flex items-center rounded-full bg-almond-100 px-2.5 py-0.5 text-xs font-medium text-almond-800">
                {data.coupon.name}
              </span>
            )}
            {data.product_discount && (
              <div className=" flex-shrink-0">
                {data.product_discount ? (
                  <p className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
                    {parseInt(((data.price - data.compare_price) / data.price) * 100, 10)}% Off
                  </p>
                ) : (
                  <div />
                )}
              </div>
            )}
          </div>
          <div className="relative flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className=" flex">
              {data.coupon ? (
                <>
                  <p className="text-sm font-bold">
                    $
                    {data.coupon.fixed_price_coupon
                      ? (productPrice - data.coupon.fixed_price_coupon.discount_price).toFixed(2)
                      : (
                          productPrice *
                          (1 - data.coupon.percentage_coupon.discount_percentage / 100)
                        ).toFixed(2)}
                  </p>
                  <div />
                </>
              ) : (
                <p className="text-sm font-bold">${productPrice}</p>
              )}
            </div>
            <div className="absolute right-7 flex">
              {unlimitedStock === false && (
                <select
                  onChange={(e) => {
                    handleQtyChange(e.target.value);
                  }}
                  value={val}
                  className="w-16 max-w-full border border-gray-900 py-0.5 text-left text-base rounded-2xl px-2 mt-1 mr-1 cursor-pointer font-medium leading-5 text-gray-700 dark:shadow-none shadow-neubrutalism-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 sm:text-sm"
                >
                  {qtyList.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              )}
            </div>
            <button
              type="button"
              onClick={async () => {
                handleRemoveCartItem();
              }}
              className="ml-4 mt-2 flex-shrink-0 "
            >
              {loading ? (
                <LoadingMoon className="inline-flex" size={20} color="#1e1f48" />
              ) : (
                <div
                  ref={heartIcon}
                  onMouseEnter={handleMouseTrashEnter}
                  onMouseLeave={handleMouseTrashLeave}
                  className="bx bx-trash inline-flex cursor-pointer text-xl text-pink-500"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
