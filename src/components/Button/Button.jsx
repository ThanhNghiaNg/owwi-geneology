import React from "react";

function Button({ id, text, alertMessage, onSelect }) {
  const editMode = localStorage.getItem("editMode");
  return (
    <button
      onClick={() => {
        !editMode && alert(alertMessage);
        // console.log(onSelect);
        editMode && onSelect(id);
      }}
    >
      {text || "Button"}
    </button>
  );
}

export default Button;
