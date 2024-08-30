import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Space,
  Select,
} from "antd";
import { MyDocument } from "./PDF";
import { usePDF } from "@react-pdf/renderer";
import { lettingaFees, nonLettingaFees, tuitionCosts } from "./values";
import {AcademicTerms, AidYear, Class, DocumentProps, Fee} from "./types";
import {calculateCengage, classFees} from "./fees.ts";

const academicTermOptions = Object.values(AcademicTerms).map((term) => ({
  value: term,
  label: term,
}));

const aidYearOptions = Object.values(AidYear).map((term) => ({
  value: term,
  label: term,
}));

const addCourseFees = (courses: Array<Class>, fees: Array<Fee>) => {
  const feesToAdd: Array<Fee> = [];
  for (const course of courses) {
    const courseFee = classFees[course.id as keyof typeof classFees];
    if (courseFee) {
      if(fees.some(fee => fee.name === course.id)) {
        continue;
      }
      feesToAdd.push({
          name: course.id,
          cost: courseFee,
          isCourseFee: true,
      });
    }
  }

  const combinedFees = fees.concat(feesToAdd);
  const deduplication = combinedFees.filter((fee, index, self) =>
    index === self.findIndex((t) => t.name === fee.name)
  );
  const removeFeeIfClassIsRemoved = deduplication.filter((fee) => {
    if (fee.isCourseFee) {
      return courses.some((course) => course.id === fee.name);
    }
    return true;
  });
  const updateCengage = calculateCengage(courses.map(course => course.id));
  const cengageFee = removeFeeIfClassIsRemoved.find(fee => fee.name === "Cengage");
  if (cengageFee) {
    if(updateCengage !== 0)
      cengageFee.cost = updateCengage;
    else
        removeFeeIfClassIsRemoved.splice(removeFeeIfClassIsRemoved.indexOf(cengageFee), 1);
  } else {
    if(updateCengage !== 0)
      removeFeeIfClassIsRemoved.push({
          name: "Cengage",
          cost: updateCengage,
          isCourseFee: true,
      });
  }

  return removeFeeIfClassIsRemoved;
}

