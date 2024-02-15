import { useCallback } from "react";
import { Handle, Position, useReactFlow } from "reactflow";
import classes from "./CustomNode.module.css";

export default function InputNode({ id, data, onHidden, onAddChildren }) {
  const { getNode, setNodes } = useReactFlow();
  const onChange = useCallback((evt) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === id) {
          node.data.label = evt.target.value;
        }
        return node;
      })
    );
  }, []);

  return (
    <>
      {data.parentId && <Handle type="target" position={Position.Top} />}
      <div className={classes.node_contain}>
        {/* <label htmlFor="text">Text:</label> */}
        <input
          id="text"
          name="text"
          onChange={onChange}
          className={classes.node__input}
          defaultValue={data.label}
          title={data.label}
        />
        {/* {data.expand && (
          <button
            onClick={() => {
              onHidden(id);
            }}
            className={classes.toggle_button}
          >
            ^
          </button>
        )} */}
      </div>
      {(data.parentId || data.isRoot) && (
        <>
          <Handle type="source" position={Position.Bottom} id="add_children" />
          <Handle type="source" position={Position.Right} id="add_coupling" />
        </>
      )}
    </>
  );
}
