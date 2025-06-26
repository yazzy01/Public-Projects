// 4. Default Parameters

function defaultParamsDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// Setting default parameters (old way)
function greet(name) {
  // Check if name is undefined and set default
  name = name || "Guest";
  return "Hello, " + name + "!";
}

// Example:
greet();        // Returns: "Hello, Guest!"
greet("John");  // Returns: "Hello, John!"

function createUser(username, age, isAdmin) {
  // Multiple default parameters
  username = username || "anonymous";
  age = age || 0;
  isAdmin = isAdmin !== undefined ? isAdmin : false;
  
  return {
    username: username,
    age: age,
    isAdmin: isAdmin
  };
}

// Example:
createUser();  // Returns: { username: "anonymous", age: 0, isAdmin: false }
createUser("john_doe", 25, true);  // Returns: { username: "john_doe", age: 25, isAdmin: true }`;

    // New way (ES6)
    const newWayCode = `// Default parameters (new way)
function greet(name = "Guest") {
  return \`Hello, \${name}!\`;
}

// Example:
greet();        // Returns: "Hello, Guest!"
greet("John");  // Returns: "Hello, John!"

function createUser(username = "anonymous", age = 0, isAdmin = false) {
  return {
    username,
    age,
    isAdmin
  };
}

// Example:
createUser();  // Returns: { username: "anonymous", age: 0, isAdmin: false }
createUser("john_doe", 25, true);  // Returns: { username: "john_doe", age: 25, isAdmin: true }

// Default parameters can be expressions
function getDate(date = new Date()) {
  return date.toDateString();
}

// Example:
getDate();  // Returns: current date as string like "Thu Apr 24 2025"
getDate(new Date("2023-01-01"));  // Returns: "Sun Jan 01 2023"

// Later parameters can use earlier parameters
function multiply(a, b = a) {
  return a * b;
}

// Example:
multiply(5);     // Returns: 25 (5 * 5)
multiply(5, 3);  // Returns: 15 (5 * 3)`;

    // Results
    const oldWayResult = `greet() returns "Hello, Guest!"
greet("John") returns "Hello, John!"

createUser() returns { username: "anonymous", age: 0, isAdmin: false }
createUser("john_doe", 25, true) returns { username: "john_doe", age: 25, isAdmin: true }`;

    const newWayResult = `greet() returns "Hello, Guest!"
greet("John") returns "Hello, John!"

createUser() returns { username: "anonymous", age: 0, isAdmin: false }
createUser("john_doe", 25, true) returns { username: "john_doe", age: 25, isAdmin: true }

getDate() returns the current date as a string
getDate(new Date("2023-01-01")) returns "Sun Jan 01 2023"

multiply(5) returns 25 (5 * 5)
multiply(5, 3) returns 15 (5 * 3)`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Key Features of Default Parameters:</h4>
        <ul>
            <li><strong>Cleaner syntax</strong>: Default values are defined directly in the parameter list</li>
            <li><strong>Expressions allowed</strong>: Default values can be expressions or function calls</li>
            <li><strong>Parameter references</strong>: Later parameters can reference earlier ones</li>
            <li><strong>Undefined triggers default</strong>: Default values are used when parameter is undefined (not for null or other falsy values)</li>
        </ul>
        <p><strong>When to use:</strong></p>
        <ul>
            <li>Use default parameters to make function calls more flexible</li>
            <li>Use default parameters to reduce boilerplate code for parameter checking</li>
            <li>Use default parameters to make function signatures more self-documenting</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
