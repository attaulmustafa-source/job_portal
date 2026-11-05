import type { ResumeContent, ResumeTemplateStyle } from "@/lib/types";

function Section({
  title,
  children,
  accent,
}: {
  title: string;
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <section className="mt-4">
      <h3
        className={`mb-2 text-sm font-semibold uppercase tracking-wide ${
          accent ? "text-primary" : "text-foreground"
        }`}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}

function ProfilePhoto({ src, round }: { src?: string; round?: boolean }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt="Profile"
        className={`${round ? "h-16 w-16 rounded-full border-2 border-white" : "h-16 w-16 rounded-md border border-border"} object-cover`}
      />
    );
  }
  return (
    <div
      className={`${round ? "h-16 w-16 rounded-full border-2 border-white/40 bg-white/20" : "h-16 w-16 rounded-md border border-dashed border-border bg-primary-soft"} flex items-center justify-center text-[10px] font-medium text-muted`}
    >
      No Photo
    </div>
  );
}

function Body({ content, accent }: { content: ResumeContent; accent?: boolean }) {
  return (
    <div className="text-sm text-foreground">
      {content.careerObjective ? (
        <Section title="Career Objective" accent={accent}>
          <p className="whitespace-pre-wrap">{content.careerObjective}</p>
        </Section>
      ) : null}

      <Section title="Education / Qualifications" accent={accent}>
        <div className="space-y-3">
          {content.educationItems.filter((e) => e.degree || e.institution).length === 0 ? (
            <p className="text-muted">—</p>
          ) : (
            content.educationItems
              .filter((e) => e.degree || e.institution)
              .map((e) => (
                <div key={e.id}>
                  <p className="font-medium">
                    {e.degree}
                    {e.educationLevel ? ` (${e.educationLevel})` : ""}
                  </p>
                  <p className="text-muted">
                    {[e.institution, e.boardUniversity, e.fieldOfStudy]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="text-xs text-muted">
                    {[e.startDate, e.completionDate].filter(Boolean).join(" – ")}
                    {e.obtainedMarks
                      ? ` · Marks: ${e.obtainedMarks}${e.totalMarks ? ` / ${e.totalMarks}` : ""}`
                      : ""}
                  </p>
                </div>
              ))
          )}
        </div>
      </Section>

      <Section title="Work Experience" accent={accent}>
        <div className="space-y-3">
          {content.experienceItems.filter((e) => e.jobTitle || e.company).length === 0 ? (
            <p className="text-muted">—</p>
          ) : (
            content.experienceItems
              .filter((e) => e.jobTitle || e.company)
              .map((e) => (
                <div key={e.id}>
                  <p className="font-medium">
                    {e.jobTitle}
                    {e.company ? ` — ${e.company}` : ""}
                  </p>
                  <p className="text-muted">
                    {[e.employmentType, e.location].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-xs text-muted">
                    {e.startDate || "—"} – {e.currentlyWorking ? "Present" : e.endDate || "—"}
                  </p>
                  {e.responsibilities ? (
                    <p className="mt-1 whitespace-pre-wrap">{e.responsibilities}</p>
                  ) : null}
                </div>
              ))
          )}
        </div>
      </Section>

      <Section title="Skills" accent={accent}>
        <ul className="list-disc space-y-1 pl-5">
          {content.skillItems
            .filter((s) => s.skillName)
            .map((s) => (
              <li key={s.id}>
                {s.skillName}
                {s.skillLevel ? ` (${s.skillLevel})` : ""}
              </li>
            ))}
        </ul>
        {content.technicalSkills ? (
          <p className="mt-2">
            <span className="font-medium">Technical:</span> {content.technicalSkills}
          </p>
        ) : null}
        {content.softSkills ? (
          <p className="mt-1">
            <span className="font-medium">Soft:</span> {content.softSkills}
          </p>
        ) : null}
      </Section>

      <Section title="Certifications & Training" accent={accent}>
        <div className="space-y-2">
          {content.certifications.filter((c) => c.courseName).length === 0 ? (
            <p className="text-muted">—</p>
          ) : (
            content.certifications
              .filter((c) => c.courseName)
              .map((c) => (
                <div key={c.id}>
                  <p className="font-medium">{c.courseName}</p>
                  <p className="text-muted">
                    {[c.instituteName, c.issueDate, c.expiryDate ? `Exp: ${c.expiryDate}` : ""]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {c.certificateId ? (
                    <p className="text-xs text-muted">ID: {c.certificateId}</p>
                  ) : null}
                </div>
              ))
          )}
        </div>
      </Section>

      <Section title="Languages" accent={accent}>
        <ul className="list-disc space-y-1 pl-5">
          {content.languages.filter((l) => l.languageName).length === 0 ? (
            <li className="text-muted">—</li>
          ) : (
            content.languages
              .filter((l) => l.languageName)
              .map((l) => (
                <li key={l.id}>
                  {l.languageName}
                  {l.proficiency ? ` — ${l.proficiency}` : ""}
                </li>
              ))
          )}
        </ul>
      </Section>

      <Section title="Projects & Achievements" accent={accent}>
        <div className="space-y-2">
          {content.projects.filter((p) => p.projectName).length === 0 ? (
            <p className="text-muted">—</p>
          ) : (
            content.projects
              .filter((p) => p.projectName)
              .map((p) => (
                <div key={p.id}>
                  <p className="font-medium">
                    {p.projectName}
                    {p.role ? ` (${p.role})` : ""}
                  </p>
                  {p.description ? (
                    <p className="whitespace-pre-wrap text-muted">{p.description}</p>
                  ) : null}
                  {p.achievements ? (
                    <p className="mt-1 whitespace-pre-wrap">{p.achievements}</p>
                  ) : null}
                  {p.completionDate ? (
                    <p className="text-xs text-muted">Completed: {p.completionDate}</p>
                  ) : null}
                </div>
              ))
          )}
        </div>
      </Section>

      {content.references.filter((r) => r.name).length > 0 ? (
        <Section title="References" accent={accent}>
          <div className="space-y-2">
            {content.references
              .filter((r) => r.name)
              .map((r) => (
                <div key={r.id}>
                  <p className="font-medium">{r.name}</p>
                  <p className="text-muted">
                    {[r.designation, r.organization].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-xs text-muted">
                    {[r.contactNumber, r.email].filter(Boolean).join(" · ")}
                  </p>
                </div>
              ))}
          </div>
        </Section>
      ) : null}
    </div>
  );
}

export function ResumePreview({
  content,
  style = "classic",
  printId = "resume-print-area",
}: {
  content: ResumeContent;
  style?: ResumeTemplateStyle;
  printId?: string;
}) {
  const contact = [content.email, content.mobile, content.cityDistrict]
    .filter(Boolean)
    .join(" · ");

  if (style === "modern") {
    return (
      <article
        id={printId}
        className="overflow-hidden rounded-xl border border-border bg-white text-foreground shadow-sm"
      >
        <header className="flex items-center gap-4 bg-primary px-6 py-5 text-white">
          <ProfilePhoto src={content.profilePicture} round />
          <div>
            <h2 className="text-2xl font-semibold">{content.fullName || "Your Name"}</h2>
            <p className="mt-1 text-sm text-blue-100">{contact}</p>
            {content.fatherName ? (
              <p className="text-xs text-blue-100">Father: {content.fatherName}</p>
            ) : null}
            <p className="text-xs text-blue-100">
              {[
                content.gender ? `Gender: ${content.gender}` : "",
                content.dateOfBirth ? `DOB: ${content.dateOfBirth}` : "",
                content.cnic ? `CNIC: ${content.cnic}` : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
        </header>
        <div className="p-6">
          {content.address ? <p className="text-xs text-muted">Address: {content.address}</p> : null}
          <Body content={content} accent />
        </div>
      </article>
    );
  }

  return (
    <article
      id={printId}
      className={`rounded-xl border border-border bg-white text-foreground shadow-sm ${
        style === "compact" ? "p-5" : "p-6"
      }`}
    >
      <header
        className={`flex items-start gap-4 border-b border-border pb-4 ${
          style === "compact" ? "pb-2" : ""
        }`}
      >
        <ProfilePhoto src={content.profilePicture} />
        <div className="min-w-0 flex-1">
          <h2 className={`${style === "compact" ? "text-xl" : "text-2xl"} font-semibold`}>
            {content.fullName || "Your Name"}
          </h2>
          <p className="mt-1 text-sm text-muted">{contact}</p>
          <p className="mt-1 text-xs text-muted">
            {[
              content.fatherName ? `Father: ${content.fatherName}` : "",
              content.gender ? `Gender: ${content.gender}` : "",
              content.dateOfBirth ? `DOB: ${content.dateOfBirth}` : "",
              content.cnic ? `CNIC: ${content.cnic}` : "",
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
          {content.address ? (
            <p className="mt-1 text-xs text-muted">Address: {content.address}</p>
          ) : null}
        </div>
      </header>
      <Body content={content} accent={false} />
    </article>
  );
}

const EXPORT_STYLES = `
  body { font-family: Arial, Helvetica, sans-serif; color: #111; margin: 24px; background: #fff; }
  h2,h3 { margin: 0 0 6px; }
  p,li { margin: 0; }
  section { margin-top: 14px; }
  ul { margin: 0; padding-left: 18px; }
  img { width: 72px; height: 72px; object-fit: cover; border-radius: 8px; }
  header { margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #ddd; display:flex; gap:16px; align-items:flex-start; }
  .text-muted, .text-blue-100 { color: #555 !important; }
  .bg-primary { background: #2563eb !important; color: #fff !important; padding: 20px; }
  .bg-primary img { border-radius: 999px; border: 2px solid #fff; }
`;

function getPreviewHtml(printId = "resume-print-area") {
  const node = document.getElementById(printId);
  if (!node) return null;
  return `<!doctype html><html><head><meta charset="utf-8"/><title>Resume</title>
    <style>${EXPORT_STYLES}</style>
  </head><body>${node.innerHTML}</body></html>`;
}

/** Print only the resume preview (never the full app page). */
export function printResumePreview(printId = "resume-print-area") {
  const html = getPreviewHtml(printId);
  if (!html) {
    alert("Save your resume and open Preview first, then try Print again.");
    return;
  }
  const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=1000");
  if (!win) {
    alert("Please allow pop-ups to print the resume preview.");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 250);
}

/** Download only the resume preview as an HTML file. */
export function downloadResumePreview(
  fileName = "resume",
  printId = "resume-print-area"
) {
  const html = getPreviewHtml(printId);
  if (!html) {
    alert("Save your resume and open Preview first, then try Download again.");
    return;
  }
  const safeName = fileName.replace(/[^\w\-]+/g, "_") || "resume";
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeName}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
