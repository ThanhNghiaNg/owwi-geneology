import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";

import "reactflow/dist/style.css";
import { deepClone, indexTree } from "./utils";
import CustomNode from "./components/CustomNode";
import InputNode from "./components/CustomNode";

const initialNodes = [];
const initialEdges = [];

export default function MainView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedId, setSelectedId] = useState(0);
  const data = [
    { id: 4, value: "Mẹ", parentId: 20, couplingId: 3 },
    { id: 7, value: "Tiên", parentId: 6, couplingId: null },
    { id: 5, value: "Anh Ba", parentId: 3, couplingId: null },
    { id: 3, value: "Ba", parentId: 1, couplingId: 4 },
    { id: 1, value: "Ông Nội", parentId: null, couplingId: 2, isRoot: true },
    { id: 6, value: "Chị Hai", parentId: 3, couplingId: null },
    { id: 2, value: "Bà Nội", parentId: null, couplingId: 1 },
    { id: 8, value: "Má Năm", parentId: 1, couplingId: 1 },
    { id: 9, value: "Lủng Chị", parentId: 8, couplingId: 1 },
    { id: 10, value: "Pi Em", parentId: 9, couplingId: 1 },
    { id: 11, value: "Puu", parentId: 10, couplingId: 1 },
    { id: 12, value: "Puu 2", parentId: 10, couplingId: 1 },
    { id: 13, value: "Lủng Em", parentId: 8, couplingId: 1 },
    { id: 14, value: "Phi Trường", parentId: 13, couplingId: 1 },
    { id: 15, value: "Phi Trường 2", parentId: 13, couplingId: 1 },
    { id: 16, value: "Phi Trường 3", parentId: 13, couplingId: 1 },
    { id: 17, value: "Phi Trường 3", parentId: 13, couplingId: 1 },
    { id: 18, value: "Phi Trường 3", parentId: 13, couplingId: 1 },
    { id: 19, value: "Phi Trường 3", parentId: 13, couplingId: 1 },
  ];
  const array = deepClone(data);

  const root = array.find((item) => item.isRoot === true);
  array.map((child) => {
    child.children = array.filter((item) => item.parentId === child.id);
    return child;
  });

  useEffect(() => {
    indexTree(root);
    const nodeFormatted = [];
    const edgeFormatted = [];
    for (let node of array) {
      console.log({ node });
      if (node.level >= 0) {
        edgeFormatted.push({
          id: `e${String(node.parentId)}-${node.id.toString()}`,
          source: String(node.parentId),
          target: node.id.toString(),
          type: "step",
        });
        nodeFormatted.push({
          id: node.id.toString(),
          type: "input",
          position: {
            x: node.x,
            y: node.y,
          },
          data: {
            label: node.value,
            parentId: node.parentId,
            expand: !!node.children.length,
          },
          hidden: false,
        });
      } else {
        const coupling = array.find((item) => item.id === node.couplingId);
        nodeFormatted.push({
          id: node.id.toString(),
          type: "input",
          position: {
            x: coupling.x + 150,
            y: coupling.y || 0,
          },
          data: {
            label: node.value,
            parentId: node.parentId,
            expand: !!node.children.length,
          },
          
        });
      }
    }
    setEdges(edgeFormatted);
    setNodes(nodeFormatted);
  }, []);

  console.log({ nodes });

  const a = (id) => {
    const children = nodes?.filter((item) => {
      return String(item.data.parentId) === String(id);
    });
    children.forEach((child) => {
      a(child.id);

      setEdges((prev) => {
        const updated = [...prev];
        if (!child.hidden) {
          return updated.filter(
            (item) => item.id !== `e${String(id)}-${child.id.toString()}`
          );
        } else {
          updated.push({
            id: `e${String(id)}-${child.id.toString()}`,
            source: String(id),
            target: child.id.toString(),
            type: "step",
          });
          return updated;
        }
      });
      setNodes((prev) => {
        return prev.map((item) =>
          item.id === child.id
            ? { ...item, hidden: item.hidden ? false : true }
            : { ...item }
        );
      });
    });
    selectedId && setSelectedId(null);
  };

  const onHidden = (id) => {
    setSelectedId(id);
  };

  useEffect(() => {
    selectedId && a(selectedId);
  }, [selectedId]);

  const nodeTypes = useMemo(
    () => ({
      input: ({ id, data, expand }) =>
        InputNode({
          id,
          data,
          onHidden,
          expand,
        }),
    }),
    []
  );
  // console.log({ nodes });
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {nodes.length && (
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onInit={(rl) => {
            const initNode = nodes.find(
              (item) => item.id === root.id.toString()
            );
            console.log({ initNode, root });
            rl.setCenter(
              initNode?.position.x || 0,
              initNode?.position.y || 0 + 250
            );
            rl.zoomTo(0.8);
          }}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      )}
    </div>
  );
}
