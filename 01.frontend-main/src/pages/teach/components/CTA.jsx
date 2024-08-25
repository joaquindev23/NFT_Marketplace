import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
// import { useDispatch } from "react-redux";
import LoadingMoon from '@/components/loaders/LoadingMoon';
import Button from '@/components/Button';
import { becomeSeller } from '@/redux/actions/teach/teach';
// import { become_instructor } from "../../../redux/actions/user/user";

export default function CTA({ isAuthenticated, myUser }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleBecomeInstructor = async () => {
    setLoading(true);
    dispatch(becomeSeller(myUser.id));
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 text-center sm:py-32 py-20 sm:px-6 lg:px-8">
      <h2 className="font-recife-bold block text-4xl tracking-tight dark:text-dark-txt text-dark sm:text-4xl">
        Become a merchant today
      </h2>
      <p className="font-gilroy-regular mt-4 text-2xl leading-8 dark:text-dark-txt-secondary text-gray-700">
        Join one of the world’s fastest growing e-learning NFT marketplace
      </p>
      <div className="py-4" />
      {isAuthenticated ? (
        <div className="">
          {myUser && myUser.become_seller && loading === false ? (
            <Button>Access Requested</Button>
          ) : (
            <div>
              {loading ? (
                <Button>
                  <LoadingMoon size={20} />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    handleBecomeInstructor();
                  }}
                >
                  Become Merchant
                </Button>
              )}
            </div>
          )}
        </div>
      ) : (
        <Link className="" href="/auth/login">
          <Button>Get Started</Button>
        </Link>
      )}
    </div>
  );
}
