const pushArraysToData = (currencies, price) => {
  let withKeys = {}

  for(let i = 0; i < currencies.length; i++){
    withKeys[currencies[i]] = price[i]
  };

  return withKeys;
};

export { pushArraysToData };