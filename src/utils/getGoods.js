import axios from "axios";

const BASE_URL = "http://localhost:3001";

export const getGoods = async () => {
  const res = await axios.get(`${BASE_URL}/goods`);
  return res.data;
};
