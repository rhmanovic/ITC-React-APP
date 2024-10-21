import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import "./NumericKeypad.css"; // Make sure to create a corresponding CSS file

const NumericKeypad = ({ handleButtonClick, handleClear, handleBackspace, handleConfirm, allowDecimal }) => {
  return (
    <div className="numeric-keypad">
      <ButtonGroup className="keypad-buttons">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button key={num} onClick={() => handleButtonClick(num.toString())}>
            {num}
          </Button>
        ))}
        <Button style={{ visibility: allowDecimal ? "visible" : "hidden" }} onClick={() => handleButtonClick(".")}>
          .
        </Button>
        <Button onClick={() => handleButtonClick("0")}>0</Button>
        <Button onClick={handleBackspace}>⌫</Button>
        <Button onClick={handleClear}>✖</Button>
        <Button onClick={handleConfirm}>✔</Button>
      </ButtonGroup>
    </div>
  );
};

export default NumericKeypad;
