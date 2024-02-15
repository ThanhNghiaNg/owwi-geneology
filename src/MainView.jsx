import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  addEdge,
  onConnectStart,
  onConnectEnd,
  useEdgesState,
  useNodesState,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";

import "reactflow/dist/style.css";
import { deepClone, indexTree } from "./utils";
import CustomNode from "./components/CustomNode/CustomNode";
import InputNode from "./components/CustomNode/CustomNode";
import ContextMenu from "./components/ContextMenu/ContextMenu";

const initialNodes = [];
const initialEdges = [];

export default function MainView() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { setViewport } = useReactFlow();
  const [selectedId, setSelectedId] = useState(0);
  const [rfInstance, setRlInstance] = useState(null);
  const [menu, setMenu] = useState(null);
  const [fullData, setFullData] = useState([
    // { id: 4, value: "Mẹ", parentId: null, couplingId: 3 },
    // { id: 7, value: "Tiên", parentId: 6, couplingId: null },
    // { id: 5, value: "Anh Ba", parentId: 3, couplingId: null },
    // { id: 3, value: "Ba", parentId: 1, couplingId: 4 },
    // { id: 1, value: "Ông Nội", parentId: null, couplingId: 2, isRoot: true },
    // { id: 6, value: "Chị Hai", parentId: 3, couplingId: null },
    // { id: 2, value: "Bà Nội", parentId: null, couplingId: 1 },
    // { id: 8, value: "Má Năm", parentId: 1, couplingId: 1 },
    // { id: 9, value: "Lủng Chị", parentId: 8, couplingId: 1 },
    // { id: 10, value: "Pi Em", parentId: 9, couplingId: 1 },
    // { id: 11, value: "Puu", parentId: 10, couplingId: 1 },
    // { id: 12, value: "Puu 2", parentId: 10, couplingId: 1 },
    // { id: 13, value: "Lủng Em", parentId: 8, couplingId: 1 },
    // { id: 14, value: "Phi Trường", parentId: 13, couplingId: 1 },
    // { id: 15, value: "Phi Trường 2", parentId: 13, couplingId: 1 },
    // { id: 16, value: "Phi Trường 3", parentId: 13, couplingId: 1 },
    // { id: 17, value: "Phi Trường 3", parentId: 13, couplingId: 1 },
    // { id: 18, value: "Phi Trường 3", parentId: 13, couplingId: 1 },
    // { id: 19, value: "Phi Trường 3", parentId: 13, couplingId: 1 },
    {
      id: new Date().getTime(),
      value: "Biggest",
      parentId: null,
      couplingId: null,
      isRoot: true,
    },
  ]);

  const ref = useRef(null);

  const array = deepClone(fullData);

  const root = array.find((item) => item.isRoot === true);
  array.map((child) => {
    child.children = array.filter((item) => item.parentId === child.id);
    return child;
  });

  const toggleNodeHandler = (id) => {
    const children = nodes?.filter((item) => {
      return String(item.data.parentId) === String(id);
    });
    children.forEach((child) => {
      toggleNodeHandler(child.id);

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

  const onAddChildren = (id) => {
    setFullData((prev) => {
      const parent = prev?.find((item) => {
        return String(item.id) === String(id);
      });

      const updated = [...prev];
      updated.push({
        id: new Date().getTime(),
        value: "",
        parentId: parent.id,
        couplingId: null,
      });

      return updated;
    });
  };

  const onAddCouple = (id) => {
    setFullData((prev) => {
      const parent = prev?.find((item) => {
        return String(item.id) === String(id);
      });
      const updated = [...prev];
      updated.push({
        id: String(Math.max(...prev.map((item) => Number(item.id))) + 1),
        value: "",
        parentId: null,
        couplingId: parent.id,
      });

      return updated;
    });
  };

  const onNodeContextMenu = useCallback(
    (event, node) => {
      event.preventDefault();
      const pane = ref.current.getBoundingClientRect();
      setMenu({
        id: node.id,
        top: event.clientY < pane.height - 200 && event.clientY,
        left: event.clientX < pane.width - 200 && event.clientX,
        right: event.clientX >= pane.width - 200 && pane.width - event.clientX,
        bottom:
          event.clientY >= pane.height - 200 && pane.height - event.clientY,
      });
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);
  const nodeTypes = useMemo(
    () => ({
      input: ({ id, data, expand }) =>
        InputNode({
          id,
          data,
          onHidden,
          onAddChildren,
          expand,
        }),
    }),
    []
  );
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem("flowKey", JSON.stringify(flow));
    }
    alert("Saved");
  }, [rfInstance]);

  useEffect(() => {
    selectedId && toggleNodeHandler(selectedId);
  }, [selectedId]);

  useEffect(() => {
    const updatedRoot = root;
    indexTree(updatedRoot);
    const nodeFormatted = [];
    const edgeFormatted = [];
    for (let node of array) {
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
            couplingId: node.couplingId,
            isRoot: node.isRoot || false,
          },
          hidden: false,
        });
      } else {
        const coupling = array.find((item) => item.id === node.couplingId);
        nodeFormatted.push({
          id: node.id.toString(),
          type: "input",
          position: {
            x: coupling?.x || 0 + 150,
            y: coupling?.y || 0,
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
    const rootNode = nodeFormatted.find(
      (item) => item.id === root.id.toString()
    );
    const avg =
      nodeFormatted.reduce((acc, node) => acc + node.position.x, 0) /
      nodeFormatted.length;
    setViewport(avg, rootNode?.position.y || 0 + 250, 0.8);
    // setRlInstance((prev) => {
    //   console.log(avg, rootNode?.position.y || 0 + 250);
    //   if (prev) {
    //     prev.setCenter(
    //       avg || 0,
    //       rootNode?.position.y || 0 + 250
    //       // 5000,
    //       // 250
    //     );
    //     prev.zoomTo(0.8);
    //   }
    //   return prev;
    // });
  }, [fullData]);

  useEffect(() => {
    const flow = JSON.parse(localStorage.getItem("flowKey"));
    if (flow) {
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setNodes(flow.nodes || []);
      setFullData(
        flow.nodes.map((node) => ({
          id: Number(node.id),
          value: node.data.label,
          parentId: node.data.parentId,
          couplingId: node.data.couplingId,
          isRoot: node.data.isRoot,
        }))
      );
      setEdges(flow.edges || []);
      // setViewport({ x, y, zoom });
    }
  }, []);
  console.log({ nodes });
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {nodes.length && (
        <ReactFlow
          ref={ref}
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={(node) => {
            onNodesChange(node);
          }}
          onEdgesChange={onEdgesChange}
          onInit={(_rfInstance) => {
            const rootNode = nodes.find(
              (item) => item.id === root.id.toString()
            );
            _rfInstance.setCenter(
              rootNode?.position.x || 0,
              rootNode?.position.y || 0 + 250
            );
            _rfInstance.zoomTo(0.8);
            setRlInstance(_rfInstance);
          }}
          // onConnectEnd={onConnectEnd}
          onConnectStart={(event, params) => {
            if (params.handleId === "add_children")
              onAddChildren(params.nodeId);
            if (params.handleId === "add_coupling") onAddCouple(params.nodeId);
          }}
          onNodeContextMenu={onNodeContextMenu}
          onPaneClick={onPaneClick}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
          <Panel>
            <button onClick={onSave}>Save On Your Machine</button>
          </Panel>
        </ReactFlow>
      )}
    </div>
  );
}
