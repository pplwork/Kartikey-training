// Task 1
// Implement syntax of the following in javascripts :

//  • Loops
//  • If, else and switch statements
//  • Writing functions making use of the above

const forLoop = () => {
  // for loop syntax
  // for(initialization,condition,increment/decrement etc)
  // let us take an array of names
  let names = [
    "James",
    "Jacob",
    "Jackson",
    "Jordan",
    "Jared",
    "Jude",
    "Jeremiah",
    "James",
  ];
  for (let i = 0; i < names.length; ++i) console.log(names[i]);
};

const forInLoop = () => {
  // for-in loop syntax
  // for(let property in object)
  // let us take an object
  let laptop = {
    ram: "8gb DDR4",
    processor: "Ryzen5 4600hs",
    display: "300Nits, 100% SRGB",
    battery: "76Wh",
    gpu: "Gtx 1650",
  };
  for (let part in laptop)
    console.log(`The laptop has ${laptop[part]} as its ${part}`);
};

const forOfLoop = () => {
  // for-of loop syntax
  // for(let value of iterable)
  let str = "Break this string up";
  for (let char of str) console.log(char);
};

const whileLoop = () => {
  // while loop syntax
  // while(condition)
  let s = "Stop before the Z character.";
  let i = 0;
  let output = "";
  while (s[i] != "Z") output += s[i++];
  console.log(output);
};

const doWhileLoop = () => {
  // do while syntax
  // do{}while(condition)
  let s = "Stop before the Z character.";
  let i = 0;
  let output = "";
  do output += s[i++];
  while (s[i] != "Z");
  console.log(output);
};

// A simple scenario: Suppose Jon is waiting for the result of an exam, and he plans a vacation based on his exam score.
// The exam result is divided into 4 rankings: A, B, C, and D:
// If Jon gets an A, he rewards himself and goes for travel happily.
// If Jon gets a B, the reward drops to normal shopping.
// If Jon gets a C, he stays home and watches TV.
// If Jon gets a D, he’ll go to the library and work on the subject.

const travel = () => {
  console.log("John Travels");
};
const shop = () => {
  console.log("John Shops");
};
const watch = () => {
  console.log("John Watches Tv");
};
const study = () => {
  console.log("John studies in the library");
};

let results = ["A", "B", "C", "D"];
const ifElse = () => {
  let result = results[Math.floor(Math.random() * 4)];
  // using simple if else
  if (result == "A") travel();
  else if (result == "B") shop();
  else if (result == "C") watch();
  else if (result == "D") study();
};

const switchCase = () => {
  // using switch case
  let result = results[Math.floor(Math.random() * 4)];
  switch (result) {
    case "A":
      travel();
      break;
    case "B":
      shop();
      break;
    case "C":
      watch();
      break;
    case "D":
      study();
      break;
  }
};

const objConditional = () => {
  // optimizing using an object
  // obj={key:action}
  // key in obj can only be string,symbol
  let result = results[Math.floor(Math.random() * 4)];
  let actions = {
    A: travel,
    B: shop,
    C: watch,
    D: study,
  };
  let action = actions[result];
  action();
};

const mapConditional = () => {
  // optimizing further using map
  // advantages - key can be any data type , can get the number of map entries using map.size
  let result = results[Math.floor(Math.random() * 4)];
  actions = new Map([
    ["A", travel],
    ["B", shop],
    ["C", watch],
    ["D", study],
  ]);
  action = actions.get(result);
  action();
};

// Example Functions
// forLoop();
// forInLoop();
// forOfLoop();
// whileLoop();
// doWhileLoop();
// ifElse();
// switchCase();
// objConditional();
// mapConditional();
forLoop();
forInLoop();
forOfLoop();
whileLoop();
doWhileLoop();
ifElse();
switchCase();
objConditional();
mapConditional();
