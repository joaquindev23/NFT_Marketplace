import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { languages } from '@/helpers/fixedLanguages';

export default function LanguageFilter({ setLanguage }) {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button className=" flex w-full justify-between rounded-lg border-y  px-4 py-3 text-left text-xl font-bold text-gray-900 dark:border-dark-third dark:text-dark-txt">
            <span>Language</span>
            <ChevronUpIcon
              className={`${
                open ? 'rotate-180 transform' : ''
              } mt-1 h-5 w-5 text-gray-500 dark:text-dark-txt`}
            />
          </Disclosure.Button>

          <Disclosure.Panel className="px-4 py-2 text-sm text-gray-500">
            <div className="w-full py-1">
              <div className="space-y-4">
                {languages.map((language) => (
                  <button
                    type="button"
                    key={language.name}
                    onClick={() => {
                      setSelectedLanguage(language.name);
                      setLanguage(language.name);
                    }}
                    className="flex w-full cursor-pointer space-x-1"
                  >
                    {selectedLanguage === language.name ? (
                      <i className="bx bx-checkbox-square text-2xl dark:text-dark-txt text-gray-700" />
                    ) : (
                      <i className="bx bx-checkbox text-2xl dark:text-dark-txt text-gray-700" />
                    )}
                    <div className="mt-1.5 text-sm dark:text-dark-txt-secondary text-gray-700">
                      {language.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
