import { FormEvent, useMemo, useState } from "react";
import {
  FaCalendarCheck,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaPhoneAlt,
  FaTooth,
} from "react-icons/fa";
import { createWebsiteAppointment } from "@/lib/firebaseAppointments";
import styles from "@/styles/Appointment.module.css";

const clinics = [
  { id: "family-dental-siwan", name: "Family Dental Clinic & Implant Center, Siwan" },
  { id: "family-dental-andar", name: "Family Dental Clinic & Implant Center, Andar" },
  { id: "dr-anita-dental-siwan", name: "Dr. Anita Dental Clinic & Implant Center, Siwan" },
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM",
];

const initialForm = {
  patientName: "",
  mobile: "",
  age: "",
  gender: "",
  clinicId: clinics[0].id,
  appointmentDate: "",
  appointmentTime: "",
  chiefComplaint: "",
};

export default function Appointment() {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const minimumDate = useMemo(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString().split("T")[0];
  }, []);

  const selectedClinic = clinics.find((clinic) => clinic.id === form.clinicId) ?? clinics[0];

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
    if (message) setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const mobileDigits = form.mobile.replace(/\D/g, "");
    if (mobileDigits.length !== 10) {
      setMessage({ type: "error", text: "Please enter a valid 10-digit mobile number." });
      return;
    }

    setSubmitting(true);
    try {
      await createWebsiteAppointment({
        patientName: form.patientName.trim(),
        mobile: mobileDigits,
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        clinicId: selectedClinic.id,
        clinicName: selectedClinic.name,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        chiefComplaint: form.chiefComplaint.trim(),
      });

      setMessage({
        type: "success",
        text: "Your appointment request has been received. The clinic will contact you to confirm the slot.",
      });
      setForm(initialForm);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Unable to submit the appointment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.section} id="appointment">
      <div className={styles.heading}>
        <span className={styles.eyebrow}><FaCalendarCheck aria-hidden="true" />Online Appointment</span>
        <h2>Book your visit in <span>less than a minute</span></h2>
        <p>Submit your preferred clinic, date, and time. Your request will be saved for ClinicOS Dental and confirmed by the clinic.</p>
      </div>

      <div className={styles.container}>
        <div className={styles.infoPanel}>
          <div className={styles.infoIcon}><FaTooth aria-hidden="true" /></div>
          <h3>What happens next?</h3>
          <p>The booking enters the shared appointment database with a pending status. The selected clinic can then confirm or reschedule it.</p>

          <div className={styles.steps}>
            <div><span>1</span><p>Complete the appointment form.</p></div>
            <div><span>2</span><p>The clinic reviews your requested slot.</p></div>
            <div><span>3</span><p>You receive confirmation by call or WhatsApp.</p></div>
          </div>

          <div className={styles.quickContact}>
            <FaPhoneAlt aria-hidden="true" />
            <div><span>Need urgent assistance?</span><a href="tel:+918618528975">Call +91 86185 28975</a></div>
          </div>
        </div>

        <form className={styles.formCard} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.fullWidth}>
              <span>Patient name</span>
              <input type="text" value={form.patientName} onChange={(e) => updateField("patientName", e.target.value)} placeholder="Enter full name" autoComplete="name" required />
            </label>

            <label>
              <span>Mobile number</span>
              <input type="tel" value={form.mobile} onChange={(e) => updateField("mobile", e.target.value)} placeholder="10-digit mobile number" inputMode="numeric" autoComplete="tel" maxLength={10} required />
            </label>

            <label>
              <span>Age</span>
              <input type="number" value={form.age} onChange={(e) => updateField("age", e.target.value)} placeholder="Age" min="1" max="120" />
            </label>

            <label>
              <span>Gender</span>
              <select value={form.gender} onChange={(e) => updateField("gender", e.target.value)} required>
                <option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </label>

            <label>
              <span>Preferred clinic</span>
              <select value={form.clinicId} onChange={(e) => updateField("clinicId", e.target.value)} required>
                {clinics.map((clinic) => <option value={clinic.id} key={clinic.id}>{clinic.name}</option>)}
              </select>
            </label>

            <label>
              <span>Preferred date</span>
              <input type="date" value={form.appointmentDate} onChange={(e) => updateField("appointmentDate", e.target.value)} min={minimumDate} required />
            </label>

            <label>
              <span>Preferred time</span>
              <select value={form.appointmentTime} onChange={(e) => updateField("appointmentTime", e.target.value)} required>
                <option value="">Choose a time</option>{timeSlots.map((time) => <option value={time} key={time}>{time}</option>)}
              </select>
            </label>

            <label className={styles.fullWidth}>
              <span>Chief complaint</span>
              <textarea value={form.chiefComplaint} onChange={(e) => updateField("chiefComplaint", e.target.value)} placeholder="Briefly describe the dental problem" rows={4} required />
            </label>
          </div>

          {message && (
            <div className={`${styles.message} ${message.type === "success" ? styles.success : styles.error}`} role="status">
              {message.type === "success" ? <FaCheckCircle aria-hidden="true" /> : <FaExclamationCircle aria-hidden="true" />}
              <span>{message.text}</span>
            </div>
          )}

          <button className={styles.submitButton} type="submit" disabled={submitting}>
            <FaCalendarCheck aria-hidden="true" />{submitting ? "Submitting..." : "Request Appointment"}
          </button>

          <small className={styles.disclaimer}><FaClock aria-hidden="true" /> The requested time is confirmed only after the clinic contacts you.</small>
        </form>
      </div>
    </section>
  );
}
