import { DocumentForm } from "./Form";
import {Col, Row} from "antd";
import {LoanFeeCalculator} from "./LoanFeeCalculator.tsx";

function App() {
  return (
      <div>
        <Row gutter={16}>
            <Col>
                <DocumentForm />
            </Col>
            <Col>
              <LoanFeeCalculator/>
            </Col>
        </Row>
      </div>
  );
}

export default App;
