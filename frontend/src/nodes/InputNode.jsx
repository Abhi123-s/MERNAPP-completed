import { Handle, Position } from "@xyflow/react";

function InputNode({ data }) {
  return (
    <div className="node input-node">
      <p className="node-title">✏️ Your Prompt</p>

      <textarea
        className="prompt-textarea"
        placeholder="Type your question here..."
        value={data.prompt}
        onChange={(e) => data.onChange(e.target.value)}
        rows={4}
      />

     
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default InputNode;
