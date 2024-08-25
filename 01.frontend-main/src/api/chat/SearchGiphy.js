import axios from 'axios';

export default async function SearchGiphy({
  searchGIFQuery,
  GIFLimit,
  offsetGIF,
  GIFRating,
  GIFLanguage,
}) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const config = {
      headers: {
        Accept: 'application/json',
      },
    };

    const res = await axios.get(
      `https://api.giphy.com/v1/gifs/search?api_key=${process.env.NEXT_PUBLIC_APP_GIPHY_API_KEY}&q=${searchGIFQuery}&limit=${GIFLimit}&offset=${offsetGIF}&rating=${GIFRating}&lang=${GIFLanguage}`,
      {
        ...config,
        signal: abortSignal,
      },
    );

    return res;
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
