import Head from "next/head";
import { FormEvent, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  FaLock,
  FaRightFromBracket,
  FaShieldHalved,
  FaTooth,
} from "react-icons/fa6";

import { auth } from "@/lib/firebase";



export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });

    return unsubscribe;
  }, []);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();

  const cleanEmail = email.trim();

  if (!cleanEmail || !password) {
    setError("Please enter your email address and password.");
    return;
  }

  setLoggingIn(true);
  setError("");

  try {
    await signInWithEmailAndPassword(auth, cleanEmail, password);
    setPassword("");
} catch (err: unknown) {
  console.error("🔥 Firebase Login Error:", err);

  const errorCode =
    typeof err === "object" &&
    err !== null &&
    "code" in err
      ? String(err.code)
      : "unknown-error";

  const errorMessage =
    typeof err === "object" &&
    err !== null &&
    "message" in err
      ? String(err.message)
      : "Unknown Firebase error";

  setError(
    `Error Code: ${errorCode}\nMessage: ${errorMessage}`
  );
} finally {
  setLoggingIn(false);
}
}

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await signOut(auth);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <Head>
        <title>Clinic Admin | Family Dental Clinic</title>
        <meta
          name="robots"
          content="noindex, nofollow, noarchive"
        />
      </Head>

      <main className="adminPage">
        <div className="backgroundShape shapeOne" />
        <div className="backgroundShape shapeTwo" />

        {checkingAuth ? (
          <section className="statusCard">
            <div className="spinner" />
            <h1>Checking secure access</h1>
            <p>Please wait for a moment.</p>
          </section>
        ) : user ? (
          <section className="dashboardCard">
            <div className="dashboardHeader">
              <div>
                <span className="eyebrow">
                  <FaShieldHalved />
                  Secure administration
                </span>

                <h1>Welcome to the Clinic Admin</h1>

                <p>
                  You are signed in as{" "}
                  <strong>{user.email || "Administrator"}</strong>.
                </p>
              </div>

              <button
                type="button"
                className="logoutButton"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <FaRightFromBracket />
                {loggingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>

            <div className="dashboardContent">
              <div className="dashboardIcon">
                <FaTooth />
              </div>

              <h2>Admin login is working</h2>

              <p>
                Your secure login has been connected successfully.
                The clinical-case dashboard and Cloudinary uploader
                will be added here next.
              </p>

              <div className="statusBadge">
                Firebase Authentication connected
              </div>
            </div>
          </section>
        ) : (
          <section className="loginCard">
            <div className="brandArea">
              <div className="toothIcon">
                <FaTooth />
              </div>

              <span className="eyebrow">
                <FaShieldHalved />
                Private administrator access
              </span>

              <h1>Family Dental Clinic</h1>
              <h2>Clinical Case Administration</h2>

              <p>
                Sign in using the administrator account created in
                Firebase Authentication.
              </p>
            </div>

            <form className="loginForm" onSubmit={handleLogin}>
              <label>
                Email address
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your admin email"
                  disabled={loggingIn}
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  disabled={loggingIn}
                />
              </label>

              {error && (
                <div className="errorMessage" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="loginButton"
                disabled={loggingIn}
              >
                <FaLock />
                {loggingIn ? "Signing in..." : "Secure sign in"}
              </button>

              <p className="securityNote">
                This page is intended only for the authorised clinic
                administrator.
              </p>
            </form>
          </section>
        )}
      </main>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .adminPage {
          position: relative;
          display: grid;
          min-height: 100vh;
          place-items: center;
          overflow: hidden;
          padding: 28px;
          background:
            radial-gradient(
              circle at top left,
              rgba(13, 148, 136, 0.18),
              transparent 34%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(8, 145, 178, 0.16),
              transparent 32%
            ),
            linear-gradient(145deg, #f5fbfb, #eef7fa);
          font-family:
            Inter, Arial, Helvetica, sans-serif;
        }

        .backgroundShape {
          position: absolute;
          border-radius: 999px;
          filter: blur(1px);
          pointer-events: none;
        }

        .shapeOne {
          top: -130px;
          left: -90px;
          width: 360px;
          height: 360px;
          background: rgba(15, 118, 110, 0.09);
        }

        .shapeTwo {
          right: -100px;
          bottom: -120px;
          width: 400px;
          height: 400px;
          background: rgba(8, 145, 178, 0.09);
        }

        .loginCard,
        .dashboardCard,
        .statusCard {
          position: relative;
          z-index: 2;
          width: min(940px, 100%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 28px 80px rgba(15, 42, 67, 0.14);
        }

        .loginCard {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          overflow: hidden;
        }

        .brandArea {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 54px;
          color: white;
          background:
            linear-gradient(
              145deg,
              rgba(15, 118, 110, 0.96),
              rgba(8, 145, 178, 0.92)
            );
        }

        .toothIcon,
        .dashboardIcon {
          display: grid;
          width: 72px;
          height: 72px;
          place-items: center;
          margin-bottom: 25px;
          border-radius: 22px;
          font-size: 2rem;
        }

        .toothIcon {
          color: #0f766e;
          background: white;
          box-shadow: 0 18px 38px rgba(0, 0, 0, 0.15);
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          width: fit-content;
          margin-bottom: 15px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .brandArea .eyebrow {
          padding: 8px 12px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
        }

        .brandArea h1 {
          margin: 0;
          font-size: clamp(2rem, 4vw, 3.2rem);
          line-height: 1.05;
        }

        .brandArea h2 {
          margin: 13px 0 18px;
          font-size: 1.15rem;
          font-weight: 700;
          opacity: 0.92;
        }

        .brandArea p {
          max-width: 430px;
          margin: 0;
          line-height: 1.75;
          opacity: 0.87;
        }

        .loginForm {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 18px;
          padding: 54px 46px;
        }

        .loginForm label {
          display: grid;
          gap: 8px;
          color: #264653;
          font-size: 0.86rem;
          font-weight: 800;
        }

        .loginForm input {
          width: 100%;
          min-height: 50px;
          border: 1px solid #ccdce0;
          border-radius: 13px;
          outline: none;
          padding: 0 15px;
          color: #163748;
          background: #fbfefe;
          font-size: 0.96rem;
          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .loginForm input:focus {
          border-color: #0f766e;
          box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.11);
        }

        .loginButton,
        .logoutButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          cursor: pointer;
          font-weight: 900;
          transition:
            transform 0.18s ease,
            opacity 0.18s ease;
        }

        .loginButton {
          min-height: 52px;
          margin-top: 5px;
          border-radius: 14px;
          color: white;
          background: linear-gradient(135deg, #0f766e, #0891b2);
          box-shadow: 0 15px 28px rgba(15, 118, 110, 0.2);
        }

        .loginButton:hover:not(:disabled),
        .logoutButton:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        .loginButton:disabled,
        .logoutButton:disabled {
          cursor: not-allowed;
          opacity: 0.65;
        }

        .errorMessage {
          padding: 12px 14px;
          border: 1px solid #fecdd3;
          border-radius: 12px;
          color: #be123c;
          background: #fff1f2;
          font-size: 0.83rem;
          line-height: 1.5;
          white-space: pre-line;
        }

        .securityNote {
          margin: 4px 0 0;
          color: #718793;
          font-size: 0.72rem;
          line-height: 1.6;
          text-align: center;
        }

        .statusCard {
          max-width: 470px;
          padding: 50px 30px;
          text-align: center;
        }

        .spinner {
          width: 48px;
          height: 48px;
          margin: 0 auto 22px;
          border: 4px solid #d8eeeb;
          border-top-color: #0f766e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .statusCard h1,
        .dashboardCard h1,
        .dashboardCard h2 {
          color: #123649;
        }

        .statusCard p {
          color: #718793;
        }

        .dashboardCard {
          padding: 38px;
        }

        .dashboardHeader {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 28px;
          border-bottom: 1px solid #e1ebee;
        }

        .dashboardHeader .eyebrow {
          color: #0f766e;
        }

        .dashboardHeader h1 {
          margin: 0 0 10px;
          font-size: clamp(1.8rem, 4vw, 2.7rem);
        }

        .dashboardHeader p {
          margin: 0;
          color: #637c88;
        }

        .logoutButton {
          flex-shrink: 0;
          min-height: 44px;
          padding: 0 16px;
          border: 1px solid #fecdd3;
          border-radius: 12px;
          color: #be123c;
          background: #fff1f2;
        }

        .dashboardContent {
          display: grid;
          place-items: center;
          min-height: 350px;
          padding: 44px 20px;
          text-align: center;
        }

        .dashboardIcon {
          margin-bottom: 20px;
          color: white;
          background: linear-gradient(135deg, #0f766e, #0891b2);
        }

        .dashboardContent h2 {
          margin: 0 0 12px;
          font-size: 1.7rem;
        }

        .dashboardContent p {
          max-width: 590px;
          margin: 0;
          color: #647b87;
          line-height: 1.75;
        }

        .statusBadge {
          margin-top: 24px;
          padding: 9px 14px;
          border-radius: 999px;
          color: #0f766e;
          background: #e8f8f5;
          font-size: 0.75rem;
          font-weight: 900;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 760px) {
          .adminPage {
            padding: 18px;
          }

          .loginCard {
            grid-template-columns: 1fr;
          }

          .brandArea {
            padding: 36px 28px;
          }

          .loginForm {
            padding: 34px 26px;
          }

          .dashboardCard {
            padding: 25px 20px;
          }

          .dashboardHeader {
            flex-direction: column;
          }

          .logoutButton {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}