import { useState } from "react";
import { pdf, Document, Page, Text, View, Link, StyleSheet } from "@react-pdf/renderer";

// ── PDF Styles ────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a18",
    backgroundColor: "#ffffff",
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 48,
    paddingRight: 48,
  },
  // Header
  header: { marginBottom: 16 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  headline: { fontSize: 10, color: "#9a9a94", marginBottom: 6 },
  contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 8 },
  contactItem: { fontSize: 8, color: "#9a9a94", fontFamily: "Courier" },
  contactLink: { fontSize: 8, color: "#c8622a", fontFamily: "Courier" },
  summary: { fontSize: 9, lineHeight: 1.5, color: "#1a1a18" },
  // Section
  section: { marginBottom: 14 },
  sectionLabel: {
    fontSize: 7,
    fontFamily: "Courier",
    color: "#c8622a",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e2e0d8",
    paddingBottom: 3,
  },
  // Experience
  expHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  expCompany: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  expTitle: { fontSize: 9, fontFamily: "Helvetica", fontStyle: "italic", color: "#9a9a94" },
  expDates: { fontSize: 8, color: "#9a9a94", fontFamily: "Courier" },
  expLocation: { fontSize: 8, color: "#9a9a94", fontFamily: "Courier" },
  bullet: { flexDirection: "row", marginBottom: 3, paddingLeft: 8 },
  bulletDot: { width: 8, color: "#c8622a", fontSize: 9 },
  bulletText: { flex: 1, fontSize: 8.5, lineHeight: 1.45, color: "#1a1a18" },
  // Education
  eduRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 2 },
  eduInstitution: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  eduDegree: { fontSize: 8.5, color: "#9a9a94" },
  eduDates: { fontSize: 8, color: "#9a9a94", fontFamily: "Courier" },
  // Skills
  skillRow: { flexDirection: "row", marginBottom: 4 },
  skillCategory: { width: 100, fontSize: 8, fontFamily: "Helvetica-Bold", color: "#1a1a18" },
  skillItems: { flex: 1, fontSize: 8.5, color: "#1a1a18" },
  // Projects
  projectName: { fontSize: 9, fontFamily: "Helvetica-Bold", marginBottom: 1 },
  projectDesc: { fontSize: 8.5, lineHeight: 1.4, color: "#1a1a18", marginBottom: 2 },
  projectTech: { fontSize: 7.5, color: "#9a9a94", fontFamily: "Courier" },
  // Certifications
  certRow: { flexDirection: "row", justifyContent: "space-between" },
  certName: { fontSize: 8.5 },
  certMeta: { fontSize: 8, color: "#9a9a94", fontFamily: "Courier" },
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

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{meta.name}</Text>
          <Text style={styles.headline}>{meta.headline}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{meta.location}</Text>
            <Text style={styles.contactItem}>•</Text>
            <Text style={styles.contactItem}>{meta.phone}</Text>
            <Text style={styles.contactItem}>•</Text>
            <Link src={`mailto:${meta.email}`} style={styles.contactLink}>{meta.email}</Link>
            <Text style={styles.contactItem}>•</Text>
            <Link src={meta.linkedin} style={styles.contactLink}>linkedin.com/in/jaygovind-sahu</Link>
          </View>
          <Text style={styles.summary}>{meta.summary}</Text>
        </View>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Experience</Text>
          {experience.map((exp) => (
            <View key={exp.id} style={{ marginBottom: 10 }}>
              <View style={styles.expHeader}>
                <View>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  <Text style={styles.expTitle}>{exp.title} — {exp.location}</Text>
                </View>
                <Text style={styles.expDates}>
                  {formatDate(exp.start)} – {exp.current ? "Present" : formatDate(exp.end)}
                </Text>
              </View>
              {exp.bullets.map((b, i) => (
                <View key={i} style={styles.bullet}>
                  <Text style={styles.bulletDot}>–</Text>
                  <Text style={styles.bulletText}>{b.text}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Projects */}
        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Projects</Text>
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
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "'DM Mono', monospace",
        fontSize: "11px",
        letterSpacing: "0.05em",
        color: loading ? "#9a9a94" : "#c8622a",
        background: "transparent",
        border: "1px solid currentColor",
        borderRadius: "2px",
        padding: "6px 14px",
        cursor: loading ? "default" : "pointer",
        transition: "opacity 0.2s",
      }}
    >
      {loading ? "Generating…" : "↓ Download PDF"}
    </button>
  );
}
