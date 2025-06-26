// 2. Arrow Functions

function arrowFunctionsDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// Function declaration (old way)
function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // 5

// Function expression
var multiply = function(a, b) {
  return a * b;
};
console.log(multiply(2, 3)); // 6

// Function with context issues
var person = {
  name: 'John',
  sayHello: function() {
    var self = this; // Need to store 'this'
    setTimeout(function() {
      console.log('Hello, my name is ' + self.name);
      // Output: "Hello, my name is John"
    }, 1000);
  }
};

person.sayHello();`;

    // New way (ES6)
    const newWayCode = `// Arrow function (new way)
const add = (a, b) => a + b;
console.log(add(2, 3)); // 5

// Arrow function with multiple lines
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
console.log(multiply(2, 3)); // 6

// Arrow functions don't have their own 'this'
const person = {
  name: 'John',
  sayHello: function() {
    setTimeout(() => {
      console.log(\`Hello, my name is \${this.name}\`);
      // Output: "Hello, my name is John"
    }, 1000);
  }
};

person.sayHello();`;

    // Results
    const oldWayResult = `add(2, 3) returns 5
multiply(2, 3) returns 6
"Hello, my name is John" (after using self = this workaround)`;

    const newWayResult = `add(2, 3) returns 5
multiply(2, 3) returns 6
"Hello, my name is John" (arrow function preserves 'this')`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Key Differences:</h4>
        <ul>
            <li><strong>Syntax</strong>: Arrow functions have a more concise syntax</li>
            <li><strong>Implicit return</strong>: Single expressions don't need a return statement</li>
            <li><strong>'this' binding</strong>: Arrow functions don't have their own 'this', they inherit it from the parent scope</li>
            <li><strong>No 'arguments' object</strong>: Arrow functions don't have their own arguments object</li>
        </ul>
        <p><strong>When to use:</strong></p>
        <ul>
            <li>Use arrow functions for short, simple functions</li>
            <li>Use arrow functions when you need to preserve the 'this' context</li>
            <li>Use regular functions when you need 'this' to refer to the function's caller</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
