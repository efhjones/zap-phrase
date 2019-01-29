const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const createRoomId = () => {
  const rand = getRandomInt(100000, 999999);
  console.log("int: ", rand);
  return `${rand}`
    .split("")
    .map(num => {
      return String.fromCharCode(Number(num) + 65);
    })
    .join("");
};

module.exports = {
  createRoomId
};
