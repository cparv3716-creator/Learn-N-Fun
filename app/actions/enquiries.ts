"use server";

import { revalidatePath } from "next/cache";
import type {
  ContactMessageFormState,
  ContactMessageField,
  DemoRequestField,
  DemoRequestFormState,
  FranchiseApplicationField,
  FranchiseApplicationFormState,
} from "@/app/actions/form-states";
import { prisma } from "@/lib/prisma";
import { programs } from "@/lib/site-data";
import { sendAdminNotification } from "@/server/admin-notifications";

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_NAME_LENGTH = 80;
const MAX_CITY_LENGTH = 80;
const MAX_NOTES_LENGTH = 1000;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_EXPERIENCE_LENGTH = 1500;
const demoProgramOptions = new Set([
  ...programs.map((program) => program.name),
  "Need guidance",
]);
const demoPreferredSlots = new Set([
  "Weekday afternoon",
  "Weekday evening",
  "Saturday",
  "Sunday",
]);
const contactEnquiryTypes = new Set([
  "Admissions",
  "Programs",
  "Parent support",
  "Franchise",
  "General",
]);

function normalizeSingleLineText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeMultilineText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^\+?[0-9]{7,15}$/.test(phone);
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

function isWithinLength(value: string, maxLength: number) {
  return value.length <= maxLength;
}

function getDuplicateThreshold() {
  return new Date(Date.now() - DUPLICATE_WINDOW_MS);
}

export async function submitDemoRequest(
  _previousState: DemoRequestFormState,
  formData: FormData,
): Promise<DemoRequestFormState> {
  if (normalizeSingleLineText(formData.get("website"))) {
    return {
      message: "Thanks. Your demo request has been submitted successfully.",
      status: "success",
    };
  }

  const parentName = normalizeSingleLineText(formData.get("parentName"));
  const childName = normalizeSingleLineText(formData.get("childName"));
  const childAgeValue = normalizeSingleLineText(formData.get("childAge"));
  const city = normalizeSingleLineText(formData.get("city"));
  const email = normalizeSingleLineText(formData.get("email")).toLowerCase();
  const phone = normalizePhone(normalizeSingleLineText(formData.get("phone")));
  const programInterest = normalizeSingleLineText(formData.get("programInterest"));
  const preferredSlot =
    normalizeSingleLineText(formData.get("preferredSlot")) ||
    normalizeSingleLineText(formData.get("timeSlot"));
  const notes = normalizeMultilineText(formData.get("notes"));

  const fieldErrors: Partial<Record<DemoRequestField, string>> = {};
  const childAge = Number.parseInt(childAgeValue, 10);

  if (!parentName) fieldErrors.parentName = "Please enter the parent's name.";
  if (!childName) fieldErrors.childName = "Please enter the child's name.";
  if (parentName && !isWithinLength(parentName, MAX_NAME_LENGTH)) {
    fieldErrors.parentName = "Please keep the parent's name under 80 characters.";
  }
  if (childName && !isWithinLength(childName, MAX_NAME_LENGTH)) {
    fieldErrors.childName = "Please keep the child's name under 80 characters.";
  }
  if (!Number.isInteger(childAge) || childAge < 4 || childAge > 16) {
    fieldErrors.childAge = "Please choose a valid age.";
  }
  if (!city) fieldErrors.city = "Please enter your city.";
  if (city && !isWithinLength(city, MAX_CITY_LENGTH)) {
    fieldErrors.city = "Please keep the city name under 80 characters.";
  }
  if (!email || !isValidEmail(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (!phone || !isValidPhone(phone)) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }
  if (!programInterest) {
    fieldErrors.programInterest = "Please choose a program interest.";
  } else if (!demoProgramOptions.has(programInterest)) {
    fieldErrors.programInterest = "Please choose a valid program interest.";
  }
  if (!preferredSlot) {
    fieldErrors.preferredSlot = "Please choose a preferred slot.";
  } else if (!demoPreferredSlots.has(preferredSlot)) {
    fieldErrors.preferredSlot = "Please choose a valid preferred slot.";
  }
  if (notes && !isWithinLength(notes, MAX_NOTES_LENGTH)) {
    fieldErrors.notes = "Please keep the notes under 1000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please correct the highlighted fields and try again.",
      status: "error",
    };
  }

  try {
    const existingRequest = await prisma.demoRequest.findFirst({
      where: {
        childAge,
        childName,
        city,
        email,
        parentName,
        phone,
        preferredSlot,
        programInterest,
        createdAt: {
          gte: getDuplicateThreshold(),
        },
      },
      select: { id: true },
    });

    if (existingRequest) {
      return {
        message:
          "We already received this demo request and will follow up shortly.",
        status: "success",
      };
    }

    await prisma.demoRequest.create({
      data: {
        childAge,
        childName,
        city,
        email,
        notes: notes || null,
        parentName,
        phone,
        preferredSlot,
        programInterest,
      },
    });

    try {
      await sendAdminNotification({
        fields: [
          { label: "Parent name", value: parentName },
          { label: "Child name", value: childName },
          { label: "Child age", value: childAge.toString() },
          { label: "City", value: city },
          { label: "Email", value: email },
          { label: "Phone", value: phone },
          { label: "Program interest", value: programInterest },
          { label: "Preferred slot", value: preferredSlot },
          { label: "Notes", value: notes || null },
        ],
        subject: `New Book Demo submission from ${parentName}`,
        title: "New Book Demo submission",
      });
    } catch (error) {
      console.error("Failed to send demo request notification", error);
    }

    revalidatePath("/admin");

    return {
      message: "Thanks. Your demo request has been submitted successfully.",
      status: "success",
    };
  } catch (error) {
    console.error("Failed to save demo request", error);

    return {
      message: "We could not save your request right now. Please try again.",
      status: "error",
    };
  }
}

