import { useState } from "react";
import { pdf, Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";

// ── Palette ───────────────────────────────────────────────────────────────────

const MUTED = "#5c5c58";
const ACCENT = "#c8622a";
const INK = "#1a1a18";
const RULE = "#e2e0d8";

// ── PDF Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: INK,
    backgroundColor: "#ffffff",
    paddingTop: 40,
    paddingBottom: 36,
    paddingLeft: 48,
    paddingRight: 48,
  },
  // Header — two-column: name+headline left, contacts right
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  name: { fontSize: 22, fontFamily: "Helvetica-Bold", marginBottom: 7 },
  headline: { fontSize: 10, color: MUTED },
  contactBlock: { alignItems: "flex-end", gap: 3 },
  contactItem: { fontSize: 8, color: MUTED, fontFamily: "Courier" },
  contactLink: { fontSize: 8, color: ACCENT, fontFamily: "Courier" },
  // Section
  section: { marginBottom: 14 },
  sectionLabel: {
    fontSize: 9,
    fontFamily: "Courier",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: RULE,
    paddingBottom: 3,
  },
  // Summary
  summary: { fontSize: 9, lineHeight: 1.55, color: INK },
  // Experience
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  expCompany: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  expTitle: { fontSize: 9, fontFamily: "Helvetica", color: MUTED },
  expDates: { fontSize: 8, color: MUTED, fontFamily: "Courier" },
  bullet: { flexDirection: "row", marginBottom: 3, paddingLeft: 8 },
  bulletDot: { width: 8, color: ACCENT, fontSize: 9 },
  bulletText: { flex: 1, fontSize: 8.5, lineHeight: 1.5, color: INK },
  // Education
  eduRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  eduInstitution: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  eduDegree: { fontSize: 8.5, color: MUTED },
  eduDates: { fontSize: 8, color: MUTED, fontFamily: "Courier" },
  // Skills
  skillRow: { flexDirection: "row", marginBottom: 4 },
  skillCategory: { width: 100, fontSize: 8, fontFamily: "Helvetica-Bold", color: INK },
  skillItems: { flex: 1, fontSize: 8.5, color: INK },
  // Projects
  projectName: { fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 1 },
  projectDesc: { fontSize: 8.5, lineHeight: 1.45, color: INK, marginBottom: 2 },
  projectTech: { fontSize: 7.5, color: MUTED, fontFamily: "Courier" },
  // Certifications
  certRow: { flexDirection: "row", justifyContent: "space-between" },
  certName: { fontSize: 8.5 },
  certMeta: { fontSize: 8, color: MUTED, fontFamily: "Courier" },
});

// ── PDF Document ──────────────────────────────────────────────────────────────

function formatDate(str) {
  if (!str) return "Present";
  const [year, month] = str.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return month ? `${months[parseInt(month) - 1]} ${year}` : year;
}

function ResumePDFDoc({ resume }) {
  const { meta, experience, education, skills, projects, certifications } = resume;

  return (
    <Document title={`${meta.name} — Resume`} author={meta.name}>
      <Page size="A4" style={styles.page}>

        {/* Header — two-column */}
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>{meta.name}</Text>
            <Text style={styles.headline}>{meta.headline}</Text>
          </View>
          <View style={styles.contactBlock}>
            <Link src={`tel:${meta.phone}`} style={styles.contactLink}>{meta.phone}</Link>
            <Link src={`mailto:${meta.email}`} style={styles.contactLink}>{meta.email}</Link>
            <Link src={meta.linkedin} style={styles.contactLink}>linkedin.com/in/jaygovind-sahu</Link>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Summary</Text>
          <Text style={styles.summary}>{meta.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Experience</Text>
          {experience.map((exp) => (
            <View key={exp.id} style={{ marginBottom: 10 }}>
              <View style={styles.expHeader}>
                <Text>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  <Text style={styles.expTitle}> — {exp.title}</Text>
                </Text>
                <Text style={styles.expDates}>
                  {formatDate(exp.start)} – {exp.current ? "Present" : formatDate(exp.end)}
                </Text>
              </View>
              <View style={{ marginTop: 5 }}>
                {exp.bullets.map((b, i) => (
                  <View key={i} style={styles.bullet}>
                    <Text style={styles.bulletDot}>–</Text>
                    <Text style={styles.bulletText}>{b.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Side Projects</Text>
            {projects.map((proj) => (
              <View key={proj.id} style={{ marginBottom: 8 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 1 }}>
                  <Text style={styles.projectName}>{proj.name}</Text>
                  {proj.url ? (
                    <Link src={proj.url} style={styles.contactLink}>{proj.url}</Link>
                  ) : null}
                </View>
                <Text style={styles.projectDesc}>{proj.description}</Text>
                <Text style={styles.projectTech}>{proj.tech.join(" · ")}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Skills</Text>
          {skills.map((s) => (
            <View key={s.id} style={styles.skillRow}>
              <Text style={styles.skillCategory}>{s.category}</Text>
              <Text style={styles.skillItems}>{s.items.join(", ")}</Text>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Education</Text>
          {education.map((edu) => (
            <View key={edu.id} style={{ marginBottom: 4 }}>
              <View style={styles.eduRow}>
                <Text style={styles.eduInstitution}>{edu.institution}</Text>
                <Text style={styles.eduDates}>{edu.end}</Text>
              </View>
              <Text style={styles.eduDegree}>
                {edu.degree} in {edu.field}{edu.notes ? ` — ${edu.notes}` : ""}
              </Text>
            </View>
          ))}
        </View>

        {/* Certifications */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={styles.certRow}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certMeta}>{cert.issuer} · {formatDate(cert.date)}</Text>
              </View>
            ))}
          </View>
        )}

      </Page>
    </Document>
  );
}

// ── Download Button Component ─────────────────────────────────────────────────

export default function DownloadButton({ resume }) {
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const blob = await pdf(<ResumePDFDoc resume={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Jaygovind_Sahu_Resume.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "'DM Mono', monospace",
        fontSize: "11px",
        letterSpacing: "0.05em",
        color: loading ? "#9a9a94" : hovered ? "#f7f6f2" : "#c8622a",
        background: loading ? "transparent" : hovered ? "#c8622a" : "transparent",
        border: `1px solid ${loading ? "#9a9a94" : "#c8622a"}`,
        borderRadius: "2px",
        padding: "6px 14px",
        cursor: loading ? "default" : "pointer",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {loading ? "Generating…" : "↓ Download PDF"}
    </button>
  );
}
