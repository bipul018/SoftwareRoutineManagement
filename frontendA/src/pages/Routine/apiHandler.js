const apihandler = async (url, reqconfig, requestData) => {
    const req = {
      method: 'POST',
      body: JSON.stringify({requestData}),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      ...reqconfig,
    };
  
    const res = await fetch(url, req);
    const data = await res.json();
    console.log(data);
    return data;
  };
  
  export default apihandler;
  