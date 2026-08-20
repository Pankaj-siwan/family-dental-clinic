import { FaExternalLinkAlt, FaYoutube } from "react-icons/fa";
import styles from "@/styles/DoctorVideos.module.css";

const doctors = [
  {
    name: "Dr. Pankaj",
    role: "MDS · Oral Medicine & Maxillofacial Radiology",
    description:
      "Practical guidance on dental health, diagnosis, prevention and modern treatment options.",
    channelUrl: "https://www.youtube.com/@familydentalclinicsiwan",
    uploadsPlaylistId: "UUkLt6fDcwJIlK8I2k8aKLqQ",
  },
  {
    name: "Dr. Anita",
    role: "BDS · Dental Surgeon",
    description:
      "Simple, reliable dental-care advice for healthier smiles and confident family care.",
    channelUrl: "https://www.youtube.com/@AnitaKumari-1988",
    uploadsPlaylistId: "UUsxsonS_6WkvUG3dYPL5IPQ",
  },
] as const;

export default function DoctorVideos() {
  return (
    <section className={styles.section} id="dental-videos">
      <div className={styles.container}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            <FaYoutube aria-hidden="true" /> Dental education
          </span>
          <h2>Dental Videos by Our Doctors</h2>
          <p>
            Trusted dental guidance from Dr. Pankaj and Dr. Anita—watch their
            latest videos directly from their independent YouTube channels.
          </p>
        </div>

        <div className={styles.grid}>
          {doctors.map((doctor) => (
            <article className={styles.card} key={doctor.name}>
              <div className={styles.videoFrame}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/videoseries?list=${doctor.uploadsPlaylistId}&rel=0`}
                  title={`${doctor.name}'s latest dental videos`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>

              <div className={styles.content}>
                <div>
                  <h3>{doctor.name}</h3>
                  <span className={styles.role}>{doctor.role}</span>
                </div>
                <p>{doctor.description}</p>
                <a
                  className={styles.channelLink}
                  href={doctor.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${doctor.name}'s YouTube channel`}
                >
                  <FaYoutube aria-hidden="true" />
                  View YouTube Channel
                  <FaExternalLinkAlt
                    className={styles.externalIcon}
                    aria-hidden="true"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.updateNote}>
          New public videos appear here automatically after they are published
          on the respective doctor&apos;s channel.
        </p>
      </div>
    </section>
  );
}
