type ActionStatus = "error" | "idle" | "success";

export type DemoRequestField =
  | "childAge"
  | "childName"
  | "city"
  | "email"
  | "notes"
  | "parentName"
  | "phone"
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

export type AdminLoginState = {
  message?: string;
  status: "error" | "idle";
};

type ActionState<TField extends string> = {
  fieldErrors?: Partial<Record<TField, string>>;
  message?: string;
  status: ActionStatus;
};

export type DemoRequestFormState = ActionState<DemoRequestField>;
export type ContactMessageFormState = ActionState<ContactMessageField>;
export type FranchiseApplicationFormState =
  ActionState<FranchiseApplicationField>;

export const adminLoginInitialState: AdminLoginState = {
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
