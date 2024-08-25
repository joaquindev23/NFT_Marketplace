import React from 'react';

export default function StatusComponent({ data }) {
  return (
    <span className="md:text-md ml-8 flex content-center items-center text-center text-sm font-bold text-white lg:text-lg">
      {data && data.details ? data && data.details.title : ''}
      {data && data.details && data && data.details.status === 'draft' ? (
        <span className="ml-4 inline-flex select-none items-center bg-gray-500 px-2.5 py-0.5 text-sm font-bold text-gray-900">
          Draft
        </span>
      ) : (
        <span className="ml-4 inline-flex select-none items-center bg-mughal-green-200 px-2.5 py-0.5 text-sm font-bold text-mughal-green-700">
          Published
        </span>
      )}
    </span>
  );
}
