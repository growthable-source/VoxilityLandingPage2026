import { ImageResponse } from "next/og";

// Site-wide social-share image (og:image / twitter:image). File-based metadata
// cascades to every route below the root segment, so each page gets this
// unless it ships its own opengraph-image file.
export const alt = "Xovera — Booked appointments, end-to-end.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#070708",
          backgroundImage:
            "radial-gradient(720px 480px at 88% -10%, rgba(246, 88, 61, 0.28), transparent 70%), radial-gradient(640px 460px at 0% 110%, rgba(255, 122, 61, 0.18), transparent 70%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              backgroundImage:
                "linear-gradient(135deg, #f6583d 0%, #ff7a3d 100%)",
            }}
          />
          <div
            style={{
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "#ffffff",
            }}
          >
            Xovera
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: "#ffffff",
            }}
          >
            Booked appointments,
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: "#f6583d",
            }}
          >
            end-to-end.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              lineHeight: 1.4,
              color: "rgba(255, 255, 255, 0.72)",
              maxWidth: 900,
            }}
          >
            Meta ads, landing pages, and an AI receptionist on one accountable
            system — from ad click to booked appointment.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.55)",
            }}
          >
            www.xovera.io
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 22,
              color: "rgba(255, 255, 255, 0.55)",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                backgroundColor: "#4ade80",
              }}
            />
            Answering 24/7 · 30+ languages
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
