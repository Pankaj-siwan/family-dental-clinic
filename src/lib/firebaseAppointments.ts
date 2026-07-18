export type WebsiteAppointment = {
  patientName: string;
  mobile: string;
  age: number | null;
  gender: string;
  clinicId: string;
  clinicName: string;
  appointmentDate: string;
  appointmentTime: string;
  chiefComplaint: string;
};

function firestoreValue(value: string | number | null | boolean) {
  if (value === null) return { nullValue: null };
  if (typeof value === "number") return { integerValue: String(value) };
  if (typeof value === "boolean") return { booleanValue: value };
  return { stringValue: value };
}

function makeAppointmentId(data: WebsiteAppointment) {
  const mobileDigits = data.mobile.replace(/\D/g, "").slice(-10);
  return [data.clinicId, data.appointmentDate, data.appointmentTime, mobileDigits]
    .join("-")
    .replace(/[^a-zA-Z0-9_-]/g, "");
}

export async function createWebsiteAppointment(data: WebsiteAppointment) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

  if (!projectId || !apiKey) {
    throw new Error(
      "Firebase is not configured yet. Add NEXT_PUBLIC_FIREBASE_PROJECT_ID and NEXT_PUBLIC_FIREBASE_API_KEY to .env.local.",
    );
  }

  const appointmentId = makeAppointmentId(data);
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
        mobile: firestoreValue(data.mobile),
        age: firestoreValue(data.age),
        gender: firestoreValue(data.gender),
        clinicId: firestoreValue(data.clinicId),
        clinicName: firestoreValue(data.clinicName),
        appointmentDate: firestoreValue(data.appointmentDate),
        appointmentTime: firestoreValue(data.appointmentTime),
        chiefComplaint: firestoreValue(data.chiefComplaint),
        source: firestoreValue("website"),
        status: firestoreValue("pending"),
        createdAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });

  if (response.ok) return;

  const errorBody = await response.json().catch(() => null);
  const status = errorBody?.error?.status;

  if (response.status === 409 || status === "ALREADY_EXISTS") {
    throw new Error(
      "An appointment request already exists for this patient, clinic, date, and time.",
    );
  }

  if (status === "PERMISSION_DENIED") {
    throw new Error(
      "Appointment saving is not enabled in Firebase yet. Publish the supplied Firestore rules.",
    );
  }

  throw new Error(
    errorBody?.error?.message || "The appointment could not be submitted. Please try again.",
  );
}
