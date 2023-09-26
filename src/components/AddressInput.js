import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import LineNumberedTextField from './LineNumberedTextField';
import './AddressInput.css';

function AddressInput() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [validationError, setValidationError] = useState('');
  const [duplicates, setDuplicates] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    calculateResult(option);
  };

  const calculateResult = (option) => {
    // Split input by lines
    const lines = inputText.split('\n');
    const addressMap = {};
    const duplicatesMap = {};
  
    lines.forEach((line, index) => {
      // Update the regular expression to split lines based on '=', spaces, or commas
      const parts = line.split(/[=\s,]+/);
  
      for (let i = 0; i < parts.length; i += 2) {
        const address = parts[i];
        const amount = parts[i + 1];
  
        if (address && amount) {
          const isNumericAmount = /^[0-9]+(\.[0-9]+)?$/.test(amount);
  
          if (
            /^0x[0-9a-fA-F]{40}$/.test(address) &&
            isNumericAmount &&
            parseFloat(amount) > 0
          ) {
            if (!addressMap[address]) {
              addressMap[address] = parseFloat(amount);
            } else {
              if (!duplicatesMap[address]) {
                duplicatesMap[address] = [];
              }
              duplicatesMap[address].push(index + 1);
              addressMap[address] += parseFloat(amount);
            }
          }
        }
      }
    });
  
    if (option === 'keepFirst') {
      // Create a set to keep track of the first lines of duplicates
    const firstLines = new Set();

    
      // Remove spaces and commas, and replace with '='
      const newLines = lines.map((line, index) => {
        if (!duplicates.some((duplicate) => duplicate.lines.includes(index + 1))) {
          return line.replace(/[,\s]+/g, '=');
        }
        // Check if it's the first line of a duplicate
        if (!firstLines.has(line)) {
          firstLines.add(line);
          return line.replace(/[,\s]+/g, '=');
        }
        return '';
      });
      const resultText = newLines.join('\n');
      setResult(resultText);
    } else if (option === 'combineBalance') {
      // Combine balances of duplicate addresses
      const combinedLines = Object.entries(addressMap).map(([address, amount]) => {
        return `${address}=${amount}`;
      });
      const resultText = combinedLines.join('\n');
      setResult(resultText);
    }
  };

  const processInput = () => {
    // Split input by lines
    const lines = inputText.split('\n');
    const errors = [];
    const addressMap = {};
    const duplicatesMap = {};

    lines.forEach((line, index) => {
      const parts = line.split(/[,\s=]+/);

      for (let i = 0; i < parts.length; i += 2) {
        const address = parts[i];
        const amount = parts[i + 1];

        if (address && amount) {
          const isNumericAmount = /^[0-9]+(\.[0-9]+)?$/.test(amount);

          if (
            /^0x[0-9a-fA-F]{40}$/.test(address) &&
            isNumericAmount &&
            parseFloat(amount) > 0
          ) {
            if (!addressMap[address]) {
              addressMap[address] = parseFloat(amount);
              if (!duplicatesMap[address]) {
                duplicatesMap[address] = [];
              }
              duplicatesMap[address].push(index + 1);
            } else {
              if (!duplicatesMap[address]) {
                duplicatesMap[address] = [];
              }
              duplicatesMap[address].push(index + 1);
              addressMap[address] += parseFloat(amount);
            }
          } else {
            errors.push(`Line ${index + 1} has an incorrect amount: '${amount}'`);
          }
        }
      }
    });

    let duplicateAddresses = []

    Object.entries(duplicatesMap).map(([key, value]) => {
      console.log('value',value, value.length);
      if (value.length > 1) duplicateAddresses.push(key);
    })

    // const duplicateAddresses = Object.keys(duplicatesMap);
    if (duplicateAddresses.length > 0) {
      const duplicatesInfo = duplicateAddresses.map((address) => {
        return {
          address,
          lines: duplicatesMap[address],
        };
      });
      console.log('----', duplicatesInfo)
      setDuplicates(duplicatesInfo);
    } else {
      setDuplicates([]);
    }

    if (errors.length > 0) {
      const errorString = errors.join('\n');
      setValidationError(errorString);
    } else {
      setValidationError('');
    }
  };

  return (
    <div>
      <h1>Address Input</h1>
      <div className="input-container">
        <LineNumberedTextField _value={inputText} _handleChange={handleInputChange} />
      </div>
      <div className="helper-text align-left">Separated by ',' or ' ' or '='</div>
      <Button variant="contained" color="primary" onClick={processInput}>
        Process
      </Button>
      {validationError && (
        <Alert variant="outlined" severity="error" style={{ marginTop: '16px' }}>
          <AlertTitle>Validation Errors</AlertTitle>
          {validationError}
        </Alert>
      )}
      {duplicates.length > 0 && (
        <Alert variant="outlined" severity="warning" style={{ marginTop: '16px' }}>
          <AlertTitle>Duplicate Addresses Found</AlertTitle>
          {duplicates.map((duplicate, index) => (
            <div key={index}>
              <strong>Address:</strong> {duplicate.address}
              <br />
              <strong>Lines:</strong> {duplicate.lines.join(', ')}
            </div>
          ))}
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleOptionChange('keepFirst')}
          >
            Keep the First One
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleOptionChange('combineBalance')}
          >
            Combine Balances
          </Button>
        </Alert>
      )}
      <h2>Result:</h2>
      <pre>{result}</pre>
    </div>
  );
}

export default AddressInput;
