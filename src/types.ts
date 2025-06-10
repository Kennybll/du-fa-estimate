import { tuitionCosts2425 } from "./data/tuition.24-25";
import { tuitionCosts2526 } from "./data/tuition.25-26";

export type Class = {
	id: string;
	creditHours: number;
	cost: number;
};

export type Fee = {
	name: string;
	cost: number;
	isCourseFee: boolean;
	manual?: boolean;
};

export type Aid = {
	name: string;
	amount: number;
};

export enum AcademicTerms {
	Fall2023 = "Fall 2023",
	Winter2024 = "Winter 2024",
	SpringSummer2024 = "Spring/Summer 2024",

	Fall2024 = "Fall 2024",
	Winter2025 = "Winter 2025",
	SpringSummer2025 = "Spring/Summer 2025",

	Fall2025 = "Fall 2025",
	Winter2026 = "Winter 2026",
	SpringSummer2026 = "Spring/Summer 2026",

	Fall2026 = "Fall 2026",
	Winter2027 = "Winter 2027",
	SpringSummer2027 = "Spring/Summer 2027",
}

export type TuitionCosts = {
	undergrad: number;
	grad: number;
	nursing: number;
};

// Tuition takes effect during Summer, fees take effect in Fall
export const AcademicTermToTuition = {
	"Fall 2023": tuitionCosts2425,
	"Winter 2024": tuitionCosts2425,

	"Spring/Summer 2024": tuitionCosts2425,
	"Fall 2024": tuitionCosts2425,
	"Winter 2025": tuitionCosts2425,

	"Spring/Summer 2025": tuitionCosts2526,
	"Fall 2025": tuitionCosts2526,
	"Winter 2026": tuitionCosts2526,

	"Spring/Summer 2026": tuitionCosts2526,
	"Fall 2026": tuitionCosts2526,
	"Winter 2027": tuitionCosts2526,

	"Spring/Summer 2027": tuitionCosts2526,
} as Record<AcademicTerms, TuitionCosts>;

export enum AidYear {
	AY2324 = "23-24",
	AY2425 = "24-25",
	AY2526 = "25-26",
	AY2627 = "26-27",
}

export type DocumentProps = {
	semester: AcademicTerms;
	aidYear: AidYear;
	studentName: string;
	studentId: string;
	classes: Array<Class>;
	fees: Array<Fee>;
	aid: Array<Aid>;
};
