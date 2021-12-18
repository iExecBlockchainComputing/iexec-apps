import { useState, useEffect } from "react";

export default function useFetch(url) {
  const [response, setResponse] = useState({});

  useEffect(() => {
    if (url) {

      fetch(url)
        .then(res => res.json())
        .then(res => {
          setResponse(res)
      })
    }
  }, [url])
  // const Fetch = () => {
  //   async function getNonce() {
  //     setNonce(await mainnetProvider.getTransactionCount(address));
  //   }
  //   if(address) getNonce();
  // };
  // Fetch();
  return response;
}
