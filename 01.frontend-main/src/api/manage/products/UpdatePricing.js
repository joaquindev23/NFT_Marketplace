import axios from 'axios';

export default async function UpdateProductPricing(productUUID, productBody) {
  try {
    const res = await axios.put(`/api/sell/products/updatePricing`, {
      productUUID,
      productBody,
    });

    if (res.status === 200) {
      return res.data.results;
    }
  } catch (err) {
    console.error(err);
  }
}
