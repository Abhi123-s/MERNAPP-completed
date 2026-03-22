import { Handle, Position } from "@xyflow/react";

function ResultNode({ data }) {
  return (
    <div className="node result-node">
      <Handle type="target" position={Position.Left} />

      <p className="node-title">🤖 AI Response</p>

      <div className="response-box">
        {data.response
          ? data.response
          : "The answer will appear here after you click Run Flow."}
      </div>
    </div>
  );
}

export default ResultNode;
