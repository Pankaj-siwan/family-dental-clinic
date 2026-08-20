import Image from "next/image";
import { FaExternalLinkAlt, FaYoutube } from "react-icons/fa";
import styles from "@/styles/DoctorVideos.module.css";
import { useLatestYouTubeVideo } from "@/lib/useLatestYouTubeVideo";

const doctors = [
  {
    name: "Dr. Pankaj",
    image: "/images/dr-pankaj-official.png",
    channelId: "UCkLt6fDcwJIlK8I2k8aKLqQ",
    role: "MDS · Oral Medicine & Maxillofacial Radiology",
    description:
      "Practical guidance on dental health, diagnosis, prevention and modern treatment options.",
    channelUrl: "https://www.youtube.com/@familydentalclinicsiwan",
    uploadsPlaylistId: "UUkLt6fDcwJIlK8I2k8aKLqQ",
  },
  {
    name: "Dr. Anita",
    image: "/images/dr-anita-official.jpg",
    channelId: "UCsxsonS_6WkvUG3dYPL5IPQ",
    role: "BDS · Dental Surgeon",
    description:
      "Simple, reliable dental-care advice for healthier smiles and confident family care.",
    channelUrl: "https://www.youtube.com/@AnitaKumari-1988",
    uploadsPlaylistId: "UUsxsonS_6WkvUG3dYPL5IPQ",
  },
] as const;

type Doctor = (typeof doctors)[number];

function DoctorVideoCard({ doctor }: { doctor: Doctor }) {
  const { video, loading } = useLatestYouTubeVideo(doctor.channelId);

  return (
    <article className={styles.card}>
      <div className={styles.videoFrame}>
        {video ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className={styles.videoFallback}>
            <Image src={doctor.image} alt="" fill sizes="(max-width: 820px) 92vw, 560px" />
            <div className={styles.fallbackOverlay} />
            <div className={styles.fallbackContent}>
              <FaYoutube aria-hidden="true" />
              <strong>{loading ? "Loading latest video" : "Videos coming soon"}</strong>
              <span>
                {loading
                  ? "Please wait a moment"
                  : `Follow ${doctor.name} on YouTube`}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.doctorHeading}>
          <Image src={doctor.image} alt={doctor.name} width={54} height={54} />
          <div>
            <h3>{doctor.name}</h3>
            <span className={styles.role}>{doctor.role}</span>
          </div>
        </div>
        <p>{video?.title ?? doctor.description}</p>
        <a
          className={styles.channelLink}
          href={doctor.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${doctor.name}'s YouTube channel`}
        >
          <FaYoutube aria-hidden="true" />
          View YouTube Channel
          <FaExternalLinkAlt className={styles.externalIcon} aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

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
            <DoctorVideoCard doctor={doctor} key={doctor.name} />
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
