// ES6 Console Demonstration
// Copy and paste these examples one by one into the browser console

// ===== 1. LET AND CONST =====
console.log("===== 1. LET AND CONST =====");

// Let allows reassignment
let name = "John";
console.log(name); // John

name = "Jane";
console.log(name); // Jane

// Const prevents reassignment
const PI = 3.14;
console.log(PI); // 3.14

// This would cause an error:
// PI = 3.15;

// Block scope demonstration
function scopeDemo() {
  var x = 10;
  let y = 20;
  
  if (true) {
    var x = 30; // Same variable
    let y = 40; // Different variable
    console.log("Inside block: x =", x, "y =", y); // x = 30, y = 40
  }
  
  console.log("Outside block: x =", x, "y =", y); // x = 30, y = 20
}

// Run scope demo
scopeDemo();


// ===== 2. ARROW FUNCTIONS =====
console.log("\n===== 2. ARROW FUNCTIONS =====");

// Old way
const oldAdd = function(a, b) {
  return a + b;
};

// Arrow function - concise
const add = (a, b) => a + b;

console.log(oldAdd(5, 3)); // 8
console.log(add(5, 3)); // 8

// Arrow function with multiple lines
const multiply = (a, b) => {
  const result = a * b;
  return result;
};

console.log(multiply(4, 5)); // 20

// Arrow functions and this keyword
const person = {
  name: "John",
  sayHiOld: function() {
    setTimeout(function() {
      console.log("Hi, my name is " + this.name); // 'this' is not person here!
    }, 10);
  },
  sayHiNew: function() {
    setTimeout(() => {
      console.log("Hi, my name is " + this.name); // 'this' is person
    }, 10);
  }
};

person.sayHiOld(); // Hi, my name is undefined
person.sayHiNew(); // Hi, my name is John


// ===== 3. TEMPLATE LITERALS =====
console.log("\n===== 3. TEMPLATE LITERALS =====");

const user = "Ahmed";
const age = 25;

// Old way
const oldGreeting = "Hello, " + user + "! You are " + age + " years old.";
console.log(oldGreeting);

// New way with template literals
const newGreeting = `Hello, ${user}! You are ${age} years old.`;
console.log(newGreeting);

// Multi-line strings
const oldMultiline = "This is line 1.\n" +
                     "This is line 2.\n" +
                     "This is line 3.";
console.log(oldMultiline);

const newMultiline = `This is line 1.
This is line 2.
This is line 3.`;
console.log(newMultiline);

// Expressions in template literals
console.log(`5 + 10 = ${5 + 10}`); // 5 + 10 = 15


// ===== 4. DEFAULT PARAMETERS =====
console.log("\n===== 4. DEFAULT PARAMETERS =====");

// Old way
function greetOld(name) {
  name = name || "Guest";
  return "Hello, " + name;
}

// New way
function greetNew(name = "Guest") {
  return `Hello, ${name}`;
}

console.log(greetOld()); // Hello, Guest
console.log(greetOld("Sarah")); // Hello, Sarah

console.log(greetNew()); // Hello, Guest
console.log(greetNew("Sarah")); // Hello, Sarah

// Multiple default parameters
function createUser(username = "anonymous", age = 0, isAdmin = false) {
  return { username, age, isAdmin };
}

console.log(createUser()); // {username: "anonymous", age: 0, isAdmin: false}
console.log(createUser("john_doe", 30, true)); // {username: "john_doe", age: 30, isAdmin: true}


// ===== 5. DESTRUCTURING =====
console.log("\n===== 5. DESTRUCTURING =====");

// Object destructuring
const student = {
  firstName: "Ahmed",
  lastName: "Alaoui",
  age: 20,
  scores: {
    math: 95,
    science: 88
  }
};

// Old way
const firstNameOld = student.firstName;
const lastNameOld = student.lastName;
const mathScoreOld = student.scores.math;

console.log(firstNameOld, lastNameOld, mathScoreOld);

// New way - destructuring
const { firstName, lastName, age: studentAge } = student;
const { scores: { math, science } } = student;

console.log(firstName, lastName, studentAge); // Ahmed Alaoui 20
console.log(math, science); // 95 88

// Array destructuring
const colors = ["red", "green", "blue", "yellow", "purple"];

// Old way
const firstColor = colors[0];
const secondColor = colors[1];

// New way
const [first, second, ...restColors] = colors;

console.log(first, second); // red green
console.log(restColors); // ["blue", "yellow", "purple"]


