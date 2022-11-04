const pushArraysToData = (currencies, price) => {
  const withKeys = {};

  currencies.map((currency, index) => {
    withKeys[currencies[index]] = price[index];
  });

  return withKeys;
};

export { pushArraysToData };