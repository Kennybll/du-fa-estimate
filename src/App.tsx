import { DocumentForm } from "./Form";
import { Col, Form, Row } from "antd";
import { LoanFeeCalculator } from "./LoanFeeCalculator.tsx";
import { QuickAddButtons } from "./QuickAddButtons.tsx";
import { DocumentProps } from "./types.ts";

function App() {
  const [form] = Form.useForm<DocumentProps>();

  const onAddAid = (name: string) => {
    form.setFieldsValue({
      aid: [...form.getFieldValue("aid"), { name, amount: 0 }],
    });
  };

  const onAddFee = (name: string) => {
    form.setFieldsValue({
      fees: [
        ...form.getFieldValue("fees"),
        { name, amount: 0, isCourseFee: false, manual: true },
      ],
    });
  };

  return (
    <div>
      <Row gutter={16}>
        <Col>
          <DocumentForm form={form} />
        </Col>
        <Col>
          <LoanFeeCalculator />
        </Col>
        <Col>
          <QuickAddButtons onAddAid={onAddAid} onAddFee={onAddFee} />
        </Col>
      </Row>
    </div>
  );
}

export default App;
