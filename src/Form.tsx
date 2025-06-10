import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { usePDF } from "@react-pdf/renderer";
import {
	Button,
	Card,
	Checkbox,
	Form,
	type FormInstance,
	Input,
	InputNumber,
	Select,
	Space,
} from "antd";
import type React from "react";
import { useState } from "react";
import { MyDocument } from "./PDF";
import { calculateCengage, classFees } from "./data/fees.24-25.ts";
import { lettingaFees2425, nonLettingaFees2425 } from "./data/tuition.24-25.ts";
import {
	lettingaFees2526,
	nonLettingaFees2526,
	tuitionCosts2526,
} from "./data/tuition.25-26.ts";
import {
	AcademicTermToTuition,
	AcademicTerms,
	AidYear,
	type Class,
	type DocumentProps,
	type Fee,
	type TuitionCosts,
} from "./types";

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
			if (fees.some((fee) => fee.name === course.id)) {
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
	const deduplication = combinedFees.filter(
		(fee, index, self) =>
			fee.name === "" || index === self.findIndex((t) => t.name === fee.name),
	);
	let removeFeeIfClassIsRemoved = deduplication.filter((fee) => {
		if (fee.isCourseFee && !fee?.manual) {
			return courses.some((course) => course.id === fee.name);
		}
		return true;
	});
	const updateCengage = calculateCengage(courses.map((course) => course.id));
	const cengageFee = removeFeeIfClassIsRemoved.find(
		(fee) => fee.name === "Cengage",
	);
	if (cengageFee) {
		if (updateCengage !== 0) cengageFee.cost = updateCengage;
		else
			removeFeeIfClassIsRemoved = removeFeeIfClassIsRemoved.filter(
				(f) => f.name !== "Cengage",
			);
	} else {
		if (updateCengage !== 0)
			removeFeeIfClassIsRemoved.push({
				name: "Cengage",
				cost: updateCengage,
				isCourseFee: true,
			});
	}

	return removeFeeIfClassIsRemoved;
};

type props = {
	form: FormInstance<DocumentProps>;
};

export const DocumentForm: React.FC<props> = ({ form }) => {
	const [instance, updateInstance] = usePDF({
		document: <MyDocument {...form.getFieldsValue()} />,
	});
	const [tuitionType, setTuitionType] =
		useState<keyof TuitionCosts>("undergrad");
	const [tuition, setTuition] = useState<number>(tuitionCosts2526.undergrad);
	const [lettinga, setLettinga] = useState<boolean>(false);

	const formName = `${form.getFieldValue("studentName")} ${form.getFieldValue("semester")} Estimate.pdf`;

	const onFinish = async () => {
		const link = document.createElement("a");
		link.href = instance.url as string;
		link.setAttribute("download", formName);

		// Append to html link element page
		document.body.appendChild(link);

		// Start download
		link.click();

		// Clean up and remove the link
		link.parentNode?.removeChild(link);
	};

	const onReset = () => {
		form.resetFields();
		setTuition(tuitionCosts2526.undergrad);
	};

	const onValuesChange = (changed: Partial<DocumentProps>) => {
		if (changed.semester) {
			const semester: string = changed.semester;
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
			setTuition(
				AcademicTermToTuition[form.getFieldValue("semester") as AcademicTerms][
					tuitionType
				],
			);
		}
		form.setFieldValue(
			"fees",
			addCourseFees(form.getFieldValue("classes"), form.getFieldValue("fees")),
		);
		updateInstance(<MyDocument {...form.getFieldsValue()} />);
	};

	const addDefaultFees = () => {
		const fees: Array<unknown> = form.getFieldValue("fees");
		const semester = form.getFieldValue("semester") as AcademicTerms;
		if (lettinga) {
			if (
				(
					["Fall 2024", "Winter 2025", "Spring/Summer 2025"] as AcademicTerms[]
				).includes(semester)
			)
				fees.push(...lettingaFees2425);
			else if (
				(
					["Fall 2025", "Winter 2026", "Spring/Summer 2026"] as AcademicTerms[]
				).includes(semester)
			)
				fees.push(...lettingaFees2526);
			else fees.push(...lettingaFees2425);
		} else {
			if (
				(
					["Fall 2024", "Winter 2025", "Spring/Summer 2025"] as AcademicTerms[]
				).includes(semester)
			)
				fees.push(...nonLettingaFees2425);
			else if (
				(
					["Fall 2025", "Winter 2026", "Spring/Summer 2026"] as AcademicTerms[]
				).includes(semester)
			)
				fees.push(...nonLettingaFees2526);
			else fees.push(...nonLettingaFees2526);
		}
		form.setFieldValue("fees", fees);
		updateInstance(<MyDocument {...form.getFieldsValue()} />);
	};

	const selectedTuitionCosts =
		AcademicTermToTuition[form.getFieldValue("semester") as AcademicTerms] ??
		AcademicTermToTuition["Fall 2025"];

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
				<p style={{ fontWeight: "bold" }}>
					Current Tuition Price: {tuition} ({tuitionType})
				</p>
				<Space>
					<Button
						onClick={() => {
							setTuition(selectedTuitionCosts.undergrad);
							setTuitionType("undergrad");
						}}
					>
						{selectedTuitionCosts.undergrad} (undergrad)
					</Button>
					<Button
						onClick={() => {
							setTuition(selectedTuitionCosts.grad);
							setTuitionType("grad");
						}}
					>
						{selectedTuitionCosts.grad} (grad)
					</Button>
					<Button
						onClick={() => {
							setTuition(selectedTuitionCosts.nursing);
							setTuitionType("nursing");
						}}
					>
						{selectedTuitionCosts.nursing} (nursing)
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
					semester: AcademicTerms.Fall2025,
					aidYear: AidYear.AY2526,
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
											fieldId={key.toString()}
											key={key}
										>
											<Checkbox />
										</Form.Item>
										<MinusCircleOutlined
											style={{ marginLeft: 10 }}
											onClick={() => remove(name)}
										/>
									</Space>
								))}
								<Form.Item>
									<Button
										type="dashed"
										onClick={() =>
											add({
												name: "",
												cost: 0,
												isCourseFee: false,
												manual: true,
											})
										}
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