// ===== 6. SPREAD AND REST OPERATORS =====
console.log("\n===== 6. SPREAD AND REST OPERATORS =====");

// Spread with arrays
const numbers1 = [1, 2, 3];
const numbers2 = [4, 5, 6];

// Old way to combine
const combinedOld = numbers1.concat(numbers2);
console.log(combinedOld); // [1, 2, 3, 4, 5, 6]

// New way with spread
const combinedNew = [...numbers1, ...numbers2];
console.log(combinedNew); // [1, 2, 3, 4, 5, 6]

// Adding items in the middle
const withExtra = [...numbers1, 100, ...numbers2];
console.log(withExtra); // [1, 2, 3, 100, 4, 5, 6]

// Spread with objects
const person1 = { name: "John", age: 30 };
const person2 = { ...person1, city: "Casablanca", age: 31 };

console.log(person2); // {name: "John", age: 31, city: "Casablanca"}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2, 3, 4, 5)); // 15


// ===== 7. CLASSES =====
console.log("\n===== 7. CLASSES =====");

// ES6 Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  greet() {
    return `Hello, my name is ${this.name} and I am ${this.age} years old.`;
  }
  
  // Static method
  static create(name, age) {
    return new Person(name, age);
  }
}

// Creating objects
const john = new Person("John", 30);
console.log(john.greet()); // Hello, my name is John and I am 30 years old.

const jane = Person.create("Jane", 25);
console.log(jane.greet()); // Hello, my name is Jane and I am 25 years old.

// Inheritance
class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }
  
  study() {
    return `${this.name} is studying hard!`;
  }
  
  // Override parent method
  greet() {
    return `${super.greet()} I'm in grade ${this.grade}.`;
  }
}

const ali = new Student("Ali", 18, 12);
console.log(ali.greet()); // Hello, my name is Ali and I am 18 years old. I'm in grade 12.
console.log(ali.study()); // Ali is studying hard!


// ===== 8. PROMISES =====
console.log("\n===== 8. PROMISES =====");

// Simple promise example
const fetchData = () => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve("Data successfully fetched!");
      } else {
        reject("Error fetching data");
      }
    }, 1000);
  });
};

// Using the promise
console.log("Starting promise demo...");
fetchData()
  .then(data => {
    console.log("Promise resolved:", data);
    return "Processing " + data;
  })
  .then(message => {
    console.log("Promise chaining:", message);
  })
  .catch(error => {
    console.error("Promise rejected:", error);
  });

// Async/await (run this in the console separately)
async function fetchDemo() {
  try {
    console.log("Starting async/await demo...");
    const data = await fetchData();
    console.log("Async/await resolved:", data);
    return data;
  } catch (error) {
    console.error("Async/await error:", error);
  }
}

// Call the async function
fetchDemo().then(result => {
  console.log("Async function returned:", result);
});


// ===== 9. MAP AND SET =====
console.log("\n===== 9. MAP AND SET =====");

// Map example
const userRoles = new Map();

// Adding entries
userRoles.set("john", "admin");
userRoles.set("jane", "editor");
userRoles.set("bob", "user");

console.log(userRoles.get("john")); // admin
console.log(userRoles.has("jane")); // true
console.log(userRoles.size); // 3

// You can use objects as keys
const userObject = { id: 1, name: "Ahmed" };
userRoles.set(userObject, "special");
console.log(userRoles.get(userObject)); // special

// Set example
const uniqueNumbers = new Set([1, 2, 3, 3, 4, 4, 5]);
console.log(uniqueNumbers); // Set(5) {1, 2, 3, 4, 5}

uniqueNumbers.add(6);
uniqueNumbers.add(1); // Duplicate, won't be added
console.log(uniqueNumbers); // Set(6) {1, 2, 3, 4, 5, 6}

console.log(uniqueNumbers.has(4)); // true
uniqueNumbers.delete(3);
console.log([...uniqueNumbers]); // [1, 2, 4, 5, 6]


// ===== 10. MODULES =====
console.log("\n===== 10. MODULES =====");

// Note: This part can't be demonstrated directly in console
// Show this code and explain how it works in real projects

/*
// math.js - Exporting
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14;

export default class Calculator {
  multiply(a, b) {
    return a * b;
  }
}

// main.js - Importing
import Calculator, { add, subtract, PI } from './math.js';

console.log(add(5, 3)); // 8
console.log(PI); // 3.14

const calc = new Calculator();
console.log(calc.multiply(4, 5)); // 20
*/

console.log("Modules can't be demonstrated directly in console, but they're essential for organizing code in real projects!");
