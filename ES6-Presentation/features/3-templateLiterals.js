// 3. Template Literals

function templateLiteralsDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// String concatenation (old way)
var name = "John";
var age = 30;

// Basic concatenation
var greeting = "Hello, " + name + "!";
console.log(greeting); // "Hello, John!"

// Multiline strings
var multiline = "This is a multiline string\\n" +
                "that requires escape characters\\n" +
                "and concatenation.";
console.log(multiline);
// Output:
// "This is a multiline string
// that requires escape characters
// and concatenation."

// String with expressions
var message = name + " is " + age + " years old.";
console.log(message); // "John is 30 years old."`;

    // New way (ES6)
    const newWayCode = `// Template literals (new way)
const name = "John";
const age = 30;

// Basic template literal
const greeting = \`Hello, \${name}!\`;
console.log(greeting); // "Hello, John!"

// Multiline strings
const multiline = \`This is a multiline string
that doesn't require escape characters
or concatenation.\`;
console.log(multiline);
// Output:
// "This is a multiline string
// that doesn't require escape characters
// or concatenation."

// Template literal with expressions
const message = \`\${name} is \${age} years old.\`;
console.log(message); // "John is 30 years old."

// Template literals with expressions
const sum = \`2 + 3 = \${2 + 3}\`;
console.log(sum); // "2 + 3 = 5"`;

    // Results
    const oldWayResult = `"Hello, John!"

"This is a multiline string
that requires escape characters
and concatenation."

"John is 30 years old."`;

    const newWayResult = `"Hello, John!"

"This is a multiline string
that doesn't require escape characters
or concatenation."

"John is 30 years old."

"2 + 3 = 5"`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Key Features of Template Literals:</h4>
        <ul>
            <li><strong>String interpolation</strong>: Embed expressions with \${expression}</li>
            <li><strong>Multiline strings</strong>: Create multiline strings without escape characters</li>
            <li><strong>Expression evaluation</strong>: Expressions inside \${} are evaluated</li>
            <li><strong>Tagged templates</strong>: Process template literals with a function (advanced)</li>
        </ul>
        <p><strong>When to use:</strong></p>
        <ul>
            <li>Use template literals whenever you need to combine strings with variables</li>
            <li>Use template literals for multiline strings</li>
            <li>Use template literals when building HTML templates</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
