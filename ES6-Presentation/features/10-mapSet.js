// 10. Map and Set

function mapSetDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// Using objects as maps (old way)
var userRoles = {};

// Adding entries
userRoles["john"] = "admin";
userRoles["jane"] = "editor";
console.log(userRoles); // { john: "admin", jane: "editor" }

// Checking if a key exists
var hasJohn = userRoles.hasOwnProperty("john");
console.log(hasJohn); // true

// Getting a value
var johnsRole = userRoles["john"];
console.log(johnsRole); // "admin"

// Problems with objects as maps
userRoles["toString"] = "override"; // Overrides Object.prototype.toString
console.log(userRoles.toString); // "override" instead of the function
var keys = Object.keys(userRoles);
console.log(keys); // ["john", "jane", "toString"]

// Using arrays for unique values
function uniqueArray(array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    if (result.indexOf(array[i]) === -1) {
      result.push(array[i]);
    }
  }
  return result;
}

var numbers = [1, 2, 3, 3, 4, 4, 5];
var unique = uniqueArray(numbers);
console.log(unique); // [1, 2, 3, 4, 5]`;

    // New way (ES6)
    const newWayCode = `// Map (new way)
const userRoles = new Map();

// Adding entries
userRoles.set("john", "admin");
userRoles.set("jane", "editor");
console.log(userRoles); // Map { "john" => "admin", "jane" => "editor" }

// Checking if a key exists
const hasJohn = userRoles.has("john");
console.log(hasJohn); // true

// Getting a value
const johnsRole = userRoles.get("john");
console.log(johnsRole); // "admin"

// Map advantages
const documentObj = { title: "test" };
userRoles.set(documentObj, "special"); // Can use objects as keys
console.log(userRoles.get(documentObj)); // "special"

const funcKey = function() {};
userRoles.set(funcKey, "function key");
console.log(userRoles.get(funcKey)); // "function key"

// Map methods
console.log(userRoles.size); // 4 (Number of entries)
userRoles.delete("john"); // Remove an entry
console.log(userRoles.has("john")); // false
// userRoles.clear(); // Remove all entries

// Iterating over a Map
for (const [user, role] of userRoles) {
  console.log(\`\${user} is a \${role}\`);
  // "jane is a editor"
  // "[object Object] is a special"
  // "function() {} is a function key"
}

// Set (new way)
const uniqueNumbers = new Set([1, 2, 3, 3, 4, 4, 5]);
console.log(uniqueNumbers); // Set { 1, 2, 3, 4, 5 }

// Set methods
uniqueNumbers.add(6);
console.log(uniqueNumbers); // Set { 1, 2, 3, 4, 5, 6 }

console.log(uniqueNumbers.has(4)); // true
uniqueNumbers.delete(3);
console.log(uniqueNumbers); // Set { 1, 2, 4, 5, 6 }

console.log(uniqueNumbers.size); // 5 (Number of values)

// Convert Set back to Array
const uniqueArray = [...uniqueNumbers];
console.log(uniqueArray); // [1, 2, 4, 5, 6]

// Iterating over a Set
for (const num of uniqueNumbers) {
  console.log(num);
  // 1
  // 2
  // 4
  // 5
  // 6
}`;

    // Results
    const oldWayResult = `userRoles = { john: "admin", jane: "editor" }
hasJohn = true
johnsRole = "admin"

Problems:
- Can't use objects as keys
- Prototype properties can cause issues
- No built-in methods for size, iteration

unique = [1, 2, 3, 4, 5]
But requires custom implementation`;

    const newWayResult = `userRoles = Map { "john" => "admin", "jane" => "editor" }
hasJohn = true
johnsRole = "admin"

Advantages:
- Can use any value as a key (including objects)
- Built-in methods: set, get, has, delete, clear
- size property
- Easy iteration with for...of

uniqueNumbers = Set { 1, 2, 3, 4, 5 }
uniqueArray = [1, 2, 4, 5, 6]
Built-in methods: add, has, delete, clear`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Map:</h4>
        <ul>
            <li><strong>Purpose</strong>: Collection of key-value pairs where keys can be any type</li>
            <li><strong>Advantages over Objects</strong>:
                <ul>
                    <li>Any value can be a key (including objects and functions)</li>
                    <li>Maintains insertion order</li>
                    <li>Has a size property</li>
                    <li>No risk of key collision with prototype properties</li>
                    <li>Better performance for frequent additions/removals</li>
                </ul>
            </li>
            <li><strong>Common methods</strong>: set(), get(), has(), delete(), clear()</li>
        </ul>
        
        <h4>Set:</h4>
        <ul>
            <li><strong>Purpose</strong>: Collection of unique values of any type</li>
            <li><strong>Advantages over Arrays</strong>:
                <ul>
                    <li>Automatically ensures uniqueness</li>
                    <li>Faster lookups with has()</li>
                    <li>Easier to add/remove elements</li>
                    <li>Has a size property</li>
                </ul>
            </li>
            <li><strong>Common methods</strong>: add(), has(), delete(), clear()</li>
        </ul>
        
        <h4>When to use:</h4>
        <ul>
            <li>Use <strong>Map</strong> when you need key-value pairs with keys of any type</li>
            <li>Use <strong>Set</strong> when you need a collection of unique values</li>
            <li>Use <strong>Object</strong> when keys are strings or symbols and you need JSON support</li>
            <li>Use <strong>Array</strong> when you need ordered elements with duplicates</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
