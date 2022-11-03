const pushArraysToData = (pro, array) => {
    let withKeys = {}

    for(let i = 0; i < pro.length; i++){
      withKeys[pro[i]] = array[i]
    };

  return withKeys;
};

export { pushArraysToData };