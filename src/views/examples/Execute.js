import { useState } from "react"; 
import { executeCommand } from '../../grpcClient';
import {
  Card,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Spinner,
  FormText
} from "reactstrap";
// import { execute } from "@/lib/backend";

// JSON Prettifier component converted to work with Reactstrap
const JsonPrettifier = ({ output }) => {
  try {
    const prettyJson = typeof output === 'string' ? 
      JSON.stringify(JSON.parse(output), null, 2) : 
      JSON.stringify(output, null, 2);
    
    return (
      <pre className="bg-light p-3 rounded">
        <code>{prettyJson}</code>
      </pre>
    );
  } catch {
    return <pre className="bg-light p-3 rounded"><code>{output}</code></pre>;
  }
};

const Execute = () => {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [type, setType] = useState("WASM");
  const [binary, setBinary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await executeCommand({name, input, type, binary});
      setOutput(response);
    } catch (error) {
      setOutput("An error occurred during execution.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOutput(null);
    setName("");
    setInput("");
    setType("WAT");
    setBinary(null);
  };

  return (
    <Card className="shadow">
      <CardHeader>
        <h3 className="mb-0">Execute Program (app triggered)</h3>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "16rem" }}>
            <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          </div>
        ) : output ? (
          <div className="d-flex flex-column gap-3">
            <JsonPrettifier output={output} />
            <Button color="primary" onClick={resetForm}>
              Execute Another
            </Button>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <FormGroup className="mb-3">
              <Label for="name">Program Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter program name"
              />
            </FormGroup>

            <FormGroup className="mb-3">
              <Label for="input">Input</Label>
              <Input
                id="input"
                type="textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{ fontFamily: "monospace" }}
                required
                rows="4"
              />
              <FormText color="muted">
                The input is passed to the WebAssembly module as a JSON.
              </FormText>
            </FormGroup>

            <FormGroup className="mb-3">
              <Label for="type">Type</Label>
              <Input
                type="select"
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="WAT">WAT</option>
                <option value="WASM">WASM</option>
              </Input>
            </FormGroup>

            <FormGroup className="mb-4">
              <Label for="binary">Binary</Label>
              <Input
                id="binary"
                type="file"
                onChange={(e) => setBinary(e.target.files?.[0] || null)}
                required
                accept={type === "WAT" ? ".wat" : type === "WASM" ? ".wasm" : ""}
                className="form-control-file"
              />
            </FormGroup>

            <Button color="primary" type="submit" block>
              Execute
            </Button>
          </Form>
        )}
      </CardBody>
    </Card>
  );
};

export default Execute;