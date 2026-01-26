import {useState} from "react";

const useFetch = (cb, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      // If args are provided, use them directly (ignores options)
      // Otherwise, use options as the first argument
      const response = args.length > 0 
        ? await cb(...args)
        : await cb(options);
      setData(response);
      setError(null);
      return response;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {data, loading, error, fn};
};

export default useFetch;