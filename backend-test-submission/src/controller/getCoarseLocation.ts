import axios from "axios";

const getCoarseLocation = async (ip: string | undefined) => {
  if (!ip) {
    return "direct";
  }
  const response = await axios.get(
    `https://ipapi.co/${ip}/json/`
  );
  return response.data.country;
};

export default getCoarseLocation;