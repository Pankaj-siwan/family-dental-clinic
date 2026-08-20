export type WebsiteAppointment = {
  patientName: string;
  mobile: string;
  age: number | null;
  gender: string;
  clinicId: string;
  clinicName: string;
  clinicDisplayName?: string;
  appointmentDate: string;
  appointmentTime: string;
  chiefComplaint: string;
};

type AvailableSlotRequest = {
  clinicName: string;
  appointmentDate: string;
  allSlots: string[];
};

function firestoreValue(value: string | number | null | boolean) {
  if (value === null) return { nullValue: null };
  if (typeof value === "number") return { integerValue: String(value) };
  if (typeof value === "boolean") return { booleanValue: value };
  return { stringValue: value };
}

function firebaseConfig() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!projectId || !apiKey) {
    throw new Error("Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_API_KEY to .env.local.");
  }
  return { projectId, apiKey };
}

function toClinicManagerDate(isoDate: string) {
  const parts = isoDate.split("-");
  if (parts.length != 3) throw new Error("Invalid appointment date.");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function makeAppointmentId(data: WebsiteAppointment) {
  const mobileDigits = data.mobile.replace(/\D/g, "").slice(-10);
  return [data.clinicId, data.appointmentDate, data.appointmentTime, mobileDigits]
    .join("-")
    .replace(/[^a-zA-Z0-9_-]/g, "");
}

function decodeFirestoreValue(value: any): unknown {
  if (!value || typeof value !== "object") return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  return null;
}

function decodeFirestoreFields(fields: Record<string, any> | undefined) {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields ?? {})) {
    result[key] = decodeFirestoreValue(value);
  }
  return result;
}

function isBlockingAppointment(row: Record<string, unknown>) {
  const status = String(row.status ?? "").trim().toLowerCase();
  const openStatus = String(row.appointmentOpenStatus ?? "").trim().toLowerCase();

  const completed =
    row.appointmentCompleted === true ||
    status === "completed" ||
    openStatus === "completed";

  const cancelled =
    ["cancelled", "canceled", "rejected", "deleted"].includes(status) ||
    ["cancelled", "canceled", "rejected", "closed"].includes(openStatus);

  return !completed && !cancelled;
}

function removePastSlots(appointmentDate: string, slots: string[]) {
  const today = new Date();
  const selected = new Date(`${appointmentDate}T00:00:00`);

  if (
    selected.getFullYear() !== today.getFullYear() ||
    selected.getMonth() !== today.getMonth() ||
    selected.getDate() !== today.getDate()
  ) return slots;

  const toMinutes = (time: string) => {
    const match = time.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/i);
    if (!match) return -1;
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3].toUpperCase();
    if (period === "AM" && hour === 12) hour = 0;
    if (period === "PM" && hour !== 12) hour += 12;
    return hour * 60 + minute;
  };

  const nowMinutes = today.getHours() * 60 + today.getMinutes();
  return slots.filter((slot) => toMinutes(slot) > nowMinutes);
}

export async function getAvailableAppointmentSlots({
  clinicName,
  appointmentDate,
  allSlots,
}: AvailableSlotRequest): Promise<string[]> {
  const { projectId, apiKey } = firebaseConfig();
  const clinicManagerDate = toClinicManagerDate(appointmentDate);

  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents:runQuery?key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "appointments" }],
        where: {
          compositeFilter: {
            op: "AND",
            filters: [
              {
                fieldFilter: {
                  field: { fieldPath: "clinicName" },
                  op: "EQUAL",
                  value: { stringValue: clinicName },
                },
              },
              {
                fieldFilter: {
                  field: { fieldPath: "appointmentDate" },
                  op: "EQUAL",
                  value: { stringValue: clinicManagerDate },
                },
              },
            ],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error?.message || "The available appointment slots could not be loaded.");
  }

  const rows = (await response.json()) as Array<{ document?: { fields?: Record<string, any> } }>;
  const occupied = new Set(
    rows
      .filter((item) => item.document?.fields)
      .map((item) => decodeFirestoreFields(item.document?.fields))
      .filter(isBlockingAppointment)
      .map((item) => String(item.appointmentTime ?? "").trim())
      .filter(Boolean),
  );

  return removePastSlots(appointmentDate, allSlots).filter((slot) => !occupied.has(slot));
}

export async function createWebsiteAppointment(data: WebsiteAppointment) {
  const { projectId, apiKey } = firebaseConfig();
  const appointmentId = makeAppointmentId(data);
  const clinicManagerDate = toClinicManagerDate(data.appointmentDate);

  const recheckedSlots = await getAvailableAppointmentSlots({
    clinicName: data.clinicName,
    appointmentDate: data.appointmentDate,
    allSlots: [data.appointmentTime],
  });

  if (!recheckedSlots.includes(data.appointmentTime)) {
    throw new Error("This appointment time has just been taken. Please choose another available slot.");
  }

  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    `/databases/(default)/documents/appointments?documentId=${encodeURIComponent(appointmentId)}` +
    `&key=${encodeURIComponent(apiKey)}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: {
        patientName: firestoreValue(data.patientName),
        patientMobile: firestoreValue(data.mobile),
        mobile: firestoreValue(data.mobile),
        age: firestoreValue(data.age),
        gender: firestoreValue(data.gender),
        clinicId: firestoreValue(data.clinicId),
        clinicName: firestoreValue(data.clinicName),
        clinicDisplayName: firestoreValue(data.clinicDisplayName ?? data.clinicName),
        appointmentDate: firestoreValue(clinicManagerDate),
        appointmentDateIso: firestoreValue(data.appointmentDate),
        appointmentTime: firestoreValue(data.appointmentTime),
        reason: firestoreValue(data.chiefComplaint),
        chiefComplaint: firestoreValue(data.chiefComplaint),
        doctorName: firestoreValue(data.clinicName.includes("Anita") ? "Dr. Anita Kumari" : "Dr. Pankaj"),
        appointmentType: firestoreValue("Website appointment request"),
        source: firestoreValue("website"),
        status: firestoreValue("awaiting_confirmation"),
        appointmentOpenStatus: firestoreValue("Pending confirmation"),
        appointmentCompleted: firestoreValue(false),
        appointmentClosed: firestoreValue(false),
        doctorConfirmationRequired: firestoreValue(true),
        notificationPending: firestoreValue(true),
        notificationMessage: firestoreValue("A patient is trying to obtain the appointment"),
        createdAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });

  if (response.ok) return { appointmentId };

  const errorBody = await response.json().catch(() => null);
  const status = errorBody?.error?.status;

  if (response.status === 409 || status === "ALREADY_EXISTS") {
    throw new Error("An appointment request already exists for this patient, clinic, date, and time.");
  }

  if (status === "PERMISSION_DENIED") {
    throw new Error("Website appointment saving is not enabled in Firebase. Update the Firestore rules.");
  }

  throw new Error(errorBody?.error?.message || "The appointment request could not be submitted. Please try again.");
}
