import Image from "next/image";
import Link from "next/link";
import { FaBars, FaCalendarCheck, FaPhoneAlt, FaTimes } from "react-icons/fa";
import { useState } from "react";
import styles from "@/styles/Navbar.module.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand} aria-label="Family Dental Clinic home">
          <Image src="/images/clinic-logo.svg" alt="Family Dental Clinic logo" width={62} height={62} priority />
          <span>
            Family Dental Clinic
            <small>&amp; Implant Center</small>
          </span>
        </Link>

        <button className={styles.menuButton} onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`${styles.links} ${open ? styles.open : ""}`}>
          <Link href="#home" onClick={() => setOpen(false)}>Home</Link>
          <Link href="#clinics" onClick={() => setOpen(false)}>Clinics</Link>
          <Link href="#cases" onClick={() => setOpen(false)}>Cases</Link>
          <Link href="#appointment" onClick={() => setOpen(false)}>Appointment</Link>
          <a href="tel:+918618528975"><FaPhoneAlt /> Call</a>
          <Link href="#appointment" className={styles.bookButton} onClick={() => setOpen(false)}>
            <FaCalendarCheck /> Book Appointment
          </Link>
        </div>
      </nav>
    </header>
  );
}
