// 6. Spread and Rest Operators

function spreadRestDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// Combining arrays (old way)
var array1 = [1, 2, 3];
var array2 = [4, 5, 6];
var combined = array1.concat(array2);
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Copying arrays
var original = [1, 2, 3];
var copy = original.slice();
console.log(copy); // [1, 2, 3]

// Converting array-like objects to arrays
var divs = document.querySelectorAll('div');
var divsArray = Array.prototype.slice.call(divs);
console.log(divsArray); // [div, div, ...] (array of div elements)

// Passing multiple arguments
function sum() {
  var numbers = Array.prototype.slice.call(arguments);
  return numbers.reduce(function(total, num) {
    return total + num;
  }, 0);
}
console.log(sum(1, 2, 3)); // 6

// Merging objects
var obj1 = { a: 1, b: 2 };
var obj2 = { c: 3, d: 4 };
var merged = Object.assign({}, obj1, obj2);
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }`;

    // New way (ES6)
    const newWayCode = `// Spread operator with arrays
const array1 = [1, 2, 3];
const array2 = [4, 5, 6];
const combined = [...array1, ...array2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Copying arrays
const original = [1, 2, 3];
const copy = [...original];
console.log(copy); // [1, 2, 3]

// Adding elements
const newArray = [0, ...original, 4];
console.log(newArray); // [0, 1, 2, 3, 4]

// Converting iterables to arrays
const divs = document.querySelectorAll('div');
const divsArray = [...divs];
console.log(divsArray); // [div, div, ...] (array of div elements)

// Rest parameter in functions
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}
console.log(sum(1, 2, 3)); // 6

// Spread operator with objects
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, d: 4 };
const merged = { ...obj1, ...obj2 };
console.log(merged); // { a: 1, b: 2, c: 3, d: 4 }

// Overriding properties
const updated = { ...obj1, b: 3 };
console.log(updated); // { a: 1, b: 3 }`;

    // Results
    const oldWayResult = `combined = [1, 2, 3, 4, 5, 6]
copy = [1, 2, 3] (new array)
divsArray = [div, div, ...] (array of div elements)
sum(1, 2, 3) returns 6
merged = { a: 1, b: 2, c: 3, d: 4 }`;

    const newWayResult = `combined = [1, 2, 3, 4, 5, 6]
copy = [1, 2, 3] (new array)
newArray = [0, 1, 2, 3, 4]
divsArray = [div, div, ...] (array of div elements)
sum(1, 2, 3) returns 6
merged = { a: 1, b: 2, c: 3, d: 4 }
updated = { a: 1, b: 3 }`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Key Features of Spread and Rest Operators:</h4>
        <ul>
            <li><strong>Spread operator (...)</strong>: Expands an iterable (array, string) or an object into individual elements</li>
            <li><strong>Rest parameter (...)</strong>: Collects multiple elements into an array</li>
            <li><strong>Same syntax, different contexts</strong>: They look the same but do opposite things</li>
        </ul>
        <p><strong>Use cases for Spread operator:</strong></p>
        <ul>
            <li>Combining arrays</li>
            <li>Copying arrays and objects</li>
            <li>Converting iterables to arrays</li>
            <li>Passing multiple arguments to functions</li>
            <li>Creating shallow copies with modifications</li>
        </ul>
        <p><strong>Use cases for Rest parameter:</strong></p>
        <ul>
            <li>Handling variable number of function arguments</li>
            <li>Collecting remaining array elements in destructuring</li>
            <li>Collecting remaining object properties in destructuring</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
