import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, deleteCookie } from "@tanstack/react-start/server";

const AUTH_COOKIE_NAME = "gallery_auth_session";
const AUTH_SESSION_SECRET = "chintu_authenticated_secure_session_v1";

// Server-side password lookup — NEVER exposed to client JS bundle
function getSecretPassword(): string {
  return process.env.GALLERY_PASSWORD || process.env.VITE_GALLERY_PASSWORD || "chintu15";
}

/**
 * Server Function: Verifies user password exclusively on the server.
 * On success, sets a secure HTTP-Only cookie.
 */
export const verifyPasswordServerFn = createServerFn({ method: "POST" })
  .validator((data: { password?: string }) => data)
  .handler(async ({ data }) => {
    const input = data?.password ?? "";
    const secret = getSecretPassword();

    if (input === secret) {
      setCookie(AUTH_COOKIE_NAME, AUTH_SESSION_SECRET, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return { success: true };
    }

    return { success: false, error: "Incorrect password." };
  });

/**
 * Server Function: Checks if incoming HTTP request carries valid HTTP-Only auth cookie.
 */
export const checkAuthServerFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const token = getCookie(AUTH_COOKIE_NAME);
    return { authenticated: token === AUTH_SESSION_SECRET };
  });

/**
 * Server Function: Logs out user by clearing the HTTP-Only auth cookie.
 */
export const logoutServerFn = createServerFn({ method: "POST" })
  .handler(async () => {
    deleteCookie(AUTH_COOKIE_NAME, { path: "/" });
    return { success: true };
  });
