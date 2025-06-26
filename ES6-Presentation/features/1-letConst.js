// 1. Let and Const Declarations

function letConstDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// Using var (old way)
var name = "John";
var name = "Jane"; // Redeclaration works
console.log(name); // "Jane"

function scopeTest() {
  var x = 10;
  if (true) {
    var x = 20; // Same variable!
    console.log(x); // 20
  }
  console.log(x); // Also 20 - the variable was changed
}

scopeTest();`;

    // New way (ES6)
    const newWayCode = `// Using let and const (new way)
let age = 25;
age = 26; // Reassignment works
console.log(age); // 26
// let age = 30; // This would cause an error (can't redeclare)

const PI = 3.14;
console.log(PI); // 3.14
// PI = 3.15; // This would cause an error (can't reassign)

function betterScopeTest() {
  let y = 10;
  if (true) {
    let y = 20; // Different variable due to block scope
    console.log(y); // 20
  }
  console.log(y); // 10 - the outer variable is unchanged
}

betterScopeTest();`;

    // Results
    const oldWayResult = `"Jane" (name was redeclared)
20 (inner scope)
20 (outer scope - value was changed)`;

    const newWayResult = `26 (age was reassigned)
Error if trying to redeclare with let
3.14
Error if trying to reassign const
20 (inner block scope)
10 (outer scope - value preserved)`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Key Differences:</h4>
        <ul>
            <li><strong>var</strong>: Function-scoped, can be redeclared, hoisted</li>
            <li><strong>let</strong>: Block-scoped, can be reassigned but not redeclared, not hoisted in the same way</li>
            <li><strong>const</strong>: Block-scoped, cannot be reassigned or redeclared, not hoisted in the same way</li>
        </ul>
        <p><strong>When to use:</strong></p>
        <ul>
            <li>Use <strong>const</strong> by default (for values that won't change)</li>
            <li>Use <strong>let</strong> when you need to reassign values</li>
            <li>Avoid <strong>var</strong> in modern JavaScript</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
