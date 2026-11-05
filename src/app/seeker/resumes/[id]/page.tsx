"use client";

import Link from "next/link";
import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  downloadResumePreview,
  printResumePreview,
  ResumePreview,
} from "@/components/resume/ResumePreview";
import { useAuth } from "@/lib/auth-store";
import {
  CITIES,
  EDUCATION_LEVELS,
  EMPLOYMENT_TYPES,
  emptyCertification,
  emptyEducation,
  emptyExperience,
  emptyLanguage,
  emptyProject,
  emptyReference,
  emptySkill,
  normalizeResumeContent,
} from "@/lib/resume";
import type { ResumeContent } from "@/lib/types";

function fieldClass() {
  return "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary";
}

function ResumeEditorContent() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const tab = search.get("tab") === "preview" ? "preview" : "edit";
  const { user, resumes, resumeTemplates, updateResume } = useAuth();
  const resume = resumes.find((r) => r.id === params.id && r.seekerId === user?.id);
  const template = resumeTemplates.find((t) => t.id === resume?.templateId);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<ResumeContent | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!resume) return;
    setTitle(resume.title);
    setContent(normalizeResumeContent(resume.content as never));
  }, [resume]);

  const activeTemplates = useMemo(
    () => resumeTemplates.filter((t) => t.active || t.id === resume?.templateId),
    [resumeTemplates, resume?.templateId]
  );

  if (!resume || !content) {
    return (
      <div>
        <PageHeader title="Resume not found" />
        <Link href="/seeker/resumes" className="text-sm text-primary">
          Back to resumes
        </Link>
      </div>
    );
  }

  function onSave(e: FormEvent) {
    e.preventDefault();
    if (!content || !resume) return;
    const result = updateResume(resume.id, {
      title,
      content: normalizeResumeContent(content),
    });
    setMessage(result.message);
  }

  function onPicture(file?: File | null) {
    if (!file || !content) return;
    const reader = new FileReader();
    reader.onload = () => {
      setContent({ ...content, profilePicture: String(reader.result || "") });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <PageHeader title={resume.title} subtitle={`Template: ${template?.name || "—"}`} />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/seeker/resumes">
          <Button variant="secondary">Back</Button>
        </Link>
        <Link href={`/seeker/resumes/${resume.id}`}>
          <Button variant={tab === "edit" ? "primary" : "secondary"}>Edit</Button>
        </Link>
        <Link href={`/seeker/resumes/${resume.id}?tab=preview`}>
          <Button variant={tab === "preview" ? "primary" : "secondary"}>Preview</Button>
        </Link>
        <Button
          variant="secondary"
          onClick={() =>
            downloadResumePreview(content.fullName || resume.title || "resume")
          }
        >
          Download
        </Button>
        <Button onClick={() => printResumePreview()}>Print</Button>
      </div>

      {tab === "edit" ? (
        <form className="space-y-4" onSubmit={onSave}>
          {message ? <Alert tone="success">{message}</Alert> : null}

          <Card title="Resume Settings">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Resume Title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">Template</span>
                <select
                  className={fieldClass()}
                  value={resume.templateId}
                  onChange={(e) => updateResume(resume.id, { templateId: e.target.value })}
                >
                  {activeTemplates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.style})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </Card>

          <Card title="1. Personal Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={content.fullName}
                onChange={(e) => setContent({ ...content, fullName: e.target.value })}
              />
              <Input
                label="Father's Name"
                value={content.fatherName}
                onChange={(e) => setContent({ ...content, fatherName: e.target.value })}
              />
              <label className="block space-y-1.5 text-sm text-foreground sm:col-span-2">
                <span className="font-medium">Profile Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  className={fieldClass()}
                  onChange={(e) => onPicture(e.target.files?.[0])}
                />
                {content.profilePicture ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={content.profilePicture}
                    alt="Profile"
                    className="mt-2 h-20 w-20 rounded-md border border-border object-cover"
                  />
                ) : null}
              </label>
              <Input
                label="CNIC"
                value={content.cnic}
                onChange={(e) => setContent({ ...content, cnic: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                value={content.email}
                onChange={(e) => setContent({ ...content, email: e.target.value })}
              />
              <Input
                label="Mobile Number"
                value={content.mobile}
                onChange={(e) => setContent({ ...content, mobile: e.target.value })}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={content.dateOfBirth}
                onChange={(e) => setContent({ ...content, dateOfBirth: e.target.value })}
              />
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">Gender</span>
                <select
                  className={fieldClass()}
                  value={content.gender}
                  onChange={(e) => setContent({ ...content, gender: e.target.value })}
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">City / District</span>
                <select
                  className={fieldClass()}
                  value={content.cityDistrict}
                  onChange={(e) => setContent({ ...content, cityDistrict: e.target.value })}
                >
                  <option value="">Select</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <div className="sm:col-span-2">
                <label className="block space-y-1.5 text-sm text-foreground">
                  <span className="font-medium">Address</span>
                  <textarea
                    className={`min-h-20 ${fieldClass()}`}
                    value={content.address}
                    onChange={(e) => setContent({ ...content, address: e.target.value })}
                  />
                </label>
              </div>
              <div className="sm:col-span-2">
                <label className="block space-y-1.5 text-sm text-foreground">
                  <span className="font-medium">Career Objective</span>
                  <textarea
                    className={`min-h-24 ${fieldClass()}`}
                    value={content.careerObjective}
                    onChange={(e) => setContent({ ...content, careerObjective: e.target.value })}
                  />
                </label>
              </div>
            </div>
          </Card>

          <Card
            title="2. Education / Qualifications"
            actions={
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setContent({
                    ...content,
                    educationItems: [...content.educationItems, emptyEducation()],
                  })
                }
              >
                Add Education
              </Button>
            }
          >
            <div className="space-y-4">
              {content.educationItems.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">Education #{index + 1}</p>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() =>
                        setContent({
                          ...content,
                          educationItems: content.educationItems.filter((e) => e.id !== item.id),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Degree / Qualification"
                      value={item.degree}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          educationItems: content.educationItems.map((x) =>
                            x.id === item.id ? { ...x, degree: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Institution Name"
                      value={item.institution}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          educationItems: content.educationItems.map((x) =>
                            x.id === item.id ? { ...x, institution: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Board / University"
                      value={item.boardUniversity}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          educationItems: content.educationItems.map((x) =>
                            x.id === item.id ? { ...x, boardUniversity: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Field of Study"
                      value={item.fieldOfStudy}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          educationItems: content.educationItems.map((x) =>
                            x.id === item.id ? { ...x, fieldOfStudy: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Obtained Marks / CGPA"
                      value={item.obtainedMarks}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          educationItems: content.educationItems.map((x) =>
                            x.id === item.id ? { ...x, obtainedMarks: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Total Marks / CGPA"
                      value={item.totalMarks}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          educationItems: content.educationItems.map((x) =>
                            x.id === item.id ? { ...x, totalMarks: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Start Date"
                      type="date"
                      value={item.startDate}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          educationItems: content.educationItems.map((x) =>
                            x.id === item.id ? { ...x, startDate: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Completion Date"
                      type="date"
                      value={item.completionDate}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          educationItems: content.educationItems.map((x) =>
                            x.id === item.id ? { ...x, completionDate: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <label className="block space-y-1.5 text-sm text-foreground sm:col-span-2">
                      <span className="font-medium">Education Level</span>
                      <select
                        className={fieldClass()}
                        value={item.educationLevel}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            educationItems: content.educationItems.map((x) =>
                              x.id === item.id ? { ...x, educationLevel: e.target.value } : x
                            ),
                          })
                        }
                      >
                        <option value="">Select</option>
                        {EDUCATION_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="3. Work Experience"
            actions={
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setContent({
                    ...content,
                    experienceItems: [...content.experienceItems, emptyExperience()],
                  })
                }
              >
                Add Experience
              </Button>
            }
          >
            <div className="space-y-4">
              {content.experienceItems.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium">Experience #{index + 1}</p>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() =>
                        setContent({
                          ...content,
                          experienceItems: content.experienceItems.filter((e) => e.id !== item.id),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Job Title"
                      value={item.jobTitle}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          experienceItems: content.experienceItems.map((x) =>
                            x.id === item.id ? { ...x, jobTitle: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Company / Organization"
                      value={item.company}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          experienceItems: content.experienceItems.map((x) =>
                            x.id === item.id ? { ...x, company: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <label className="block space-y-1.5 text-sm text-foreground">
                      <span className="font-medium">Employment Type</span>
                      <select
                        className={fieldClass()}
                        value={item.employmentType}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            experienceItems: content.experienceItems.map((x) =>
                              x.id === item.id ? { ...x, employmentType: e.target.value } : x
                            ),
                          })
                        }
                      >
                        <option value="">Select</option>
                        {EMPLOYMENT_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </label>
                    <Input
                      label="Location"
                      value={item.location}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          experienceItems: content.experienceItems.map((x) =>
                            x.id === item.id ? { ...x, location: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Start Date"
                      type="date"
                      value={item.startDate}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          experienceItems: content.experienceItems.map((x) =>
                            x.id === item.id ? { ...x, startDate: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="End Date"
                      type="date"
                      value={item.endDate}
                      disabled={item.currentlyWorking}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          experienceItems: content.experienceItems.map((x) =>
                            x.id === item.id ? { ...x, endDate: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
                      <input
                        type="checkbox"
                        checked={item.currentlyWorking}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            experienceItems: content.experienceItems.map((x) =>
                              x.id === item.id
                                ? {
                                    ...x,
                                    currentlyWorking: e.target.checked,
                                    endDate: e.target.checked ? "" : x.endDate,
                                  }
                                : x
                            ),
                          })
                        }
                      />
                      Currently Working (Yes/No)
                    </label>
                    <div className="sm:col-span-2">
                      <label className="block space-y-1.5 text-sm text-foreground">
                        <span className="font-medium">Job Responsibilities</span>
                        <textarea
                          className={`min-h-24 ${fieldClass()}`}
                          value={item.responsibilities}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              experienceItems: content.experienceItems.map((x) =>
                                x.id === item.id ? { ...x, responsibilities: e.target.value } : x
                              ),
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="4. Skills"
            actions={
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setContent({ ...content, skillItems: [...content.skillItems, emptySkill()] })
                }
              >
                Add Skill
              </Button>
            }
          >
            <div className="space-y-3">
              {content.skillItems.map((item) => (
                <div key={item.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <Input
                    label="Skill Name"
                    value={item.skillName}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        skillItems: content.skillItems.map((x) =>
                          x.id === item.id ? { ...x, skillName: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <label className="block space-y-1.5 text-sm text-foreground">
                    <span className="font-medium">Skill Level</span>
                    <select
                      className={fieldClass()}
                      value={item.skillLevel}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          skillItems: content.skillItems.map((x) =>
                            x.id === item.id
                              ? {
                                  ...x,
                                  skillLevel: e.target.value as ResumeContent["skillItems"][0]["skillLevel"],
                                }
                              : x
                          ),
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </label>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() =>
                        setContent({
                          ...content,
                          skillItems: content.skillItems.filter((x) => x.id !== item.id),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">Technical Skills</span>
                <textarea
                  className={`min-h-20 ${fieldClass()}`}
                  value={content.technicalSkills}
                  onChange={(e) => setContent({ ...content, technicalSkills: e.target.value })}
                />
              </label>
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">Soft Skills</span>
                <textarea
                  className={`min-h-20 ${fieldClass()}`}
                  value={content.softSkills}
                  onChange={(e) => setContent({ ...content, softSkills: e.target.value })}
                />
              </label>
            </div>
          </Card>

          <Card
            title="5. Certifications & Training"
            actions={
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setContent({
                    ...content,
                    certifications: [...content.certifications, emptyCertification()],
                  })
                }
              >
                Add Certificate
              </Button>
            }
          >
            <div className="space-y-4">
              {content.certifications.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex justify-between">
                    <p className="text-sm font-medium">Certificate #{index + 1}</p>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() =>
                        setContent({
                          ...content,
                          certifications: content.certifications.filter((c) => c.id !== item.id),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Certificate / Course Name"
                      value={item.courseName}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          certifications: content.certifications.map((x) =>
                            x.id === item.id ? { ...x, courseName: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Institute Name"
                      value={item.instituteName}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          certifications: content.certifications.map((x) =>
                            x.id === item.id ? { ...x, instituteName: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Issue Date"
                      type="date"
                      value={item.issueDate}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          certifications: content.certifications.map((x) =>
                            x.id === item.id ? { ...x, issueDate: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Expiry Date (Optional)"
                      type="date"
                      value={item.expiryDate}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          certifications: content.certifications.map((x) =>
                            x.id === item.id ? { ...x, expiryDate: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Certificate ID (Optional)"
                      value={item.certificateId}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          certifications: content.certifications.map((x) =>
                            x.id === item.id ? { ...x, certificateId: e.target.value } : x
                          ),
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="6. Languages"
            actions={
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setContent({ ...content, languages: [...content.languages, emptyLanguage()] })
                }
              >
                Add Language
              </Button>
            }
          >
            <div className="space-y-3">
              {content.languages.map((item) => (
                <div key={item.id} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <Input
                    label="Language Name"
                    value={item.languageName}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        languages: content.languages.map((x) =>
                          x.id === item.id ? { ...x, languageName: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <label className="block space-y-1.5 text-sm text-foreground">
                    <span className="font-medium">Proficiency</span>
                    <select
                      className={fieldClass()}
                      value={item.proficiency}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          languages: content.languages.map((x) =>
                            x.id === item.id
                              ? {
                                  ...x,
                                  proficiency: e.target
                                    .value as ResumeContent["languages"][0]["proficiency"],
                                }
                              : x
                          ),
                        })
                      }
                    >
                      <option value="">Select</option>
                      <option>Basic</option>
                      <option>Intermediate</option>
                      <option>Fluent</option>
                    </select>
                  </label>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() =>
                        setContent({
                          ...content,
                          languages: content.languages.filter((x) => x.id !== item.id),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="7. Projects & Achievements"
            actions={
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setContent({ ...content, projects: [...content.projects, emptyProject()] })
                }
              >
                Add Project
              </Button>
            }
          >
            <div className="space-y-4">
              {content.projects.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex justify-between">
                    <p className="text-sm font-medium">Project #{index + 1}</p>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() =>
                        setContent({
                          ...content,
                          projects: content.projects.filter((p) => p.id !== item.id),
                        })
                      }
                    >
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Project Name"
                      value={item.projectName}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          projects: content.projects.map((x) =>
                            x.id === item.id ? { ...x, projectName: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Role"
                      value={item.role}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          projects: content.projects.map((x) =>
                            x.id === item.id ? { ...x, role: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Completion Date"
                      type="date"
                      value={item.completionDate}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          projects: content.projects.map((x) =>
                            x.id === item.id ? { ...x, completionDate: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <div className="sm:col-span-2">
                      <label className="block space-y-1.5 text-sm text-foreground">
                        <span className="font-medium">Project Description</span>
                        <textarea
                          className={`min-h-20 ${fieldClass()}`}
                          value={item.description}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              projects: content.projects.map((x) =>
                                x.id === item.id ? { ...x, description: e.target.value } : x
                              ),
                            })
                          }
                        />
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block space-y-1.5 text-sm text-foreground">
                        <span className="font-medium">Achievements / Awards</span>
                        <textarea
                          className={`min-h-20 ${fieldClass()}`}
                          value={item.achievements}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              projects: content.projects.map((x) =>
                                x.id === item.id ? { ...x, achievements: e.target.value } : x
                              ),
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title="8. References (Optional)"
            actions={
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setContent({
                    ...content,
                    references: [...content.references, emptyReference()],
                  })
                }
              >
                Add Reference
              </Button>
            }
          >
            {content.references.length === 0 ? (
              <p className="text-sm text-muted">No references added.</p>
            ) : (
              <div className="space-y-4">
                {content.references.map((item, index) => (
                  <div key={item.id} className="rounded-lg border border-border p-4">
                    <div className="mb-3 flex justify-between">
                      <p className="text-sm font-medium">Reference #{index + 1}</p>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() =>
                          setContent({
                            ...content,
                            references: content.references.filter((r) => r.id !== item.id),
                          })
                        }
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        label="Reference Name"
                        value={item.name}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            references: content.references.map((x) =>
                              x.id === item.id ? { ...x, name: e.target.value } : x
                            ),
                          })
                        }
                      />
                      <Input
                        label="Designation"
                        value={item.designation}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            references: content.references.map((x) =>
                              x.id === item.id ? { ...x, designation: e.target.value } : x
                            ),
                          })
                        }
                      />
                      <Input
                        label="Organization"
                        value={item.organization}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            references: content.references.map((x) =>
                              x.id === item.id ? { ...x, organization: e.target.value } : x
                            ),
                          })
                        }
                      />
                      <Input
                        label="Contact Number"
                        value={item.contactNumber}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            references: content.references.map((x) =>
                              x.id === item.id ? { ...x, contactNumber: e.target.value } : x
                            ),
                          })
                        }
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={item.email}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            references: content.references.map((x) =>
                              x.id === item.id ? { ...x, email: e.target.value } : x
                            ),
                          })
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button type="submit">Save Resume</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                downloadResumePreview(content.fullName || resume.title || "resume")
              }
            >
              Download
            </Button>
            <Button type="button" onClick={() => printResumePreview()}>
              Print
            </Button>
          </div>
        </form>
      ) : null}

      <div className="mt-6">
        <h2 className="mb-1 text-base font-semibold text-foreground">
          {tab === "preview" ? "Resume Preview" : "Preview (Download & Print use this only)"}
        </h2>
        <p className="mb-3 text-xs text-muted">
          Download and Print export this preview only — not the edit form or browser page.
          Includes profile picture and gender when filled.
        </p>
        <ResumePreview content={content} style={template?.style || "classic"} />
      </div>
    </div>
  );
}

export default function SeekerResumeDetailPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading...</div>}>
      <ResumeEditorContent />
    </Suspense>
  );
}
