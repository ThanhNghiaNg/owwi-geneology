import { useCallback } from "react";
import { Handle, Position } from "reactflow";
import classes from "./CustomNode.module.css";

const handleStyle = { left: 10 };

export default function InputNode({ id, data, onHidden }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <>
      <Handle type="target" position={Position.Top} />
      {/* <Handle type="source" position={Position.Right} /> */}

      <div className={classes.node_contain}>
        {/* <label htmlFor="text">Text:</label> */}
        <input
          id="text"
          name="text"
          onChange={onChange}
          className={classes.node__input}
          defaultValue={data.label}
          title={data.label}
        />{data.expand && (
        <button
          onClick={() => {
            onHidden(id);
          }}
        >
          ^
        </button>
      )}
      </div>
      

      {/* <div
        className={`${classes.add_button} ${classes.add_button_bottom}`}
        onClick={() => {
          console.log("aaaaa");
        }}
      >
        +
      </div> */}
      <Handle type="source" position={Position.Bottom} id="a" />
      {/* <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={handleStyle}
      /> */}
    </>
  );
}
