// 8. Promises

function promisesDemo(outputElement) {
    // Old way (ES5)
    const oldWayCode = `// Callbacks (old way)
function fetchData(callback) {
  // Simulate API call
  setTimeout(function() {
    const data = { name: "John", age: 30 };
    console.log("Data fetched:", data);
    callback(null, data); // null means no error
  }, 1000);
}

function processData(data, callback) {
  // Process the data
  setTimeout(function() {
    data.processed = true;
    console.log("Data processed:", data);
    callback(null, data);
  }, 1000);
}

function saveData(data, callback) {
  // Save the data
  setTimeout(function() {
    data.saved = true;
    console.log("Data saved:", data);
    callback(null, data);
  }, 1000);
}

// Callback hell
fetchData(function(err, data) {
  if (err) {
    console.error("Error fetching data:", err);
    return;
  }
  
  processData(data, function(err, processedData) {
    if (err) {
      console.error("Error processing data:", err);
      return;
    }
    
    saveData(processedData, function(err, savedData) {
      if (err) {
        console.error("Error saving data:", err);
        return;
      }
      
      console.log("Final result:", savedData);
      // Output: { name: "John", age: 30, processed: true, saved: true }
    });
  });
});`;

    // New way (ES6)
    const newWayCode = `// Promises (new way)
function fetchData() {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      const data = { name: "John", age: 30 };
      console.log("Data fetched:", data);
      resolve(data);
      // If there was an error:
      // reject(new Error("Failed to fetch data"));
    }, 1000);
  });
}

function processData(data) {
  return new Promise((resolve, reject) => {
    // Process the data
    setTimeout(() => {
      data.processed = true;
      console.log("Data processed:", data);
      resolve(data);
    }, 1000);
  });
}

function saveData(data) {
  return new Promise((resolve, reject) => {
    // Save the data
    setTimeout(() => {
      data.saved = true;
      console.log("Data saved:", data);
      resolve(data);
    }, 1000);
  });
}

// Promise chain
fetchData()
  .then(data => {
    console.log("Data fetched:", data);
    return processData(data);
  })
  .then(processedData => {
    console.log("Data processed:", processedData);
    return saveData(processedData);
  })
  .then(savedData => {
    console.log("Final result:", savedData);
    // Output: { name: "John", age: 30, processed: true, saved: true }
  })
  .catch(error => {
    console.error("Error:", error);
  });

// Async/await (ES8, but commonly used with Promises)
async function handleData() {
  try {
    const data = await fetchData();
    const processedData = await processData(data);
    const savedData = await saveData(processedData);
    console.log("Final result (async/await):", savedData);
    // Output: { name: "John", age: 30, processed: true, saved: true }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Call the async function
handleData();`;

    // Results
    const oldWayResult = `Deeply nested callbacks ("callback hell")
Hard to handle errors consistently
Difficult to reason about the flow
Code becomes harder to maintain as complexity grows

Final result: { name: "John", age: 30, processed: true, saved: true }`;

    const newWayResult = `Flat chain of .then() calls
Centralized error handling with .catch()
More readable and maintainable code

With Promise chain:
Final result: { name: "John", age: 30, processed: true, saved: true }

With async/await:
Final result: { name: "John", age: 30, processed: true, saved: true }`;

    // Display the comparison
    displayComparison(outputElement, oldWayCode, newWayCode, oldWayResult, newWayResult);
    
    // Add explanation
    const explanation = document.createElement('div');
    explanation.innerHTML = `
        <h4>Key Features of Promises:</h4>
        <ul>
            <li><strong>Promise object</strong>: Represents a value that may not be available yet</li>
            <li><strong>States</strong>: Pending, Fulfilled (resolved), Rejected</li>
            <li><strong>then()</strong>: Handle successful completion</li>
            <li><strong>catch()</strong>: Handle errors</li>
            <li><strong>finally()</strong>: Execute code regardless of success or failure</li>
            <li><strong>Promise chaining</strong>: Chain multiple asynchronous operations</li>
        </ul>
        <p><strong>Promise Methods:</strong></p>
        <ul>
            <li><strong>Promise.all()</strong>: Wait for all promises to resolve</li>
            <li><strong>Promise.race()</strong>: Wait for the first promise to resolve or reject</li>
            <li><strong>Promise.resolve()</strong>: Create a promise that resolves with a given value</li>
            <li><strong>Promise.reject()</strong>: Create a promise that rejects with a given reason</li>
        </ul>
        <p><strong>Async/Await (ES8):</strong></p>
        <ul>
            <li>Syntactic sugar over promises</li>
            <li>Makes asynchronous code look synchronous</li>
            <li>Uses try/catch for error handling</li>
        </ul>
    `;
    outputElement.appendChild(explanation);
}
