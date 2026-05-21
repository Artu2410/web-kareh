"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { getProviders, getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, User } from "lucide-react";

function getAuthErrorMessage(errorCode) {
  switch (errorCode) {
    case null:
    case "":
      return "";
    case "EMAIL_NOT_VERIFIED":
      return "Tu cuenta todavía no está validada. Revisa tu correo o solicita otro enlace.";
    case "VERIFICATION_LINK_INVALID":
      return "El enlace de validación ya no es válido. Solicita uno nuevo.";
    case "AccessDenied":
      return "No pudimos completar el acceso con la cuenta social.";
    case "OAuthAccountNotLinked":
      return "Ese correo ya existe con otro método de acceso.";
    case "Configuration":
      return "Google o Facebook todavía no están configurados correctamente.";
    case "CredentialsSignin":
      return "Correo o contraseña incorrectos.";
    default:
      return "No pudimos iniciar sesión en este momento.";
  }
}

function getQuerySuccessMessage(searchParams) {
  if (searchParams.get("verified") === "1") {
    return "Tu correo fue validado. Ya puedes iniciar sesión.";
  }

  if (searchParams.get("reset") === "success") {
    return "Tu contraseña fue actualizada. Inicia sesión con la nueva.";
  }

  return "";
}

function LoginContent() {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [availableProviders, setAvailableProviders] = useState({
    google: false,
    facebook: false,
  });
  const [dismissQueryMessages, setDismissQueryMessages] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryError = dismissQueryMessages
    ? ""
    : getAuthErrorMessage(searchParams.get("error"));
  const querySuccess = dismissQueryMessages
    ? ""
    : getQuerySuccessMessage(searchParams);
  const visibleError = error || queryError;
  const visibleSuccess = success || querySuccess;

  useEffect(() => {
    let ignore = false;

    getProviders().then((providers) => {
      if (ignore) {
        return;
      }

      setAvailableProviders({
        google: Boolean(providers?.google),
        facebook: Boolean(providers?.facebook),
      });
    });

    return () => {
      ignore = true;
    };
  }, []);

  const resetMessages = () => {
    setDismissQueryMessages(true);
    setError("");
    setSuccess("");
  };

  const redirectAfterLogin = async () => {
    const session = await getSession();
    router.push(session?.user?.role === "admin" ? "/admin" : "/");
    router.refresh();
  };

  const handleLogin = async () => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    if (result?.error) {
      setError(getAuthErrorMessage(result.error));
      return;
    }

    await redirectAfterLogin();
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error || "No pudimos registrar tu cuenta.");
      return;
    }

    setSuccess(
      data.message ||
        "Te enviamos un correo para validar tu cuenta antes de iniciar sesión."
    );
    setView("login");
    setPassword("");
    setConfirmPassword("");
  };

  const handleForgotPassword = async () => {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error || "No pudimos iniciar la recuperación.");
      return;
    }

    setSuccess(
      data.message ||
        "Si el correo existe, te enviamos instrucciones para continuar."
    );
    setView("login");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetMessages();

    try {
      if (view === "register") {
        await handleRegister();
      } else if (view === "forgot") {
        await handleForgotPassword();
      } else {
        await handleLogin();
      }
    } catch (submitError) {
      console.error(submitError);
      setError("No pudimos completar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider) => {
    resetMessages();
    signIn(provider.toLowerCase(), { callbackUrl: "/" });
  };

  const handleResendVerification = async () => {
    if (!email.trim()) {
      setError("Ingresa tu correo para reenviar la validación.");
      return;
    }

    setResendingVerification(true);
    resetMessages();

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "No pudimos reenviar la validación.");
        return;
      }

      setSuccess(
        data.message ||
          "Si el correo existe y sigue pendiente, te enviamos un nuevo enlace."
      );
    } catch (resendError) {
      console.error(resendError);
      setError("No pudimos reenviar la validación.");
    } finally {
      setResendingVerification(false);
    }
  };

  const title =
    view === "register"
      ? "Crear Cuenta"
      : view === "forgot"
        ? "Recuperar Contraseña"
        : "Iniciar Sesión";
  const subtitle =
    view === "register"
      ? "Tu usuario siempre será tu correo electrónico"
      : view === "forgot"
        ? "Te enviaremos un enlace temporal a tu correo"
        : "Ingresa con tu correo y contraseña";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        className="card animate-fade-in"
        style={{ maxWidth: "460px", width: "100%", padding: "2.5rem 2rem" }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link
            href="/"
            className="logo"
            style={{
              justifyContent: "center",
              marginBottom: "1rem",
              fontSize: "2rem",
              display: "flex",
            }}
          >
            <Image
              src="/images/logo.png"
              alt="KAREH Logo"
              width={48}
              height={48}
              priority
              style={{ height: "48px", width: "auto" }}
            />
            KAREH
          </Link>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{title}</h1>
          <p style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
        </div>

        {visibleError && (
          <div
            style={{
              backgroundColor: "rgba(248, 81, 73, 0.1)",
              color: "var(--danger-color)",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {visibleError}
          </div>
        )}

        {visibleSuccess && (
          <div
            style={{
              backgroundColor: "rgba(46, 160, 67, 0.1)",
              color: "var(--success-color)",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontSize: "0.9rem",
              textAlign: "center",
            }}
          >
            {visibleSuccess}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {view === "register" && (
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <div style={{ position: "relative" }}>
                <User
                  size={18}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  style={{ paddingLeft: "2.5rem" }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <div style={{ position: "relative" }}>
              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-secondary)",
                }}
              />
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: "2.5rem" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>

          {view !== "forgot" && (
            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                  }}
                />
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: "2.5rem" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres con letras y números"
                  required
                />
              </div>
            </div>
          )}

          {view === "register" && (
            <div className="form-group" style={{ marginBottom: "2rem" }}>
              <label className="form-label">Confirmar Contraseña</label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={18}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-secondary)",
                  }}
                />
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: "2.5rem" }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la contraseña"
                  required
                />
              </div>
            </div>
          )}

          {view === "login" && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1.5rem",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  resetMessages();
                  setView("forgot");
                }}
                style={{
                  color: "var(--accent-color)",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                }}
              >
                Olvidé mi contraseña
              </button>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: "1rem" }}
            disabled={loading}
          >
            {loading
              ? view === "register"
                ? "Enviando validación..."
                : view === "forgot"
                  ? "Enviando enlace..."
                  : "Ingresando..."
              : view === "register"
                ? "Registrarme"
                : view === "forgot"
                  ? "Enviar enlace"
                  : "Iniciar Sesión"}
          </button>
        </form>

        {view === "login" && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendingVerification}
              style={{
                color: "var(--accent-color)",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              {resendingVerification
                ? "Reenviando validación..."
                : "Reenviar correo de validación"}
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {view === "register" ? (
            <button
              type="button"
              onClick={() => {
                resetMessages();
                setView("login");
              }}
              style={{
                color: "var(--accent-color)",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              ¿Ya tienes cuenta? Inicia sesión
            </button>
          ) : view === "forgot" ? (
            <button
              type="button"
              onClick={() => {
                resetMessages();
                setView("login");
              }}
              style={{
                color: "var(--accent-color)",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              Volver al inicio de sesión
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                resetMessages();
                setView("register");
              }}
              style={{
                color: "var(--accent-color)",
                fontSize: "0.9rem",
                fontWeight: "600",
              }}
            >
              ¿No tienes cuenta? Regístrate gratis
            </button>
          )}
        </div>

        {view === "login" &&
          (availableProviders.google || availableProviders.facebook) && (
            <>
              <div
                style={{
                  position: "relative",
                  textAlign: "center",
                  margin: "2rem 0",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    right: 0,
                    height: "1px",
                    backgroundColor: "var(--border-color)",
                    zIndex: 0,
                  }}
                ></div>
                <span
                  style={{
                    position: "relative",
                    backgroundColor: "var(--secondary-color)",
                    padding: "0 1rem",
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    zIndex: 1,
                  }}
                >
                  O iniciar con
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                {availableProviders.google && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleOAuth("Google")}
                    style={{ gap: "0.5rem" }}
                  >
                    <Image
                      src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
                      alt="Google"
                      width={18}
                      height={18}
                    />
                    Google
                  </button>
                )}
                {availableProviders.facebook && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleOAuth("Facebook")}
                    style={{ gap: "0.5rem" }}
                  >
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
                      alt="Facebook"
                      width={18}
                      height={18}
                    />
                    Facebook
                  </button>
                )}
              </div>
            </>
          )}

        <div style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.9rem" }}>
          <Link
            href="/"
            style={{
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            <ArrowLeft size={16} /> Volver al catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
