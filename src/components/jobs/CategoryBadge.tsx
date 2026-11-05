import { StatusBadge } from "./StatusBadge";
import { categoryTone } from "@/lib/jobs";

export function CategoryBadge({ category }: { category?: string }) {
  if (!category) return null;
  return <StatusBadge label={category} tone={categoryTone(category)} />;
}
