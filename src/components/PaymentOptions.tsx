import {
  FaCreditCard,
  FaFileInvoice,
  FaMoneyBillWave,
  FaMobileAlt,
  FaQrcode,
} from "react-icons/fa";
import styles from "@/styles/PaymentOptions.module.css";

const methods = [
  { title: "UPI Payment", icon: FaMobileAlt },
  { title: "QR Payment", icon: FaQrcode },
  { title: "Cash Payment", icon: FaMoneyBillWave },
  { title: "Card Payment", icon: FaCreditCard },
  { title: "Clear Billing", icon: FaFileInvoice },
];

export default function PaymentOptions() {
  return (
    <section className={styles.section} id="payments">
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>
            <FaCreditCard />
            Convenient Payments
          </span>

          <h2>
            Simple payment options with
            <span> transparent billing</span>
          </h2>

          <p>
            Treatment charges can be discussed before the procedure, and
            available payment methods can be confirmed directly with the clinic.
          </p>
        </div>

        <div className={styles.methods}>
          {methods.map((method) => {
            const Icon = method.icon;

            return (
              <article key={method.title}>
                <Icon />
                <span>{method.title}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
