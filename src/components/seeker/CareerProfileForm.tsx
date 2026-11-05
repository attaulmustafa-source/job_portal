"use client";

import { FormEvent, type ReactNode } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
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
} from "@/lib/resume";
import type { SeekerProfileSectionId } from "@/lib/seeker-profile-sections";
import type { SeekerProfile } from "@/lib/types";

function fieldClass() {
  return "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary";
}

function readImage(file: File | null | undefined, onDone: (dataUrl: string) => void) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => onDone(String(reader.result || ""));
  reader.readAsDataURL(file);
}

function SectionBody({
  embedded,
  title,
  actions,
  children,
}: {
  embedded?: boolean;
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  if (embedded) {
    return (
      <div className="space-y-4">
        {actions ? <div className="flex justify-end">{actions}</div> : null}
        {children}
      </div>
    );
  }
  return (
    <Card title={title} actions={actions}>
      {children}
    </Card>
  );
}

export function CareerProfileForm({
  section,
  value,
  accountEmail,
  onChange,
  onSubmit,
  message,
  embedded = false,
  saveLabel = "Save Profile",
  hideSave = false,
}: {
  section: SeekerProfileSectionId;
  value: SeekerProfile;
  accountEmail: string;
  onChange: (next: SeekerProfile) => void;
  onSubmit: (e: FormEvent) => void;
  message?: { tone: "success" | "danger" | "info"; text: string } | null;
  embedded?: boolean;
  saveLabel?: string;
  hideSave?: boolean;
}) {
  const form = value;

  function set(patch: Partial<SeekerProfile>) {
    onChange({ ...form, ...patch });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {message ? <Alert tone={message.tone}>{message.text}</Alert> : null}

      {section === "profile" ? (
        <SectionBody embedded={embedded} title="Personal Information">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={form.fullName}
              onChange={(e) => set({ fullName: e.target.value })}
              required
            />
            <Input
              label="Father's Name"
              value={form.fatherName}
              onChange={(e) => set({ fatherName: e.target.value })}
            />
            <label className="block space-y-1.5 text-sm text-foreground">
              <span className="font-medium">Profile Picture</span>
              <input
                type="file"
                accept="image/*"
                className={fieldClass()}
                onChange={(e) =>
                  readImage(e.target.files?.[0], (profilePicture) => set({ profilePicture }))
                }
              />
              {form.profilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.profilePicture}
                  alt="Profile"
                  className="mt-2 h-20 w-20 rounded-md border border-border object-cover"
                />
              ) : null}
            </label>
            <div className="grid gap-3 sm:grid-cols-2 sm:col-span-1">
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">CNIC Front</span>
                <input
                  type="file"
                  accept="image/*"
                  className={fieldClass()}
                  onChange={(e) =>
                    readImage(e.target.files?.[0], (cnicFrontPic) => set({ cnicFrontPic }))
                  }
                />
                {form.cnicFrontPic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.cnicFrontPic}
                    alt="CNIC front"
                    className="mt-2 h-16 w-full rounded-md border border-border object-cover"
                  />
                ) : null}
              </label>
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">CNIC Back</span>
                <input
                  type="file"
                  accept="image/*"
                  className={fieldClass()}
                  onChange={(e) =>
                    readImage(e.target.files?.[0], (cnicBackPic) => set({ cnicBackPic }))
                  }
                />
                {form.cnicBackPic ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.cnicBackPic}
                    alt="CNIC back"
                    className="mt-2 h-16 w-full rounded-md border border-border object-cover"
                  />
                ) : null}
              </label>
            </div>
            <Input
              label="CNIC"
              hint="Demo NAVTCC CNIC: 35202-1234567-1"
              value={form.cnic}
              onChange={(e) => set({ cnic: e.target.value })}
              required
            />
            <Input label="Email Address" type="email" value={accountEmail} disabled />
            <Input
              label="Mobile Number"
              value={form.phone}
              onChange={(e) => set({ phone: e.target.value })}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => set({ dateOfBirth: e.target.value })}
            />
            <label className="block space-y-1.5 text-sm text-foreground">
              <span className="font-medium">Gender</span>
              <select
                className={fieldClass()}
                value={form.gender}
                onChange={(e) => set({ gender: e.target.value })}
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
                value={form.city}
                onChange={(e) => set({ city: e.target.value })}
                required
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
                  value={form.address}
                  onChange={(e) => set({ address: e.target.value })}
                />
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">Career Objective</span>
                <textarea
                  className={`min-h-24 ${fieldClass()}`}
                  value={form.careerObjective}
                  onChange={(e) => set({ careerObjective: e.target.value })}
                />
              </label>
            </div>
          </div>
        </SectionBody>
      ) : null}

      {section === "qualification" ? (
        <SectionBody
          embedded={embedded}
          title="Education / Qualifications"
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => set({ educationItems: [...form.educationItems, emptyEducation()] })}
            >
              Add Education
            </Button>
          }
        >
          <div className="space-y-4">
            {form.educationItems.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Education #{index + 1}</p>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() =>
                      set({
                        educationItems: form.educationItems.filter((e) => e.id !== item.id),
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
                      set({
                        educationItems: form.educationItems.map((x) =>
                          x.id === item.id ? { ...x, degree: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    label="Institution Name"
                    value={item.institution}
                    onChange={(e) =>
                      set({
                        educationItems: form.educationItems.map((x) =>
                          x.id === item.id ? { ...x, institution: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    label="Board / University"
                    value={item.boardUniversity}
                    onChange={(e) =>
                      set({
                        educationItems: form.educationItems.map((x) =>
                          x.id === item.id ? { ...x, boardUniversity: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    label="Field of Study"
                    value={item.fieldOfStudy}
                    onChange={(e) =>
                      set({
                        educationItems: form.educationItems.map((x) =>
                          x.id === item.id ? { ...x, fieldOfStudy: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    label="Obtained Marks / CGPA"
                    value={item.obtainedMarks}
                    onChange={(e) =>
                      set({
                        educationItems: form.educationItems.map((x) =>
                          x.id === item.id ? { ...x, obtainedMarks: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    label="Total Marks / CGPA"
                    value={item.totalMarks}
                    onChange={(e) =>
                      set({
                        educationItems: form.educationItems.map((x) =>
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
                      set({
                        educationItems: form.educationItems.map((x) =>
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
                      set({
                        educationItems: form.educationItems.map((x) =>
                          x.id === item.id ? { ...x, completionDate: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <label className="block space-y-1.5 text-sm text-foreground">
                    <span className="font-medium">Education Level</span>
                    <select
                      className={fieldClass()}
                      value={item.educationLevel}
                      onChange={(e) =>
                        set({
                          educationItems: form.educationItems.map((x) =>
                            x.id === item.id ? { ...x, educationLevel: e.target.value } : x
                          ),
                        })
                      }
                    >
                      <option value="">Select</option>
                      {EDUCATION_LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </SectionBody>
      ) : null}

      {section === "experience" ? (
        <SectionBody
          embedded={embedded}
          title="Work Experience"
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                set({ experienceItems: [...form.experienceItems, emptyExperience()] })
              }
            >
              Add Experience
            </Button>
          }
        >
          <div className="space-y-4">
            {form.experienceItems.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Experience #{index + 1}</p>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() =>
                      set({
                        experienceItems: form.experienceItems.filter((e) => e.id !== item.id),
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
                      set({
                        experienceItems: form.experienceItems.map((x) =>
                          x.id === item.id ? { ...x, jobTitle: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    label="Company / Organization"
                    value={item.company}
                    onChange={(e) =>
                      set({
                        experienceItems: form.experienceItems.map((x) =>
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
                        set({
                          experienceItems: form.experienceItems.map((x) =>
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
                      set({
                        experienceItems: form.experienceItems.map((x) =>
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
                      set({
                        experienceItems: form.experienceItems.map((x) =>
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
                      set({
                        experienceItems: form.experienceItems.map((x) =>
                          x.id === item.id ? { ...x, endDate: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={item.currentlyWorking}
                      onChange={(e) =>
                        set({
                          experienceItems: form.experienceItems.map((x) =>
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
                    Currently Working
                  </label>
                  <div className="sm:col-span-2">
                    <label className="block space-y-1.5 text-sm text-foreground">
                      <span className="font-medium">Job Responsibilities</span>
                      <textarea
                        className={`min-h-24 ${fieldClass()}`}
                        value={item.responsibilities}
                        onChange={(e) =>
                          set({
                            experienceItems: form.experienceItems.map((x) =>
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
        </SectionBody>
      ) : null}

      {section === "skills" ? (
        <SectionBody
          embedded={embedded}
          title="Skills"
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => set({ skillItems: [...form.skillItems, emptySkill()] })}
            >
              Add Skill
            </Button>
          }
        >
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5 text-sm text-foreground">
              <span className="font-medium">Technical Skills</span>
              <textarea
                className={`min-h-20 ${fieldClass()}`}
                value={form.technicalSkills}
                onChange={(e) => set({ technicalSkills: e.target.value })}
                placeholder="e.g. PLC, AutoCAD, Excel"
              />
            </label>
            <label className="block space-y-1.5 text-sm text-foreground">
              <span className="font-medium">Soft Skills</span>
              <textarea
                className={`min-h-20 ${fieldClass()}`}
                value={form.softSkills}
                onChange={(e) => set({ softSkills: e.target.value })}
                placeholder="e.g. Communication, Teamwork"
              />
            </label>
          </div>
          <div className="space-y-3">
            {form.skillItems.map((item, index) => (
              <div key={item.id} className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-3">
                <Input
                  label={`Skill Name #${index + 1}`}
                  value={item.skillName}
                  onChange={(e) =>
                    set({
                      skillItems: form.skillItems.map((x) =>
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
                      set({
                        skillItems: form.skillItems.map((x) =>
                          x.id === item.id
                            ? {
                                ...x,
                                skillLevel: e.target.value as typeof item.skillLevel,
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
                      set({ skillItems: form.skillItems.filter((s) => s.id !== item.id) })
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionBody>
      ) : null}

      {section === "certifications" ? (
        <SectionBody
          embedded={embedded}
          title="Certifications & Training"
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                set({ certifications: [...form.certifications, emptyCertification()] })
              }
            >
              Add Certificate
            </Button>
          }
        >
          <div className="space-y-4">
            {form.certifications.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Certificate #{index + 1}</p>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() =>
                      set({
                        certifications: form.certifications.filter((c) => c.id !== item.id),
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
                      set({
                        certifications: form.certifications.map((x) =>
                          x.id === item.id ? { ...x, courseName: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    label="Institute Name"
                    value={item.instituteName}
                    onChange={(e) =>
                      set({
                        certifications: form.certifications.map((x) =>
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
                      set({
                        certifications: form.certifications.map((x) =>
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
                      set({
                        certifications: form.certifications.map((x) =>
                          x.id === item.id ? { ...x, expiryDate: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    label="Certificate ID (Optional)"
                    value={item.certificateId}
                    onChange={(e) =>
                      set({
                        certifications: form.certifications.map((x) =>
                          x.id === item.id ? { ...x, certificateId: e.target.value } : x
                        ),
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionBody>
      ) : null}

      {section === "languages" ? (
        <SectionBody
          embedded={embedded}
          title="Languages"
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => set({ languages: [...form.languages, emptyLanguage()] })}
            >
              Add Language
            </Button>
          }
        >
          <div className="space-y-3">
            {form.languages.map((item, index) => (
              <div key={item.id} className="grid gap-3 rounded-lg border border-border p-3 sm:grid-cols-3">
                <Input
                  label={`Language #${index + 1}`}
                  value={item.languageName}
                  onChange={(e) =>
                    set({
                      languages: form.languages.map((x) =>
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
                      set({
                        languages: form.languages.map((x) =>
                          x.id === item.id
                            ? {
                                ...x,
                                proficiency: e.target.value as typeof item.proficiency,
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
                      set({ languages: form.languages.filter((l) => l.id !== item.id) })
                    }
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SectionBody>
      ) : null}

      {section === "projects" ? (
        <SectionBody
          embedded={embedded}
          title="Projects & Achievements"
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => set({ projects: [...form.projects, emptyProject()] })}
            >
              Add Project
            </Button>
          }
        >
          <div className="space-y-4">
            {form.projects.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium">Project #{index + 1}</p>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() =>
                      set({ projects: form.projects.filter((p) => p.id !== item.id) })
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
                      set({
                        projects: form.projects.map((x) =>
                          x.id === item.id ? { ...x, projectName: e.target.value } : x
                        ),
                      })
                    }
                  />
                  <Input
                    label="Role"
                    value={item.role}
                    onChange={(e) =>
                      set({
                        projects: form.projects.map((x) =>
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
                      set({
                        projects: form.projects.map((x) =>
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
                          set({
                            projects: form.projects.map((x) =>
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
                          set({
                            projects: form.projects.map((x) =>
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
        </SectionBody>
      ) : null}

      {section === "references" ? (
        <SectionBody
          embedded={embedded}
          title="References (Optional)"
          actions={
            <Button
              type="button"
              variant="secondary"
              onClick={() => set({ references: [...form.references, emptyReference()] })}
            >
              Add Reference
            </Button>
          }
        >
          {form.references.length === 0 ? (
            <p className="text-sm text-[#6b7c99]">No references added yet.</p>
          ) : (
            <div className="space-y-4">
              {form.references.map((item, index) => (
                <div key={item.id} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-medium">Reference #{index + 1}</p>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() =>
                        set({
                          references: form.references.filter((r) => r.id !== item.id),
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
                        set({
                          references: form.references.map((x) =>
                            x.id === item.id ? { ...x, name: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Designation"
                      value={item.designation}
                      onChange={(e) =>
                        set({
                          references: form.references.map((x) =>
                            x.id === item.id ? { ...x, designation: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Organization"
                      value={item.organization}
                      onChange={(e) =>
                        set({
                          references: form.references.map((x) =>
                            x.id === item.id ? { ...x, organization: e.target.value } : x
                          ),
                        })
                      }
                    />
                    <Input
                      label="Contact Number"
                      value={item.contactNumber}
                      onChange={(e) =>
                        set({
                          references: form.references.map((x) =>
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
                        set({
                          references: form.references.map((x) =>
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
        </SectionBody>
      ) : null}

      {hideSave ? null : (
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit">{saveLabel}</Button>
          <p className="text-xs text-[#6b7c99]">
            Saving updates your profile and syncs the same data into your resumes.
          </p>
        </div>
      )}
    </form>
  );
}
