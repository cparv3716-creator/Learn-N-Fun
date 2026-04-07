type ActionStatus = "error" | "idle" | "success";

export type DemoRequestField =
  | "childAge"
  | "childName"
  | "city"
  | "demoMode"
  | "email"
  | "notes"
  | "parentName"
  | "phone"
  | "preferredDemoDate"
  | "preferredDemoTime"
  | "preferredSlot"
  | "programInterest";

export type ContactMessageField =
  | "email"
  | "enquiryType"
  | "message"
  | "name"
  | "phone";

export type FranchiseApplicationField =
  | "city"
  | "email"
  | "experience"
  | "message"
  | "name"
  | "phone";

export type PortalLoginField = "email" | "password";

export type PortalSignupField =
  | "city"
  | "confirmPassword"
  | "email"
  | "fullName"
  | "password"
  | "phone"
  | "role"
  | "studentAge"
  | "studentName";

export type AdminLoginState = {
  message?: string;
  status: "error" | "idle";
};

export type StudentProfileField =
  | "city"
  | "currentLevel"
  | "fullName"
  | "modePreference"
  | "phone"
  | "portalEmail"
  | "preferredSlot"
  | "programName"
  | "status"
  | "studentAge"
  | "studentName";

export type EnrollmentField =
  | "batchName"
  | "currentLevel"
  | "monthlyFeeInr"
  | "portalProfileId"
  | "programName"
  | "startedAt"
  | "status";

export type AttendanceField =
  | "classDate"
  | "enrollmentId"
  | "note"
  | "portalProfileId"
  | "status";

export type ProgressField =
  | "detail"
  | "enrollmentId"
  | "portalProfileId"
  | "sortOrder"
  | "status"
  | "title";

export type TeacherNoteField =
  | "enrollmentId"
  | "message"
  | "portalProfileId"
  | "teacherName";

type ActionState<TField extends string> = {
  fieldErrors?: Partial<Record<TField, string>>;
  message?: string;
  status: ActionStatus;
};

export type PortalLoginState = ActionState<PortalLoginField>;
export type PortalSignupState = ActionState<PortalSignupField>;
export type DemoRequestFormState = ActionState<DemoRequestField>;
export type ContactMessageFormState = ActionState<ContactMessageField>;
export type FranchiseApplicationFormState =
  ActionState<FranchiseApplicationField>;
export type StudentProfileFormState = ActionState<StudentProfileField>;
export type EnrollmentFormState = ActionState<EnrollmentField>;
export type AttendanceFormState = ActionState<AttendanceField>;
export type ProgressFormState = ActionState<ProgressField>;
export type TeacherNoteFormState = ActionState<TeacherNoteField>;

export const adminLoginInitialState: AdminLoginState = {
  status: "idle",
};

export const portalLoginInitialState: PortalLoginState = {
  status: "idle",
};

export const portalSignupInitialState: PortalSignupState = {
  status: "idle",
};

export const demoRequestInitialState: DemoRequestFormState = {
  status: "idle",
};

export const contactMessageInitialState: ContactMessageFormState = {
  status: "idle",
};

export const franchiseApplicationInitialState: FranchiseApplicationFormState = {
  status: "idle",
};

export const studentProfileInitialState: StudentProfileFormState = {
  status: "idle",
};

export const enrollmentInitialState: EnrollmentFormState = {
  status: "idle",
};

export const attendanceInitialState: AttendanceFormState = {
  status: "idle",
};

export const progressInitialState: ProgressFormState = {
  status: "idle",
};

export const teacherNoteInitialState: TeacherNoteFormState = {
  status: "idle",
};
