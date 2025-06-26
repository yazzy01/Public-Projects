// 9. Modules

function modulesDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// Global namespace pollution (very old way)
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

// Using the global functions
console.log(add(5, 3));      // 8
console.log(subtract(5, 3)); // 2

// Immediately Invoked Function Expression (IIFE)
var MathUtils = (function() {
  // Private variables
  var privateVar = 42;
  
  // Private function
  function privateFunc() {
    return privateVar;
  }
  
  // Public API
  return {
    add: function(a, b) {
      return a + b;
    },
    subtract: function(a, b) {
      return a - b;
    },
    getPrivateVar: function() {
      return privateFunc();
    }
  };
})();

// Using the IIFE module
console.log(MathUtils.add(5, 3));         // 8
console.log(MathUtils.subtract(5, 3));    // 2
console.log(MathUtils.getPrivateVar());   // 42
// console.log(privateVar);               // Error: privateVar is not defined

// CommonJS (Node.js)
// In math.js
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

module.exports = {
  add: add,
  subtract: subtract
};

// In main.js
var math = require('./math.js');
console.log(math.add(5, 3));      // 8
console.log(math.subtract(5, 3)); // 2`;

    // New way (ES6)
    const newWayCode = `// ES6 Modules

// In math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

// Named exports
export const PI = 3.14159;

// Default export
export default class Calculator {
  add(a, b) {
    return a + b;
  }
  
  subtract(a, b) {
    return a - b;
  }
}

// Using the exports
console.log(add(5, 3));      // 8
console.log(subtract(5, 3)); // 2
console.log(PI);             // 3.14159
const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(calc.subtract(5, 3)); // 2

// In main.js
// Named imports
import { add, subtract, PI } from './math.js';
console.log(add(5, 3));      // 8
console.log(subtract(5, 3)); // 2
console.log(PI);             // 3.14159

// Default import
import Calculator from './math.js';
const calc = new Calculator();
console.log(calc.add(5, 3)); // 8
console.log(calc.subtract(5, 3)); // 2

// Import all as namespace
import * as math from './math.js';
console.log(math.add(5, 3));      // 8
console.log(math.PI);             // 3.14159
console.log(math.default);        // Calculator class

// Mixed imports
import Calculator, { add, PI } from './math.js';
console.log(add(5, 3));      // 8
console.log(PI);             // 3.14159
const calc = new Calculator();
console.log(calc.add(5, 3)); // 8

// HTML usage
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import { add } from './math.js';
    console.log(add(5, 3)); // 8
  </script>
</head>
<body>
  <!-- Content here -->
</body>
</html>`;

    // Results
    const oldWayResult = `Global: Functions pollute global namespace
add(5, 3) returns 8
subtract(5, 3) returns 2

IIFE: 
MathUtils.add(5, 3) returns 8
MathUtils.getPrivateVar() returns 42
privateVar is not accessible (encapsulation)

CommonJS: 
math.add(5, 3) returns 8
Requires bundlers like Browserify or Webpack for browser use`;

    const newWayResult = `Named imports:
add(5, 3) returns 8
subtract(5, 3) returns 2
PI is 3.14159

Default import:
calc.add(5, 3) returns 8

Namespace import:
math.add(5, 3) returns 8
math.PI is 3.14159

Native browser support with <script type="module">
Static analysis possible at build time
Tree-shaking for smaller bundles`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Key Features of ES6 Modules:</h4>
        <ul>
            <li><strong>File-based modules</strong>: Each file is its own module with its own scope</li>
            <li><strong>Static structure</strong>: Imports and exports are determined at compile time</li>
            <li><strong>Named exports</strong>: Export multiple values from a module</li>
            <li><strong>Default export</strong>: Export a single main value from a module</li>
            <li><strong>Import as namespace</strong>: Import all exports as a namespace object</li>
        </ul>
        <p><strong>Using in HTML:</strong></p>
        <pre>&lt;script type="module" src="main.js"&gt;&lt;/script&gt;</pre>
        <p><strong>Important Notes:</strong></p>
        <ul>
            <li>Modules are executed in strict mode by default</li>
            <li>Modules have their own scope (not global)</li>
            <li>Modules are loaded asynchronously</li>
            <li>Imports are hoisted</li>
            <li>Modules are cached after first load</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
