import axios from "axios";
import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}${url}`);

        setData(res.data);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setError(err);
        console.log("useFetch error: " + err.message);
      }
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}${url}`);

      setData(res.data);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  return { data, isLoading, error, reFetch };
};

export default useFetch;
