// Write a Program that should contains
// 1. Class Person with fields (name, age, salary, sex)
// 2. a static sort function in the class that should take array of Persons and name of the field and order of sorting and should return a new sorted array based on above inputs. Should not change intial array.

// for example Person.sort(arr, 'name', 'asc') -> sort array of persons based on name in ascending order. 'desc' for descending

// 3. You have to write Quick sort for this sorting algorithms.

let Persons = [
  ["John", 24, 48000, "Male"],
  ["Robbie", 16, 10000, "Male"],
  ["Anna", 44, 88000, "Female"],
  ["Shrey", 20, 22000, "Male"],
  ["Priyanka", 18, 50000, "Female"],
  ["Rosy", 23, 35000, "Female"],
  ["Antoinette", 56, 20000, "Female"],
  ["Lavya", 21, 100000, "Male"],
  ["Rishabh", 33, 49000, "Male"],
  ["Sarah", 25, 36000, "Female"],
  ["Astrid", 17, 250000, "Female"],
  ["Osward", 68, 87000, "Male"],
];

class Person {
  constructor(name, age, salary, sex) {
    this.name = name;
    this.age = age;
    this.salary = salary;
    this.sex = sex;
  }
  static sort(arr, attrib, order) {
    // created new array so that original one is not changed
    let new_arr = [...arr];
    let l = 0;
    let r = new_arr.length;
    Person.#quicksort(new_arr, l, r - 1, attrib, order);
    if (order == "desc") new_arr.reverse();
    return new_arr;
  }

  static #quicksort(arr, l, r, attrib, order) {
    if (l < r) {
      // j - > position of sorted pivot from last iteration
      let j = Person.#partition(arr, l, r, attrib, order);
      // run quicksort on arr from l to j-1
      Person.#quicksort(arr, l, j - 1, attrib, order);
      // run quicksort on arr from j+1 to r
      Person.#quicksort(arr, j + 1, r, attrib, order);
    }
  }

  static #partition(arr, l, r, attrib, order) {
    let pivotPos = r;
    let pivot = arr[pivotPos];
    let i = l;
    for (let j = l; j < r; ++j) {
      if (arr[j][attrib] <= pivot[attrib]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
      }
    }
    // swap pivots original position and i
    [arr[pivotPos], arr[i]] = [arr[i], arr[pivotPos]];
    // return the sorted position of the pivot and now run quicksort on left and right of pivot
    return i;
  }
}

let PersonArray = [];
Persons.forEach((person) => {
  PersonArray.push(new Person(...person));
});

let Sorted = Person.sort(PersonArray, "name", "asc");
console.log(Sorted);
