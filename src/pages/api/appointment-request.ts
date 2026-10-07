import type { NextApiRequest, NextApiResponse } from "next";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getMessaging } from "firebase-admin/messaging";

type AppointmentRequest = {
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

function getClinicManagerApp() {
  const existing = getApps().find((app) => app.name === "clinic-manager-server");
  if (existing) return existing;

  const raw = process.env.CLINIC_MANAGER_FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("CLINIC_MANAGER_FIREBASE_SERVICE_ACCOUNT_JSON is not configured.");
  const serviceAccount = JSON.parse(raw);

  return initializeApp(
    {
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id || "clinic-manager-drpan",
    },
    "clinic-manager-server",
  );
}

function toClinicManagerDate(isoDate: string) {
  const parts = isoDate.split("-");
  if (parts.length !== 3) throw new Error("Invalid appointment date.");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function makeAppointmentId(data: AppointmentRequest) {
  const mobileDigits = data.mobile.replace(/\D/g, "").slice(-10);
  return [data.clinicId, data.appointmentDate, data.appointmentTime, mobileDigits]
    .join("-")
    .replace(/[^a-zA-Z0-9_-]/g, "");
}

function isBlocking(row: FirebaseFirestore.DocumentData) {
  const status = String(row.status ?? "").trim().toLowerCase();
  const openStatus = String(row.appointmentOpenStatus ?? "").trim().toLowerCase();
  const completed = row.appointmentCompleted === true || status === "completed" || openStatus === "completed";
  const cancelled =
    ["cancelled", "canceled", "rejected", "deleted"].includes(status) ||
    ["cancelled", "canceled", "rejected", "closed"].includes(openStatus);
  return !completed && !cancelled;
}

async function sendDoctorPush(db: FirebaseFirestore.Firestore, appointmentId: string, data: AppointmentRequest) {
  const devices = await db.collection("clinicManagerDevices")
    .where("websiteAppointmentAlerts", "==", true)
    .get();

  const tokens = [...new Set(devices.docs.map((d) => String(d.get("token") ?? "")).filter(Boolean))];
  if (!tokens.length) return { sent: 0, failed: 0 };

  const result = await getMessaging(getClinicManagerApp()).sendEachForMulticast({
    tokens,
    data: {
      type: "website_appointment",
      appointmentId,
      patientName: data.patientName,
      clinicName: data.clinicName,
      appointmentDate: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      title: "New website appointment",
      body: `${data.patientName} is asking for an appointment. Please confirm.`,
    },
    android: {
      // Data-only + HIGH priority: Android delivers this to the app's
      // FirebaseMessagingService instead of consuming it as a system
      // notification while the app is backgrounded/terminated.
      priority: "high",
      ttl: 60 * 60 * 1000,
    },
  });

  // Remove invalid tokens so future sends stay clean.
  const invalid: string[] = [];
  result.responses.forEach((r, i) => {
    const code = r.error?.code ?? "";
    if (
      code.includes("registration-token-not-registered") ||
      code.includes("invalid-registration-token")
    ) invalid.push(tokens[i]);
  });
  await Promise.all(invalid.map((token) => db.collection("clinicManagerDevices").doc(token).delete().catch(() => null)));

  return { sent: result.successCount, failed: result.failureCount };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const data = req.body as AppointmentRequest;
    const required = ["patientName", "mobile", "gender", "clinicId", "clinicName", "appointmentDate", "appointmentTime"];
    for (const key of required) {
      if (!String((data as any)?.[key] ?? "").trim()) {
        return res.status(400).json({ error: `Missing ${key}.` });
      }
    }

    const app = getClinicManagerApp();
    const db = getFirestore(app);
    const appointmentId = makeAppointmentId(data);
    const clinicManagerDate = toClinicManagerDate(data.appointmentDate);

    // Recheck the requested slot on the server immediately before creation.
    const sameSlot = await db.collection("appointments")
      .where("clinicName", "==", data.clinicName)
      .where("appointmentDate", "==", clinicManagerDate)
      .where("appointmentTime", "==", data.appointmentTime)
      .get();

    if (sameSlot.docs.some((d) => isBlocking(d.data()))) {
      return res.status(409).json({ error: "This appointment time has just been taken. Please choose another available slot." });
    }

    const ref = db.collection("appointments").doc(appointmentId);
    if ((await ref.get()).exists) {
      return res.status(409).json({ error: "An appointment request already exists for this patient, clinic, date, and time." });
    }

    await ref.create({
      patientName: data.patientName,
      patientMobile: data.mobile,
      mobile: data.mobile,
      age: data.age ?? null,
      gender: data.gender,
      clinicId: data.clinicId,
      clinicName: data.clinicName,
      clinicDisplayName: data.clinicDisplayName ?? data.clinicName,
      appointmentDate: clinicManagerDate,
      appointmentDateIso: data.appointmentDate,
      appointmentTime: data.appointmentTime,
      reason: data.chiefComplaint ?? "",
      chiefComplaint: data.chiefComplaint ?? "",
      doctorName: data.clinicName.includes("Anita") ? "Dr. Anita Kumari" : "Dr. Pankaj",
      appointmentType: "Website appointment request",
      source: "website",
      status: "awaiting_confirmation",
      appointmentOpenStatus: "Pending confirmation",
      appointmentCompleted: false,
      appointmentClosed: false,
      doctorConfirmationRequired: true,
      notificationPending: true,
      notificationMessage: "A patient is trying to obtain the appointment",
      createdAt: FieldValue.serverTimestamp(),
    });

    // Appointment must remain saved even if push temporarily fails.
    let push = { sent: 0, failed: 0 };
    try {
      push = await sendDoctorPush(db, appointmentId, data);
    } catch (error) {
      console.error("Appointment saved but doctor FCM push failed:", error);
    }

    return res.status(201).json({ appointmentId, push });
  } catch (error) {
    console.error("Website appointment API failed:", error);
    return res.status(500).json({ error: "Unable to submit the appointment right now. Please try again." });
  }
}