export const DocumentForm: React.FC = () => {
  const [form] = Form.useForm<DocumentProps>();
  const [instance, updateInstance] = usePDF({
    document: <MyDocument {...form.getFieldsValue()} />,
  });
  const [tuition, setTuition] = useState<number>(tuitionCosts.undergrad);
  const [lettinga, setLettinga] = useState<boolean>(false);

  const formName =
    form.getFieldValue("studentName") +
    " " +
    form.getFieldValue("semester") +
    " Estimate.pdf";

  const onFinish = async () => {
    const link = document.createElement("a");
    link.href = instance.url!;
    link.setAttribute("download", formName);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode!.removeChild(link);
  };

  const onReset = () => {
    form.resetFields();
    setTuition(tuitionCosts.undergrad);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onValuesChange = (changed: any) => {
    if (changed["semester"]) {
      const semester: string = changed["semester"];
      if (semester.startsWith("Fall")) {
        if (semester.endsWith("23")) {
          form.setFieldValue("aidYear", AidYear.AY2324);
        }
        if (semester.endsWith("24")) {
          form.setFieldValue("aidYear", AidYear.AY2425);
        }
        if (semester.endsWith("25")) {
          form.setFieldValue("aidYear", AidYear.AY2526);
        }
        if (semester.endsWith("26")) {
          form.setFieldValue("aidYear", AidYear.AY2627);
        }
      }
      if (semester.startsWith("Winter") || semester.startsWith("Spring")) {
        if (semester.endsWith("24")) {
          form.setFieldValue("aidYear", AidYear.AY2324);
        }
        if (semester.endsWith("25")) {
          form.setFieldValue("aidYear", AidYear.AY2425);
        }
        if (semester.endsWith("26")) {
          form.setFieldValue("aidYear", AidYear.AY2526);
        }
        if (semester.endsWith("27")) {
          form.setFieldValue("aidYear", AidYear.AY2627);
        }
      }
    }
    form.setFieldValue("fees", addCourseFees(form.getFieldValue("classes"), form.getFieldValue("fees")))
    updateInstance(<MyDocument {...form.getFieldsValue()} />);
  };

  const addDefaultFees = () => {
    const fees: Array<unknown> = form.getFieldValue("fees");
    if (lettinga) {
      fees.push(...lettingaFees);
    } else {
      fees.push(...nonLettingaFees);
    }
    form.setFieldValue("fees", fees);
    updateInstance(<MyDocument {...form.getFieldsValue()} />);
  };

  return (
    <>
      <Card
        size="small"
        title="Options"
        style={{
          maxWidth: 600,
          marginBottom: 40,
        }}
      >
        <p style={{ fontWeight: "bold" }}>Default Tuition Price: {tuition}</p>
        <Space>
          <Button onClick={() => setTuition(tuitionCosts.undergrad)}>
            {tuitionCosts.undergrad} (undergrad)
          </Button>
          <Button onClick={() => setTuition(tuitionCosts.grad)}>
            {tuitionCosts.grad} (grad)
          </Button>
          <Button onClick={() => setTuition(tuitionCosts.nursing)}>
            {tuitionCosts.nursing} (nursing)
          </Button>
        </Space>
        <p style={{ fontWeight: "bold" }}>
          Lettinga: {lettinga ? "Yes" : "No"}
        </p>
        <Checkbox onChange={(checked) => setLettinga(checked.target.checked)} />
      </Card>
      <Form<DocumentProps>
        name="dynamic_form_nest_item"
        onFinish={onFinish}
        style={{
          maxWidth: 600,
          gap: 16,
          display: "flex",
          flexDirection: "column",
        }}
        autoComplete="off"
        initialValues={{
          semester: AcademicTerms.Fall2024,
          aidYear: AidYear.AY2425,
          classes: [],
          fees: [],
          aid: [],
          studentId: "",
          studentName: "",
        }}
        onValuesChange={onValuesChange}
        form={form}
      >
        <Space>
          <Form.Item
            label="Student Name"
            name="studentName"
            rules={[{ required: true, message: "Please input student name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Student Id"
            name="studentId"
            rules={[{ required: true, message: "Please input student id" }]}
          >
            <Input />
          </Form.Item>
        </Space>

        <Space>
          <Form.Item
            label="Semester"
            name="semester"
            rules={[{ required: true, message: "Please select semester" }]}
          >
            <Select style={{ width: 200 }} options={academicTermOptions} />
          </Form.Item>
          <Form.Item
            label="Aid Year (fees text)"
            name="aidYear"
            rules={[{ required: true, message: "Please select aid year" }]}
          >
            <Select style={{ width: 100 }} options={aidYearOptions} />
          </Form.Item>
        </Space>

        <Card size="small" title="Classes">
          <Form.List name="classes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "id"]}
                      rules={[{ required: true, message: "Missing id" }]}
                    >
                      <Input placeholder="ID" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "creditHours"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing credit hours",
                          type: "number",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Credit Hours"
                        type="number"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "cost"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing cost",
                          type: "number",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Cost Per Credit Hour"
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ creditHours: 3, cost: tuition })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Class
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card
          size="small"
          title="Fees"
          extra={<PlusOutlined onClick={addDefaultFees} />}
        >
          <Form.List name="fees">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Missing name" }]}
                    >
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "cost"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing cost",
                          type: "number",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Cost"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "isCourseFee"]}
                      label="Is Course Fee"
                      valuePropName={"checked"}
                    >
                      <Checkbox />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Fee
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>

        <Card size="small" title="Aid">
          <Form.List name="aid">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8 }}
                    align="baseline"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Missing name" }]}
                    >
                      <Input placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "amount"]}
                      rules={[
                        {
                          required: true,
                          message: "Missing amount",
                          type: "number",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Amount"
                      />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Aid
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Card>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Generate Estimate
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};
