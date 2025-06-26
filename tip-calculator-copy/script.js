// Select all elements we need to work with
const billInput = document.getElementById('bill');
const tipBtns = document.querySelectorAll('.tip-btn');
const customTipInput = document.getElementById('custom-tip');
const peopleInput = document.getElementById('people');
const tipAmountEl = document.getElementById('tip-amount');
const totalAmountEl = document.getElementById('total-amount');
const resetBtn = document.getElementById('reset-btn');

// Variables to store current values
let billValue = 0;
let tipPercentage = 0;
let peopleCount = 0;

// Update calculations when inputs change
function updateCalculations() {
    // Only calculate if we have all necessary values
    if (billValue > 0 && tipPercentage > 0 && peopleCount > 0) {
        const tipAmount = (billValue * tipPercentage) / 100;
        const tipPerPerson = tipAmount / peopleCount;
        const totalPerPerson = (billValue + tipAmount) / peopleCount;
        
        // Update the UI
        tipAmountEl.textContent = `$${tipPerPerson.toFixed(2)}`;
        totalAmountEl.textContent = `$${totalPerPerson.toFixed(2)}`;
    }
}

// Event listeners for inputs
billInput.addEventListener('input', () => {
    billValue = parseFloat(billInput.value) || 0;
    updateCalculations();
});

// Tip percentage buttons
tipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        tipBtns.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        // Update tip percentage
        tipPercentage = parseInt(btn.dataset.tip);
        
        // Clear custom tip input
        customTipInput.value = '';
        
        updateCalculations();
    });
});

// Custom tip input
customTipInput.addEventListener('input', () => {
    // Remove active class from all buttons
    tipBtns.forEach(btn => btn.classList.remove('active'));
    
    // Update tip percentage
    tipPercentage = parseFloat(customTipInput.value) || 0;
    
    updateCalculations();
});

// Number of people input
peopleInput.addEventListener('input', () => {
    peopleCount = parseInt(peopleInput.value) || 0;
    updateCalculations();
});

// Reset button
resetBtn.addEventListener('click', () => {
    // Reset all values
    billValue = 0;
    tipPercentage = 0;
    peopleCount = 0;
    
    // Reset inputs
    billInput.value = '';
    customTipInput.value = '';
    peopleInput.value = '';
    
    // Remove active class from all buttons
    tipBtns.forEach(btn => btn.classList.remove('active'));
    
    // Reset results
    tipAmountEl.textContent = '$0.00';
    totalAmountEl.textContent = '$0.00';
});
