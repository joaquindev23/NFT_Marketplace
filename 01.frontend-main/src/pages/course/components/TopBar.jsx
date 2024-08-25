import React from 'react';

export default function TopBar({ details }) {
  return (
    <>
      {/* Course Navbar Info */}

      <div id="navbar" className="fixed top-0 z-40 hidden w-full bg-dark py-1.5 shadow-navbar ">
        <div>
          <div className="py-3">
            <div className="ml-5 text-lg font-bold leading-6 text-white">
              {details && details.title}
              <div className="float-right flex lg:hidden">
                {/* Price */}
                <div className="flex px-4 text-white">
                  <div className="mr-4 flex-shrink-0 self-end">
                    {/* <img 
                                            className="h-4 w-4 inline-flex mr-1"
                                            src="https://bafybeibwzivmmcrtqb3ofqzagnal2xp7efe5uwqxvxtphf2fr4u7xbtecy.ipfs.dweb.link/ethereum.png"
                                            /> */}
                    $ {parseFloat(details && details.price)}
                  </div>
                </div>
                {/* <button
                                            // to={`/courses/study/${details &&details.slug}`}
                                            className="col-span-4 w-full  mr-4 justify-center font-bold inline-flex items-center px-3 py-4 border border-gray-100 text-gray-100 hover:text-gray-200 hover:border-gray-200 border-transparent text-md leading-4"
                                        >
                                            Comprar Ahora
                                        </button> */}
              </div>
            </div>
            {
              // eslint-disable-next-line
              details && details.best_seller ? (
                <span className="bg-yellow-100 text-yellow-800 ml-4 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold">
                  Best seller
                </span>
              ) : (
                <div />
              )
            }
            <span className={`${details && details.best_seller ? '' : 'ml-3'} mr-2 inline-flex`}>
              RATINGS STARS
            </span>
            <span className="text-sm text-purple-300">
              ({details && details.student_rating_no} ratings)
            </span>
            <span className="ml-2 text-sm font-medium text-white">
              {details && details.students} Students
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
