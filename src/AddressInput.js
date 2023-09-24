import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

function AddressInput() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const processInput = () => {
    // Split input by lines and trim whitespace
    const lines = inputText.split('\n').map((line) => line.trim());

    // Create an object to store unique addresses and their amounts
    const addressMap = {};

    lines.forEach((line) => {
      const [address, amount] = line.split(/[=,\s]+/); // Split by space, comma, or equal sign
      const numericAmount = parseFloat(amount);

      // Check if the address is valid and the amount is positive
      if (
        /^0x[0-9a-fA-F]{40}$/.test(address) && // Validate address format
        !isNaN(numericAmount) && // Check if amount is a number
        numericAmount > 0 // Check if amount is positive
      ) {
        // If the address is not in the map, add it
        if (!addressMap[address]) {
          addressMap[address] = numericAmount;
        } else {
          // If the address is already in the map, add the amount to the existing one
          addressMap[address] += numericAmount;
        }
      }
    });

    // Convert the address map back to a formatted string
    const processedResult = Object.entries(addressMap)
      .map(([address, amount]) => `${address}=${amount}`)
      .join('\n');

    setResult(processedResult);
  };

  return (
    <div>
      <h1>Address Input</h1>
      <TextField
        multiline
        rows={10}
        fullWidth
        variant="outlined"
        placeholder="Enter addresses and amounts"
        value={inputText}
        onChange={handleInputChange}
      />
      <Button variant="contained" color="primary" onClick={processInput}>
        Process
      </Button>
      <h2>Result:</h2>
      <pre>{result}</pre>
    </div>
  );
}

export default AddressInput;