export async function submitContactMessage(
  _previousState: ContactMessageFormState,
  formData: FormData,
): Promise<ContactMessageFormState> {
  if (normalizeSingleLineText(formData.get("website"))) {
    return {
      message: "Thanks. Your message has been sent successfully.",
      status: "success",
    };
  }

  const name = normalizeSingleLineText(formData.get("name"));
  const phone = normalizePhone(normalizeSingleLineText(formData.get("phone")));
  const email = normalizeSingleLineText(formData.get("email")).toLowerCase();
  const enquiryType = normalizeSingleLineText(formData.get("enquiryType"));
  const message = normalizeMultilineText(formData.get("message"));

  const fieldErrors: Partial<Record<ContactMessageField, string>> = {};

  if (!name) fieldErrors.name = "Please enter your name.";
  if (name && !isWithinLength(name, MAX_NAME_LENGTH)) {
    fieldErrors.name = "Please keep your name under 80 characters.";
  }
  if (!phone || !isValidPhone(phone)) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }
  if (!email || !isValidEmail(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (!enquiryType) {
    fieldErrors.enquiryType = "Please choose an enquiry type.";
  } else if (!contactEnquiryTypes.has(enquiryType)) {
    fieldErrors.enquiryType = "Please choose a valid enquiry type.";
  }
  if (!message || message.length < 10) {
    fieldErrors.message = "Please share a little more detail in your message.";
  } else if (!isWithinLength(message, MAX_MESSAGE_LENGTH)) {
    fieldErrors.message = "Please keep your message under 2000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please correct the highlighted fields and try again.",
      status: "error",
    };
  }

  try {
    const existingMessage = await prisma.contactMessage.findFirst({
      where: {
        email,
        enquiryType,
        message,
        name,
        phone,
        createdAt: {
          gte: getDuplicateThreshold(),
        },
      },
      select: { id: true },
    });

    if (existingMessage) {
      return {
        message:
          "We already received this message and will get back to you shortly.",
        status: "success",
      };
    }

    await prisma.contactMessage.create({
      data: {
        email,
        enquiryType,
        message,
        name,
        phone,
      },
    });

    try {
      await sendAdminNotification({
        fields: [
          { label: "Name", value: name },
          { label: "Email", value: email },
          { label: "Phone", value: phone },
          { label: "Enquiry type", value: enquiryType },
          { label: "Message", value: message },
        ],
        subject: `New Contact submission from ${name}`,
        title: "New Contact submission",
      });
    } catch (error) {
      console.error("Failed to send contact notification", error);
    }

    revalidatePath("/admin");

    return {
      message: "Thanks. Your message has been sent successfully.",
      status: "success",
    };
  } catch (error) {
    console.error("Failed to save contact message", error);

    return {
      message: "We could not send your message right now. Please try again.",
      status: "error",
    };
  }
}

