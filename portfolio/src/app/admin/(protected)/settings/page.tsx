import { getSettings, type SettingKey } from "@/lib/content";
import { saveSettings } from "../../actions";

const fields: { key: SettingKey; label: string; rows?: number; hint?: string }[] = [
  { key: "name", label: "Your name" },
  { key: "role", label: "Role (shown in the hero code block)" },
  { key: "heroTitle", label: "Hero headline", rows: 2 },
  { key: "heroSub", label: "Hero sub-text", rows: 3 },
  { key: "heroBuilds", label: "What you build (one per line, shown in hero code block)", rows: 4 },
  { key: "aboutText", label: "About text (blank line between paragraphs)", rows: 8 },
  { key: "skills", label: "Skills", rows: 5, hint: "One group per line, like: Frontend: HTML, CSS, React" },
  { key: "photoUrl", label: "Photo URL", hint: "Put your photo in the public folder and use /photo.jpg, or paste an image link." },
  { key: "contactEmail", label: "Public contact email" },
  { key: "githubUrl", label: "GitHub URL" },
  { key: "linkedinUrl", label: "LinkedIn URL (optional)" },
];

export default async function AdminSettings() {
  const s = await getSettings();
  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-bold">Site settings</h1>
      <form action={saveSettings} className="mt-6 space-y-5">
        {fields.map((f) => (
          <div key={f.key}>
            <label htmlFor={f.key} className="mb-1.5 block text-sm font-medium">{f.label}</label>
            {f.rows ? (
              <textarea id={f.key} name={f.key} rows={f.rows} defaultValue={s[f.key]} className="input" />
            ) : (
              <input id={f.key} name={f.key} defaultValue={s[f.key]} className="input" />
            )}
            {f.hint && <p className="mt-1 text-sm text-muted">{f.hint}</p>}
          </div>
        ))}
        <button className="btn">Save settings</button>
      </form>
    </section>
  );
}
