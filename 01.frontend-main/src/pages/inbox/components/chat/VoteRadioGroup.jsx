import React, { useState } from 'react';

export default function VoteRadioGroup({ poll, onVote }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    setSelectedOption(parseInt(event.target.value, 10));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onVote(selectedOption);
  };

  // console.log('Selected Option', selectedOption);

  return (
    <div className="mr-2">
      <label className="text-base font-semibold text-gray-900">{poll && poll.question}</label>
      <p className="text-sm text-gray-500">Total votes: {poll && poll.total_votes_count}</p>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="space-y-4">
          {poll &&
            poll.options.map((option) => (
              <div key={option.id} className="flex items-center">
                <input
                  id={option.id}
                  value={option.id}
                  name="option"
                  required
                  type="radio"
                  onChange={handleOptionChange}
                  className="text-indigo-600 focus:ring-indigo-600 h-4 w-4 border-gray-300"
                />
                <label
                  htmlFor={option.id}
                  className="ml-3 block text-sm font-medium leading-6 text-gray-900"
                >
                  {option.option}{' '}
                  <span className="ml-1 text-sm text-gray-500">{option.votes_count}</span>
                </label>
              </div>
            ))}
          <button
            type="submit"
            disabled={selectedOption === null || (poll && poll.voted)}
            className="focus:shadow-outline-iris mt-2 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-iris-600 px-4 py-1.5 text-center text-base font-medium leading-6 text-white transition duration-150 ease-in-out hover:bg-iris-500 focus:border-iris-700 focus:outline-none active:bg-iris-700"
          >
            {poll && poll.voted ? 'Voted' : 'Vote'}
          </button>
        </div>
      </form>
    </div>
  );
}
