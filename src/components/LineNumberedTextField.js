import React from "react";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import "./LineNumberedTextField.css"; // Import your custom CSS file

function LineNumberedTextField({ _value, _handleChange }) {

  return (
    <div className="line-numbered-textfield">
      <div className="line-numbers">
        {_value.split("\n").map((line, index) => (
          <div key={index} className="line-number">
            {index + 1}
          </div>
        ))}
      </div>
      <TextareaAutosize
        variant="outlined"
        placeholder="Enter addresses and amounts"
        className="textarea"
        value={_value}
        onChange={_handleChange}
        rows={10}
      />
    </div>
  );
}

export default LineNumberedTextField;
