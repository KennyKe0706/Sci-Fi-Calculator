class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.isSecondMode = false;
    this.clear();
  }

  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.bracketCount = 0;
  }

  delete() {
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === '') this.currentOperand = '0';
  }

  appendNumber(number) {
    if (number === '.' && this.currentOperand.includes('.')) return;
    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    let result = 1;
    for (let i = 1; i <= n; i++) {
      result *= i;
    }
    return result;
  }

  chooseOperation(operation) {
    if (this.currentOperand === '') return;
    if (this.previousOperand !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = '0';
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);
    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      // Basic operations
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
        computation = prev * current;
        break;
      case '÷':
        computation = prev / current;
        break;
      case '%':
        computation = prev % current;
        break;

      // Trigonometric functions (in degrees)
      case 'sin':
        computation = Math.sin(current * Math.PI / 180);
        break;
      case 'cos':
        computation = Math.cos(current * Math.PI / 180);
        break;
      case 'tan':
        computation = Math.tan(current * Math.PI / 180);
        break;

      // Inverse trigonometric functions (returns degrees)
      case 'asin':
        computation = Math.asin(current) * 180 / Math.PI;
        break;
      case 'acos':
        computation = Math.acos(current) * 180 / Math.PI;
        break;
      case 'atan':
        computation = Math.atan(current) * 180 / Math.PI;
        break;

      // Logarithmic operations
      case 'log':
        computation = Math.log10(current);
        break;
      case 'ln':
        computation = Math.log(current);
        break;
      case 'e^x':
        computation = Math.exp(current);
        break;
      case '10^x':
        computation = Math.pow(10, current);
        break;

      // Powers and roots
      case '√':
        computation = Math.sqrt(current);
        break;
      case '∛':
        computation = Math.cbrt(current);
        break;
      case 'x²':
        computation = Math.pow(current, 2);
        break;
      case 'x³':
        computation = Math.pow(current, 3);
        break;

      // Other functions
      case '|x|':
        computation = Math.abs(current);
        break;
      case '1/x':
        computation = 1 / current;
        break;
      case 'x!':
        computation = this.factorial(current);
        break;

      // Constants
      case 'π':
        computation = Math.PI;
        break;
      case 'e':
        computation = Math.E;
        break;

      default:
        return;
    }

    // Handle calculation results
    if (isNaN(computation) || !isFinite(computation)) {
      this.currentOperand = 'Error';
    } else {
      this.currentOperand = computation;
    }
    this.operation = undefined;
    this.previousOperand = '';
  }

  getDisplayNumber(number) {
    if (number === 'Error') return 'Error';

    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', {
        maximumFractionDigits: 0
      });
    }

    // Handle scientific notation
    if (Math.abs(number) >= 1e10 || (Math.abs(number) < 1e-7 && number !== 0)) {
      return number.toExponential(6);
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
    if (this.operation != null) {
      this.previousOperandElement.innerText =
        `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
    } else {
      this.previousOperandElement.innerText = '';
    }
  }

  toggleSecondMode() {
    this.isSecondMode = !this.isSecondMode;
    this.updateButtonLabels();
  }

  updateButtonLabels() {
    const buttonMappings = {
      'sin': 'asin',
      'cos': 'acos',
      'tan': 'atan',
      'log': 'ln',
      'x²': 'x³',
      '√': '∛',
      '|x|': 'x!',
      'π': 'e^x',
      'e': '10^x'
    };

    document.querySelectorAll('[data-operation]').forEach(button => {
      const text = button.innerText;
      const originalText = button.getAttribute('data-original');

      if (buttonMappings[text]) {
        if (this.isSecondMode) {
          button.setAttribute('data-original', text);
          button.innerText = buttonMappings[text];
        } else {
          button.innerText = text;
        }
      } else if (originalText && buttonMappings[originalText]) {
        if (!this.isSecondMode) {
          button.innerText = originalText;
          button.removeAttribute('data-original');
        }
      }
    });

    // Update 2nd button style
    const modeButton = document.querySelector('[data-mode]');
    if (this.isSecondMode) {
      modeButton.classList.add('active');
    } else {
      modeButton.classList.remove('active');
    }
  }
}

const calculator = new Calculator(
  document.querySelector('.previous-operand'),
  document.querySelector('.current-operand')
);

document.querySelectorAll('[data-number]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
    addClickEffect(button);
  });
});

document.querySelectorAll('[data-operation]').forEach(button => {
  button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText);
    calculator.updateDisplay();
    addClickEffect(button);
  });
});

document.querySelector('[data-equals]').addEventListener('click', button => {
  calculator.compute();
  calculator.updateDisplay();
  addClickEffect(button.target);
});

document.querySelector('[data-clear]').addEventListener('click', button => {
  calculator.clear();
  calculator.updateDisplay();
  addClickEffect(button.target);
});

document.querySelector('[data-delete]').addEventListener('click', button => {
  calculator.delete();
  calculator.updateDisplay();
  addClickEffect(button.target);
});

// Add 2nd mode switch event listener
document.querySelector('[data-mode]').addEventListener('click', button => {
  calculator.toggleSecondMode();
  addClickEffect(button.target);
});

// Add click effect
function addClickEffect(button) {
  button.classList.add('clicked');
  setTimeout(() => {
    button.classList.remove('clicked');
  }, 100);
}

// Add keyboard support
document.addEventListener('keydown', e => {
  if (e.key >= '0' && e.key <= '9' || e.key === '.') {
    calculator.appendNumber(e.key);
    calculator.updateDisplay();
  }
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    let operation = e.key;
    if (operation === '*') operation = '×';
    if (operation === '/') operation = '÷';
    calculator.chooseOperation(operation);
    calculator.updateDisplay();
  }
  if (e.key === 'Enter' || e.key === '=') {
    calculator.compute();
    calculator.updateDisplay();
  }
  if (e.key === 'Backspace') {
    calculator.delete();
    calculator.updateDisplay();
  }
  if (e.key === 'Escape') {
    calculator.clear();
    calculator.updateDisplay();
  }
}); 