export async function submitFranchiseApplication(
  _previousState: FranchiseApplicationFormState,
  formData: FormData,
): Promise<FranchiseApplicationFormState> {
  if (normalizeSingleLineText(formData.get("website"))) {
    return {
      message: "Thanks. Your franchise application has been submitted.",
      status: "success",
    };
  }

  const name = normalizeSingleLineText(formData.get("name"));
  const phone = normalizePhone(normalizeSingleLineText(formData.get("phone")));
  const email = normalizeSingleLineText(formData.get("email")).toLowerCase();
  const city = normalizeSingleLineText(formData.get("city"));
  const experience = normalizeMultilineText(formData.get("experience"));
  const message = normalizeMultilineText(formData.get("message"));

  const fieldErrors: Partial<Record<FranchiseApplicationField, string>> = {};

  if (!name) fieldErrors.name = "Please enter your name.";
  if (name && !isWithinLength(name, MAX_NAME_LENGTH)) {
    fieldErrors.name = "Please keep your name under 80 characters.";
  }
  if (!phone || !isValidPhone(phone)) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }
  if (!email || !isValidEmail(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (!city) fieldErrors.city = "Please enter your city.";
  if (city && !isWithinLength(city, MAX_CITY_LENGTH)) {
    fieldErrors.city = "Please keep the city name under 80 characters.";
  }
  if (!experience || experience.length < 10) {
    fieldErrors.experience =
      "Please share a little more about your background or interest.";
  } else if (!isWithinLength(experience, MAX_EXPERIENCE_LENGTH)) {
    fieldErrors.experience =
      "Please keep your experience notes under 1500 characters.";
  }
  if (message && !isWithinLength(message, MAX_MESSAGE_LENGTH)) {
    fieldErrors.message = "Please keep your message under 2000 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      fieldErrors,
      message: "Please correct the highlighted fields and try again.",
      status: "error",
    };
  }

  try {
    const existingApplication = await prisma.franchiseApplication.findFirst({
      where: {
        city,
        email,
        experience,
        name,
        phone,
        message: message || null,
        createdAt: {
          gte: getDuplicateThreshold(),
        },
      },
      select: { id: true },
    });

    if (existingApplication) {
      return {
        message:
          "We already received this franchise application and will follow up shortly.",
        status: "success",
      };
    }

    await prisma.franchiseApplication.create({
      data: {
        city,
        email,
        experience,
        message: message || null,
        name,
        phone,
      },
    });

    try {
      await sendAdminNotification({
        fields: [
          { label: "Name", value: name },
          { label: "Email", value: email },
          { label: "Phone", value: phone },
          { label: "City", value: city },
          { label: "Experience", value: experience },
          { label: "Message", value: message || null },
        ],
        subject: `New Franchise Application from ${name}`,
        title: "New Franchise application",
      });
    } catch (error) {
      console.error("Failed to send franchise notification", error);
    }

    revalidatePath("/admin");

    return {
      message: "Thanks. Your franchise application has been submitted.",
      status: "success",
    };
  } catch (error) {
    console.error("Failed to save franchise application", error);

    return {
      message:
        "We could not save your franchise application right now. Please try again.",
      status: "error",
    };
  }
}
