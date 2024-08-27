import { useEffect, useState } from "react";

type UseFetchData<T> = T | null;

const UseFetch = <T,>(url: string): [UseFetchData<T>] => {
  const [data, setData] = useState<UseFetchData<T>>(null);

  useEffect(() => {
    fetch(url, {
      method: "get"
    })
      .then((res) => res.json())
      .then((data: T) => setData(data));
  }, [url]);

  return [data];
};

export default UseFetch;
