"use client";

import { OrgLogo } from "@/components/jobs/OrgLogo";
import { Input } from "@/components/ui/Input";
import {
  ADMINISTRATION_LEVELS,
  ORG_COUNTRIES,
  ORG_PROVINCES,
  ORGANIZATION_SIZES,
  type EmployerOrgSectionId,
} from "@/lib/organization";
import type { OrganizationDetails } from "@/lib/types";

function fieldClass() {
  return "w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none focus:border-primary";
}

export function EmployerOrganizationForm({
  section,
  value,
  onChange,
}: {
  section: EmployerOrgSectionId;
  value: OrganizationDetails;
  onChange: (next: OrganizationDetails) => void;
}) {
  const form = value;
  function set(patch: Partial<OrganizationDetails>) {
    onChange({ ...form, ...patch });
  }

  if (section === "basic") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Organization Name"
          value={form.organizationName}
          onChange={(e) => set({ organizationName: e.target.value })}
          required
        />
        <label className="block space-y-1.5 text-sm text-foreground">
          <span className="font-medium">Organization Type *</span>
          <select
            className={fieldClass()}
            value={form.category}
            onChange={(e) =>
              set({ category: e.target.value as OrganizationDetails["category"] })
            }
            required
          >
            <option value="">Select type</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            <option value="Foreign">Foreign</option>
          </select>
        </label>
        <label className="block space-y-1.5 text-sm text-foreground">
          <span className="font-medium">Organization Size *</span>
          <select
            className={fieldClass()}
            value={form.organizationSize}
            onChange={(e) => set({ organizationSize: e.target.value })}
            required
          >
            <option value="">Select size</option>
            {ORGANIZATION_SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Industry"
          value={form.industry}
          onChange={(e) => set({ industry: e.target.value })}
          required
        />
        <Input
          label="Registration Authority"
          value={form.registrationAuthority}
          onChange={(e) => set({ registrationAuthority: e.target.value })}
          required
        />
        <Input
          label="Registration Number"
          value={form.registrationNumber}
          onChange={(e) => set({ registrationNumber: e.target.value })}
          required
        />
        <Input
          label="NTN"
          value={form.ntn}
          onChange={(e) => set({ ntn: e.target.value })}
          required
        />
        <label className="block space-y-1.5 text-sm text-foreground">
          <span className="font-medium">Administration Level *</span>
          <select
            className={fieldClass()}
            value={form.administrationLevel}
            onChange={(e) => set({ administrationLevel: e.target.value })}
            required
          >
            <option value="">Select level</option>
            {ADMINISTRATION_LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  if (section === "administrative") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Ministry"
          value={form.ministry}
          onChange={(e) => set({ ministry: e.target.value })}
          required
        />
        <Input
          label="Division"
          value={form.division}
          onChange={(e) => set({ division: e.target.value })}
          required
        />
        <label className="block space-y-1.5 text-sm text-foreground">
          <span className="font-medium">Province *</span>
          <select
            className={fieldClass()}
            value={form.adminProvince}
            onChange={(e) => set({ adminProvince: e.target.value })}
            required
          >
            <option value="">Select province</option>
            {ORG_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  if (section === "address") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5 text-sm text-foreground">
          <span className="font-medium">Country *</span>
          <select
            className={fieldClass()}
            value={form.country}
            onChange={(e) => set({ country: e.target.value })}
            required
          >
            <option value="">Select country</option>
            {ORG_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5 text-sm text-foreground">
          <span className="font-medium">Province / State *</span>
          <select
            className={fieldClass()}
            value={form.provinceState}
            onChange={(e) => set({ provinceState: e.target.value })}
            required
          >
            <option value="">Select province/state</option>
            {ORG_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="District"
          value={form.district}
          onChange={(e) => set({ district: e.target.value })}
          required
        />
        <Input
          label="Tehsil"
          value={form.tehsil}
          onChange={(e) => set({ tehsil: e.target.value })}
          required
        />
        <div className="sm:col-span-2">
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => set({ address: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block space-y-1.5 text-sm text-foreground">
            <span className="font-medium">About *</span>
            <textarea
              className={`min-h-24 ${fieldClass()}`}
              value={form.about}
              onChange={(e) => set({ about: e.target.value })}
              required
            />
          </label>
        </div>
      </div>
    );
  }

  if (section === "leadership") {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="CEO Name"
          value={form.ceoName}
          onChange={(e) => set({ ceoName: e.target.value })}
          required
        />
        <Input
          label="CEO Number"
          value={form.ceoNumber}
          onChange={(e) => set({ ceoNumber: e.target.value })}
          required
        />
        <Input
          label="Focal Person Name"
          value={form.focalPersonName}
          onChange={(e) => set({ focalPersonName: e.target.value })}
          required
        />
        <Input
          label="Focal Person Number"
          value={form.focalPersonPhone}
          onChange={(e) => set({ focalPersonPhone: e.target.value })}
          required
        />
        <Input
          label="Focal Person Designation"
          value={form.focalPersonDesignation}
          onChange={(e) => set({ focalPersonDesignation: e.target.value })}
          required
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Website"
        value={form.website}
        onChange={(e) => set({ website: e.target.value })}
        placeholder="https://"
        required
      />
      <Input
        label="Fax Number"
        value={form.faxNumber}
        onChange={(e) => set({ faxNumber: e.target.value })}
        required
      />
      <div className="sm:col-span-2">
        <label className="block space-y-1.5 text-sm text-foreground">
          <span className="font-medium">Vision *</span>
          <textarea
            className={`min-h-24 ${fieldClass()}`}
            value={form.vision}
            onChange={(e) => set({ vision: e.target.value })}
            required
          />
        </label>
      </div>
      <div className="sm:col-span-2">
        <Input
          label="Logo URL"
          hint="Paste an image URL. It will show on your job posts."
          value={form.logoUrl || ""}
          onChange={(e) => set({ logoUrl: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <OrgLogo
          name={form.organizationName || "Organization"}
          logoUrl={form.logoUrl}
          size="lg"
        />
        <p className="text-xs text-muted">Logo preview</p>
      </div>
    </div>
  );
}
