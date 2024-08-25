import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { languages } from '@/helpers/fixedLanguages';
import {
  onchangeProductLanguage,
  onchangeProductLevel,
  onchangeProductCategory,
} from '@/redux/actions/products/products';

export default function BasicInfoSec({
  setHasChangesLanguage,
  setHasChangesLevel,
  setHasChangesCategory,
}) {
  const dispatch = useDispatch();

  const product = useSelector((state) => state.products.product);
  const details = product && product.details;

  // LANGUAGE
  const productLanguage = details && details.language;
  const reduxLanguage = useSelector((state) => state.products.language);
  const [language, setLanguage] = useState(productLanguage || reduxLanguage);

  const [originalLanguage, setOriginalLanguage] = useState('');
  useEffect(() => {
    setOriginalLanguage(JSON.parse(JSON.stringify(language)));
    // eslint-disable-next-line
  }, [product]);

  useEffect(() => {
    if (!_.isEqual(originalLanguage, language)) {
      setHasChangesLanguage(true);
    } else {
      setHasChangesLanguage(false);
    }
  }, [language, originalLanguage, setHasChangesLanguage]);

  // LEVEL
  const productLevel = details && details.level;
  const reduxLevel = useSelector((state) => state.products.level);
  const [level, setLevel] = useState(productLevel || reduxLevel);

  const [originalLevel, setOriginalLevel] = useState('');
  useEffect(() => {
    setOriginalLevel(JSON.parse(JSON.stringify(level)));
    // eslint-disable-next-line
  }, [product]);

  useEffect(() => {
    if (!_.isEqual(originalLevel, level)) {
      setHasChangesLevel(true);
    } else {
      setHasChangesLevel(false);
    }
  }, [level, originalLevel, setHasChangesLevel]);

  // CATEGORY
  const productCategory = details && details.category;
  const reduxCategory = useSelector((state) => state.products.category);
  const [category, setCategory] = useState(productCategory?.id || reduxCategory);

  const [originalCategory, setOriginalCategory] = useState('');
  useEffect(() => {
    setOriginalCategory(JSON.parse(JSON.stringify(category)));
    // eslint-disable-next-line
  }, [product]);

  useEffect(() => {
    if (!_.isEqual(originalCategory, category)) {
      setHasChangesCategory(true);
    } else {
      setHasChangesCategory(false);
    }
  }, [category, originalCategory, setHasChangesCategory]);

  useEffect(() => {
    dispatch(onchangeProductCategory(category));
  }, [category, dispatch]);

  return (
    <div>
      <span className="text-md mb-2 block font-bold dark:text-dark-txt text-gray-900">
        Basic info
      </span>
      <div className="grid space-x-4 md:grid-cols-3">
        <div>
          <span className="block text-sm font-medium dark:text-dark-txt-secondary text-gray-700">
            <span className="font-bold">Current:</span>{' '}
            {(details && details.language) || 'Select language'}
          </span>
          <select
            value={language}
            required
            onChange={(e) => {
              setLanguage(e.target.value);
              dispatch(onchangeProductLanguage(e.target.value));
            }}
            className="text-md mt-1 block  w-full border-gray-700 py-4 pl-3 pr-10"
          >
            <option value="" disabled>
              -- Select Language --
            </option>
            {languages &&
              languages.map((language) => (
                <option key={language.name} value={language.name}>
                  {language.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <span className="block text-sm font-medium dark:text-dark-txt-secondary text-gray-700">
            <span className="font-bold">Current:</span>{' '}
            {(details && details.level) || 'Select level'}
          </span>
          <select
            value={level}
            required
            onChange={(e) => {
              setLevel(e.target.value);
              dispatch(onchangeProductLevel(e.target.value));
            }}
            className="text-md mt-1 block  w-full border-gray-700 py-4 pl-3 pr-10"
          >
            <option value="" disabled>
              -- Select Level --
            </option>
            <option value="Everyone">Everyone</option>
            <option value="Professional">Professional</option>
            <option value="Basic">Basic</option>
            <option value="Advanced">Advanced</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Expert">Expert</option>
            <option value="All levels">All levels</option>
          </select>
        </div>
        {/* <div>
          <span className="block text-sm font-medium text-gray-700">
            <span className="font-bold">Current:</span> {details && details.category.name}
          </span>
          <select
            value={category || (details && details.category)}
            required
            onChange={(e) => {
              setCategory(e.target.value);
              dispatch(onchangeProductCategory(e.target.value));
            }}
            className="text-md mt-1 block  w-full border-gray-700 py-4 pl-3 pr-10"
          >
            <option value="" disabled>
              -- Select Category --
            </option>
            {categories.categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div> */}
      </div>
    </div>
  );
}
