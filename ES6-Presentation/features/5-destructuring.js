// 5. Destructuring

function destructuringDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// Extracting values from objects (old way)
var person = {
  name: "John",
  age: 30,
  city: "New York",
  address: {
    street: "123 Main St",
    zip: "10001"
  }
};

// Extract values from object
var name = person.name;
var age = person.age;
var street = person.address.street;

console.log(name);  // "John"
console.log(age);   // 30
console.log(street); // "123 Main St"

// Extracting values from arrays (old way)
var colors = ["red", "green", "blue"];

var firstColor = colors[0];
var secondColor = colors[1];

console.log(firstColor);  // "red"
console.log(secondColor); // "green"

// Swapping variables (old way)
var a = 1;
var b = 2;
var temp = a;
a = b;
b = temp;

console.log(a); // 2
console.log(b); // 1`;

    // New way (ES6)
    const newWayCode = `// Object destructuring (new way)
const person = {
  name: "John",
  age: 30,
  city: "New York",
  address: {
    street: "123 Main St",
    zip: "10001"
  }
};

// Basic destructuring
const { name, age } = person;
console.log(name); // "John"
console.log(age);  // 30

// Nested destructuring
const { address: { street } } = person;
console.log(street); // "123 Main St"

// With different variable names
const { name: fullName, age: years } = person;
console.log(fullName); // "John"
console.log(years);    // 30

// With default values
const { country = "USA" } = person;
console.log(country);  // "USA" (default value)

// Array destructuring
const colors = ["red", "green", "blue"];

// Basic array destructuring
const [first, second] = colors;
console.log(first);  // "red"
console.log(second); // "green"

// Skip elements
const [, , third] = colors;
console.log(third);  // "blue"

// With rest operator
const [primary, ...secondaryColors] = colors;
console.log(primary);          // "red"
console.log(secondaryColors);  // ["green", "blue"]

// Swapping variables
let a = 1;
let b = 2;
[a, b] = [b, a];
console.log(a); // 2
console.log(b); // 1`;

    // Results
    const oldWayResult = `name = "John"
age = 30
street = "123 Main St"

firstColor = "red"
secondColor = "green"

After swap: a = 2, b = 1`;

    const newWayResult = `name = "John"
age = 30
street = "123 Main St"

fullName = "John"
years = 30

country = "USA" (default value)

first = "red"
second = "green"
third = "blue"
secondaryColors = ["green", "blue"]

After swap: a = 2, b = 1`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Key Features of Destructuring:</h4>
        <ul>
            <li><strong>Object destructuring</strong>: Extract multiple properties from objects in a single statement</li>
            <li><strong>Array destructuring</strong>: Extract multiple elements from arrays in a single statement</li>
            <li><strong>Default values</strong>: Provide fallback values if the property doesn't exist</li>
            <li><strong>Nested destructuring</strong>: Extract values from nested objects or arrays</li>
            <li><strong>Variable renaming</strong>: Assign object properties to differently named variables</li>
            <li><strong>Rest pattern</strong>: Collect remaining properties/elements into a new object/array</li>
        </ul>
        <p><strong>When to use:</strong></p>
        <ul>
            <li>Use destructuring to extract multiple values from objects or arrays</li>
            <li>Use destructuring in function parameters to handle complex objects</li>
            <li>Use destructuring for cleaner variable assignments</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
