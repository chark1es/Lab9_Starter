(function waitForTrackJS() {
  if (!window.TrackJS) {
    setTimeout(waitForTrackJS, 100);
    return;
  }
  initializeApp();
})();

function safeTrack(data) {
  if (window.TrackJS) {
    TrackJS.track(data);
  } else {
    console.warn('TrackJS not available:', data);
  }
}

function initializeApp() {
  let form = document.querySelector('form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let output = document.querySelector('output');
    let firstNum = document.querySelector('#first-num').value;
    let secondNum = document.querySelector('#second-num').value;
    let operator = document.querySelector('#operator').value;
    
    try {
      if (!firstNum || !secondNum) {
        throw new ValidationError('Both numbers are required');
      }
      if (operator === '/' && secondNum === '0') {
        throw new ValidationError('Cannot divide by zero');
      }
      
      output.innerHTML = eval(`${firstNum} ${operator} ${secondNum}`);
      safeTrack({
        operation: "calculation",
        firstNumber: firstNum,
        secondNumber: secondNum,
        operator: operator,
        result: output.innerHTML
      });
    } catch (error) {
      output.innerHTML = `Error: ${error.message}`;
      console.error('Calculator error:', error);
      safeTrack(error);
    }
  });

  class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ValidationError';
    }
  }

  let errorBtns = Array.from(document.querySelectorAll('#error-btns > button'));

  const sampleData = {
    name: 'John Doe',
    age: 30,
    skills: ['JavaScript', 'HTML', 'CSS'],
    address: {
      street: '123 Main St',
      city: 'San Diego',
      state: 'CA'
    }
  };

  errorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      try {
        switch (btn.textContent) {
          case 'Console Log':
            console.log('Sample log message:', sampleData);
            break;
            
          case 'Console Error':
            const testError = new Error('This is a test error');
            console.error('Sample error message:', testError);
            safeTrack(testError);
            break;
            
          case 'Console Count':
            console.count('Button clicks');
            break;
            
          case 'Console Warn':
            console.warn('Sample warning message');
            break;
            
          case 'Console Assert':
            console.assert(false, 'This assertion failed!');
            safeTrack({
              type: "assertion_failure",
              message: "This assertion failed!"
            });
            break;
            
          case 'Console Clear':
            console.clear();
            break;
            
          case 'Console Dir':
            console.dir(document.querySelector('main'));
            break;
            
          case 'Console dirxml':
            console.dirxml(document.querySelector('main'));
            break;
            
          case 'Console Group Start':
            console.group('Sample Group');
            console.log('This is inside a group');
            console.log('More grouped content');
            break;
            
          case 'Console Group End':
            console.groupEnd();
            break;
            
          case 'Console Table':
            console.table([sampleData, { ...sampleData, name: 'Jane Doe' }]);
            break;
            
          case 'Start Timer':
            console.time('operationTimer');
            break;
            
          case 'End Timer':
            console.timeEnd('operationTimer');
            break;
            
          case 'Console Trace':
            console.trace('Trace demo');
            break;
            
          case 'Trigger a Global Error':
            // This will trigger a global error
            safeTrack({
              type: "intentional_error",
              message: "About to trigger nonExistentFunction"
            });
            nonExistentFunction();
            break;
        }
      } catch (error) {
        safeTrack(error);
        throw error;
      }
    });
  });

  window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.log('Global error caught:', {
      message: msg,
      url: url,
      lineNumber: lineNo,
      columnNumber: columnNo,
      error: error
    });
    
    safeTrack({
      type: "global_error",
      message: msg,
      url: url,
      lineNumber: lineNo,
      columnNumber: columnNo,
      error: error
    });
    
    return false;
  };
} 