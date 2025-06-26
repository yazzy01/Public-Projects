// 7. Classes

function classesDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// Constructor functions (old way)
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Adding methods to prototype
Person.prototype.greet = function() {
  return "Hello, my name is " + this.name + " and I am " + this.age + " years old.";
};

// Static methods
Person.create = function(name, age) {
  return new Person(name, age);
};

// Creating instances
var john = new Person("John", 30);
console.log(john.greet()); // "Hello, my name is John and I am 30 years old."

var jane = Person.create("Jane", 25);
console.log(jane.greet()); // "Hello, my name is Jane and I am 25 years old."

// Inheritance
function Student(name, age, grade) {
  // Call parent constructor
  Person.call(this, name, age);
  this.grade = grade;
}

// Set up inheritance
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

// Add methods to child
Student.prototype.study = function() {
  return this.name + " is studying hard!";
};

// Creating a student
var bob = new Student("Bob", 18, 12);
console.log(bob.greet()); // "Hello, my name is Bob and I am 18 years old."
console.log(bob.study()); // "Bob is studying hard!"`;

    // New way (ES6)
    const newWayCode = `// Classes (new way)
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Instance method
  greet() {
    return \`Hello, my name is \${this.name} and I am \${this.age} years old.\`;
  }
  
  // Static method
  static create(name, age) {
    return new Person(name, age);
  }
}

// Creating instances
const john = new Person("John", 30);
console.log(john.greet()); // "Hello, my name is John and I am 30 years old."

const jane = Person.create("Jane", 25);
console.log(jane.greet()); // "Hello, my name is Jane and I am 25 years old."

// Inheritance
class Student extends Person {
  constructor(name, age, grade) {
    // Call parent constructor
    super(name, age);
    this.grade = grade;
  }
  
  // Add methods to child
  study() {
    return \`\${this.name} is studying hard!\`;
  }
  
  // Override parent method
  greet() {
    return \`\${super.greet()} I'm in grade \${this.grade}.\`;
  }
}

// Creating a student
const bob = new Student("Bob", 18, 12);
console.log(bob.greet()); // "Hello, my name is Bob and I am 18 years old. I'm in grade 12."
console.log(bob.study()); // "Bob is studying hard!"`;

    // Results
    const oldWayResult = `const john = new Person("John", 30);
john.greet() returns "Hello, my name is John and I am 30 years old."

const jane = Person.create("Jane", 25);
jane.greet() returns "Hello, my name is Jane and I am 25 years old."

const bob = new Student("Bob", 18, 12);
bob.greet() returns "Hello, my name is Bob and I am 18 years old."
bob.study() returns "Bob is studying hard!"`;

    const newWayResult = `const john = new Person("John", 30);
john.greet() returns "Hello, my name is John and I am 30 years old."

const jane = Person.create("Jane", 25);
jane.greet() returns "Hello, my name is Jane and I am 25 years old."

const bob = new Student("Bob", 18, 12);
bob.greet() returns "Hello, my name is Bob and I am 18 years old. I'm in grade 12."
bob.study() returns "Bob is studying hard!"`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Key Features of ES6 Classes:</h4>
        <ul>
            <li><strong>Class syntax</strong>: Cleaner, more intuitive syntax for creating objects and handling inheritance</li>
            <li><strong>Constructor method</strong>: Special method for creating and initializing objects</li>
            <li><strong>Instance methods</strong>: Methods that are available on instances of the class</li>
            <li><strong>Static methods</strong>: Methods that are called on the class itself, not on instances</li>
            <li><strong>Inheritance</strong>: Extends keyword for creating subclasses</li>
            <li><strong>Super keyword</strong>: Call parent class constructor and methods</li>
        </ul>
        <p><strong>Important Notes:</strong></p>
        <ul>
            <li>Classes are not hoisted (must be defined before use)</li>
            <li>Class methods are non-enumerable</li>
            <li>Class methods don't need the 'function' keyword</li>
            <li>Classes are just syntactic sugar over the prototype-based inheritance</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
