import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.GITHUB_BRANCH || "main",
  clientId: process.env.TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "resume",
        label: "Resume",
        path: "src/data",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        match: {
          include: "resume",
        },
        fields: [
          // ── META ──────────────────────────────────────────────
          {
            type: "object",
            name: "meta",
            label: "Meta / Contact",
            fields: [
              { type: "string", name: "name", label: "Full Name" },
              { type: "string", name: "headline", label: "Headline" },
              { type: "string", name: "location", label: "Location" },
              { type: "string", name: "email", label: "Email" },
              { type: "string", name: "phone", label: "Phone" },
              { type: "string", name: "website", label: "Website" },
              { type: "string", name: "linkedin", label: "LinkedIn URL" },
              { type: "string", name: "github", label: "GitHub URL" },
              {
                type: "string",
                name: "summary",
                label: "Summary",
                ui: { component: "textarea" },
              },
            ],
          },

          // ── EXPERIENCE ────────────────────────────────────────
          {
            type: "object",
            name: "experience",
            label: "Experience",
            list: true,
            ui: {
              itemProps: (item) => ({ label: `${item.company} — ${item.title}` }),
            },
            fields: [
              { type: "string", name: "id", label: "ID" },
              { type: "string", name: "company", label: "Company" },
              { type: "string", name: "title", label: "Title" },
              { type: "string", name: "location", label: "Location" },
              { type: "string", name: "start", label: "Start (YYYY-MM)" },
              { type: "string", name: "end", label: "End (YYYY-MM, blank = present)" },
              { type: "boolean", name: "current", label: "Current Role" },
              {
                type: "object",
                name: "bullets",
                label: "Bullets",
                list: true,
                ui: {
                  itemProps: (item) => ({ label: item.text }),
                },
                fields: [
                  {
                    type: "string",
                    name: "text",
                    label: "Bullet",
                    ui: { component: "textarea" },
                  },
                ],
              },
            ],
          },

          // ── EDUCATION ─────────────────────────────────────────
          {
            type: "object",
            name: "education",
            label: "Education",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item.institution }),
            },
            fields: [
              { type: "string", name: "id", label: "ID" },
              { type: "string", name: "institution", label: "Institution" },
              { type: "string", name: "degree", label: "Degree" },
              { type: "string", name: "field", label: "Field of Study" },
              { type: "string", name: "start", label: "Start Year" },
              { type: "string", name: "end", label: "End Year" },
              { type: "string", name: "gpa", label: "GPA (optional)" },
              { type: "string", name: "notes", label: "Notes" },
            ],
          },

          // ── SKILLS ────────────────────────────────────────────
          {
            type: "object",
            name: "skills",
            label: "Skills",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item.category }),
            },
            fields: [
              { type: "string", name: "id", label: "ID" },
              { type: "string", name: "category", label: "Category" },
              { type: "string", name: "items", label: "Skills", list: true },
            ],
          },

          // ── PROJECTS ──────────────────────────────────────────
          {
            type: "object",
            name: "projects",
            label: "Side Projects",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item.name }),
            },
            fields: [
              { type: "string", name: "id", label: "ID" },
              { type: "string", name: "name", label: "Project Name" },
              {
                type: "string",
                name: "description",
                label: "Description",
                ui: { component: "textarea" },
              },
              { type: "string", name: "tech", label: "Tech Stack", list: true },
              { type: "string", name: "url", label: "URL" },
              { type: "boolean", name: "featured", label: "Featured" },
            ],
          },

          // ── CERTIFICATIONS ────────────────────────────────────
          {
            type: "object",
            name: "certifications",
            label: "Certifications",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item.name }),
            },
            fields: [
              { type: "string", name: "id", label: "ID" },
              { type: "string", name: "name", label: "Certification Name" },
              { type: "string", name: "issuer", label: "Issuing Organization" },
              { type: "string", name: "date", label: "Date (YYYY-MM)" },
              { type: "string", name: "url", label: "Verify URL (optional)" },
            ],
          },
        ],
      },
    ],
  },
});
