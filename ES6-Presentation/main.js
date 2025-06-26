// Main JavaScript file to handle demo execution

// Function to run demos for each feature
function runDemo(feature) {
    // Clear previous output
    const outputElement = document.getElementById(`${feature}-output`);
    outputElement.innerHTML = '';
    
    // Run the appropriate demo based on the feature
    switch(feature) {
        case 'letConst':
            letConstDemo(outputElement);
            break;
        case 'arrowFunctions':
            arrowFunctionsDemo(outputElement);
            break;
        case 'templateLiterals':
            templateLiteralsDemo(outputElement);
            break;
        case 'defaultParams':
            defaultParamsDemo(outputElement);
            break;
        case 'destructuring':
            destructuringDemo(outputElement);
            break;
        case 'spreadRest':
            spreadRestDemo(outputElement);
            break;
        case 'classes':
            classesDemo(outputElement);
            break;
        case 'promises':
            promisesDemo(outputElement);
            break;
        case 'modules':
            modulesDemo(outputElement);
            break;
        case 'mapSet':
            mapSetDemo(outputElement);
            break;
        default:
            outputElement.textContent = 'Demo not found';
    }
}

// Helper function to display output
function displayOutput(element, title, content) {
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    
    const codeElement = document.createElement('pre');
    codeElement.textContent = content;
    
    element.appendChild(titleElement);
    element.appendChild(codeElement);
}

// Helper function to display comparison
function displayComparison(element, oldWay, newWay, oldResult, newResult) {
    // Create container for side-by-side comparison
    const comparisonContainer = document.createElement('div');
    comparisonContainer.className = 'comparison-container';
    
    // Old way section
    const oldSection = document.createElement('div');
    oldSection.className = 'old-way';
    
    const oldTitle = document.createElement('h4');
    oldTitle.textContent = 'Old Way (ES5):';
    
    const oldCode = document.createElement('pre');
    oldCode.textContent = oldWay;
    
    const oldResultTitle = document.createElement('h4');
    oldResultTitle.textContent = 'Result:';
    
    const oldResultCode = document.createElement('pre');
    oldResultCode.textContent = oldResult;
    
    oldSection.appendChild(oldTitle);
    oldSection.appendChild(oldCode);
    oldSection.appendChild(oldResultTitle);
    oldSection.appendChild(oldResultCode);
    
    // New way section
    const newSection = document.createElement('div');
    newSection.className = 'new-way';
    
    const newTitle = document.createElement('h4');
    newTitle.textContent = 'New Way (ES6):';
    
    const newCode = document.createElement('pre');
    newCode.textContent = newWay;
    
    const newResultTitle = document.createElement('h4');
    newResultTitle.textContent = 'Result:';
    
    const newResultCode = document.createElement('pre');
    newResultCode.textContent = newResult;
    
    newSection.appendChild(newTitle);
    newSection.appendChild(newCode);
    newSection.appendChild(newResultTitle);
    newSection.appendChild(newResultCode);
    
    // Add both sections to the comparison container
    comparisonContainer.appendChild(oldSection);
    comparisonContainer.appendChild(newSection);
    
    // Add the comparison container to the output element
    element.appendChild(comparisonContainer);
}
