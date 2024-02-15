import React, { useCallback } from "react";
import { useReactFlow } from "reactflow";
import classes from "./ContextMenu.module.css";

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({ ...node, id: `${node.id}-copy`, position });
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    const node = getNode(id);
    if (node.data.isRoot) return;
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className={classes["context-menu"]}
      {...props}
    >
      {/* <p style={{ margin: "0.5em" }}>
        <small>
          <em>Node Id: {id}</em>
        </small>
      </p> */}
      {/* <button onClick={duplicateNode}>Promote to root Node</button> */}
      <button onClick={deleteNode}>delete</button>
    </div>
  );
}
