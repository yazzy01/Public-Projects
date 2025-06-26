// Testing console output
console.log("This is a test message");

// Define your function
function sayHello(name) {
    // Always use console.log to output results
    console.log(`Hello, ${name}!`);
    return `Hello, ${name}!`; // Return value is optional
}

// Call your function to execute it
sayHello("World");

// Example of a calculation function
function calculateArea(length, width) {
    const area = length * width;
    console.log(`The area is: ${area}`);
    return area;
}

// Make sure to call the function with parameters
calculateArea(5, 3);

// If you're working in a browser environment:
// document.getElementById("result").textContent = calculateArea(5, 3);

// This will be displayed in the console
console.log("Script executed successfully!");

// Adding a process.stdout direct write to ensure output is visible
process.stdout.write("Direct output test\n"); 