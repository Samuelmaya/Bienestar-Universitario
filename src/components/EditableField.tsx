import { useState, useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type EditableFieldType = "text" | "textarea" | "select" | "date" | "number";

export interface EditableFieldProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: EditableFieldType;
  options?: string[];
  hint?: string;
  maxLength?: number;
  placeholder?: string;
  fullWidth?: boolean;
}

export function EditableField({
  icon: Icon,
  label,
  value,
  onChange,
  type = "text",
  options,
  hint,
  maxLength,
  placeholder = "—",
  fullWidth = false,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const handleSave = () => {
    onChange(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "textarea") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-lg border border-border bg-background/60 p-4 transition-colors hover:border-primary/40",
        fullWidth && "md:col-span-2",
      )}
    >
      <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>

        {!editing ? (
          <dd
            className={cn(
              "text-sm font-medium text-foreground",
              type === "textarea" ? "mt-1 whitespace-pre-wrap leading-relaxed" : "truncate",
            )}
          >
            {value || placeholder}
          </dd>
        ) : type === "textarea" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            maxLength={maxLength}
            rows={5}
            className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        ) : type === "select" && options ? (
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">— Seleccione —</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={type === "date" ? "date" : type === "number" ? "number" : "text"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKey}
            maxLength={maxLength}
            className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        )}

        {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
        {editing && maxLength && (
          <p className="mt-1 text-[11px] text-muted-foreground">
            {draft.length}/{maxLength} caracteres
          </p>
        )}
      </div>

      {!editing ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100 focus:opacity-100"
          aria-label={`Editar ${label}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      ) : (
        <div className="absolute right-2 top-2 flex gap-1">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground hover:opacity-90"
            aria-label="Guardar"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-input bg-background hover:bg-accent"
            aria-label="Cancelar"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
