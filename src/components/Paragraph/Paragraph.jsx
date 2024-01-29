import React from "react";

function Paragraph({ id, text, onSelect }) {
  return (
    <div
      onClick={() => {
        onSelect(id);
      }}
    >
      {text || ""}
    </div>
  );
}

export default Paragraph;
