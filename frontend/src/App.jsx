import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import InputNode from "./nodes/InputNode";
import ResultNode from "./nodes/ResultNode";
import "./App.css";

const nodeTypes = {
  inputNode: InputNode,
  resultNode: ResultNode,
};

// -----------------------------------------------
// Initial setup: define the two nodes and the edge (line) between them
// -----------------------------------------------
const initialEdges = [
  {
    id: "edge-1",         
    source: "node-input", 
    target: "node-result", 
    animated: true,       
    style: { stroke: "#6c63ff", strokeWidth: 2 },
  },
];

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "node-input",
      type: "inputNode",
      position: { x: 80, y: 180 },
      data: { prompt: "", onChange: () => {} }, 
    },
    {
      id: "node-result",
      type: "resultNode",
      position: { x: 550, y: 180 },
      data: { response: "" },
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const handlePromptChange = useCallback((val) => {
    setPrompt(val);
    setNodes((nds) =>
      nds.map((n) =>
        n.id === "node-input"
          ? { ...n, data: { ...n.data, prompt: val } }
          : n
      )
    );
  }, [setNodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === "node-input"
          ? { ...n, data: { ...n.data, onChange: handlePromptChange } }
          : n
      )
    );
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateNodes = (_newPrompt, newResponse) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === "node-result"
          ? { ...n, data: { ...n.data, response: newResponse } }
          : n
      )
    );
  };

  const handleRunFlow = async () => {
    if (!prompt.trim()) {
      setStatusMsg("⚠️ Please type a prompt first!");
      return;
    }

    setLoading(true);
    setStatusMsg(""); 

    try {
      const res = await axios.post("http://localhost:5000/api/ask-ai", {
        prompt: prompt,
      });

      const aiAnswer = res.data.response;

      setResponse(aiAnswer);
      updateNodes(prompt, aiAnswer);

    } catch (error) {
      const errMsg = "❌ Error: " + (error.response?.data?.error || error.message);
      setResponse(errMsg);
      updateNodes(prompt, errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!prompt || !response) {
      setStatusMsg("⚠️ Run the flow first before saving.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/save", {
        prompt: prompt,
        response: response,
      });
      setStatusMsg("✅ Saved to database!");
    } catch (error) {
      setStatusMsg("❌ Failed to save: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="app-container">

      <header className="app-header">
        <h1>🔮 AI Flow</h1>
        <p>Type a prompt → Run → See the AI's answer</p>
      </header>
      <div className="button-row">
        <button
          className="btn btn-run"
          onClick={handleRunFlow}
          disabled={loading}
        >
          {loading ? "⏳ Thinking..." : "▶ Run Flow"}
        </button>

        <button
          className="btn btn-save"
          onClick={handleSave}
          disabled={loading || !response}
        >
          💾 Save
        </button>
        {statusMsg && <span className="status-msg">{statusMsg}</span>}
      </div>

      <div className="flow-canvas">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background color="#aaa" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
