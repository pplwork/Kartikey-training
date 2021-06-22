const timeParser = (milli, options) => {
  const hours = Math.floor(milli / (60 * 60 * 1000));
  const minutes = Math.floor((milli - hours * (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor(
    (milli - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000
  );
  const milliseconds = Math.floor(
    (milli - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000) / 10
  );
  switch (options.retType) {
    case "dict":
      return {
        hours,
        minutes,
        seconds,
        milliseconds,
      };
    case "string":
      let str =
        `${hours > 10 ? hours + ":" : "0" + hours + ":"}` +
        `${minutes > 10 ? minutes + ":" : "0" + minutes + ":"}` +
        `${seconds > 10 ? seconds + ":" : "0" + seconds + ":"}` +
        `${milliseconds > 10 ? milliseconds : "0" + milliseconds}`;
      return str;
    default:
      return {
        hours,
        minutes,
        seconds,
        milliseconds,
      };
  }
};

export default timeParser;
