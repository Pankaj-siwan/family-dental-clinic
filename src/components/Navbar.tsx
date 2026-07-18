import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  FaBars,
  FaCalendarCheck,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTimes,
} from "react-icons/fa";
import styles from "@/styles/Navbar.module.css";

const navItems = [
  ["Home", "#home"],
  ["Treatments", "#treatments"],
  ["Our Clinics", "#clinics"],
  ["Gallery", "#gallery"],
  ["Doctors", "#doctors"],
  ["Contact", "#contact"],
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <span>
            <FaMapMarkerAlt /> Serving Siwan, Andar and nearby areas
          </span>
          <a href="tel:+918618528975">
            <FaPhoneAlt /> +91 86185 28975
          </a>
        </div>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="#home" className={styles.brand} aria-label="Family Dental Clinic home">
          <span className={styles.logoWrap}>
            <Image
              src="/images/clinic-logo-new.png"
              alt="Family Dental Clinic and Implant Center logo"
              width={74}
              height={74}
              priority
            />
          </span>
          <span className={styles.brandText}>
            <strong>Family Dental Clinic</strong>
            <small>&amp; Implant Center</small>
            <em>Fulfilling your dental needs in and around Siwan</em>
          </span>
        </Link>

        <button
          className={styles.menuButton}
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`${styles.links} ${open ? styles.open : ""}`}>
          {navItems.map(([label, href]) => (
            <Link href={href} key={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}

          <Link
            href="#appointment"
            className={styles.bookButton}
            onClick={() => setOpen(false)}
          >
            <FaCalendarCheck /> Book Appointment
          </Link>
        </div>
      </nav>
    </header>
  );
}
