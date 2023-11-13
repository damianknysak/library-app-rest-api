exports.findMostFrequent = (arr1) => {
  let occ_arr = [];

  for (let i = 0; i < arr1.length; i++) {
    const index = occ_arr.findIndex((obj) => obj.el === arr1[i]);

    if (index > -1) {
      occ_arr[index].count++;
    } else {
      occ_arr.push({ el: arr1[i], count: 1 });
    }
  }

  const sorted_array = occ_arr.sort((a, b) => b.count - a.count);

  const top5 = sorted_array.slice(0, 5);

  return top5;
};

exports.formatStringForQuery = (str) => {
  return str.replaceAll(" ", "_").toLowerCase();
};
