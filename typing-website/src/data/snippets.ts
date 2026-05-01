export interface Snippet {
  id: string;
  title: string;
  code: string;
}

export interface Language {
  id: string;
  name: string;
  icon: string;
  snippets: Snippet[];
}

const python: Language = {
  id: "python",
  name: "Python",
  icon: "🐍",
  snippets: [
    { id: "py1", title: "List Comprehension", code: `result = [x ** 2 for x in range(10) if x % 2 == 0]` },
    { id: "py2", title: "Dictionary", code: `config = {"host": "localhost", "port": 8080, "debug": True}` },
    { id: "py3", title: "Function", code: `def fibonacci(n: int) -> int:\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)` },
    { id: "py4", title: "Class", code: `class Database:\n    def __init__(self, url: str):\n        self._url = url\n        self._conn = None\n\n    async def connect(self):\n        self._conn = await create_connection(self._url)` },
    { id: "py5", title: "Decorator", code: `def cache(func):\n    _cache = {}\n    def wrapper(*args):\n        if args not in _cache:\n            _cache[args] = func(*args)\n        return _cache[args]\n    return wrapper` },
  ],
};

const javascript: Language = {
  id: "javascript",
  name: "JavaScript",
  icon: "⚡",
  snippets: [
    { id: "js1", title: "Arrow Function", code: `const greet = (name) => \`Hello, \${name}!\`;` },
    { id: "js2", title: "Destructuring", code: `const { data, error, loading } = useFetch("/api/users");` },
    { id: "js3", title: "Promise Chain", code: `fetch("/api/data")\n  .then((res) => res.json())\n  .then((data) => console.log(data))\n  .catch((err) => console.error(err));` },
    { id: "js4", title: "Array Methods", code: `const active = users\n  .filter((u) => u.active)\n  .map((u) => u.name)\n  .sort((a, b) => a.localeCompare(b));` },
    { id: "js5", title: "Async/Await", code: `async function getData(url) {\n  try {\n    const response = await fetch(url);\n    const json = await response.json();\n    return json;\n  } catch (error) {\n    console.error("Failed:", error);\n  }\n}` },
  ],
};

const typescript: Language = {
  id: "typescript",
  name: "TypeScript",
  icon: "🔷",
  snippets: [
    { id: "ts1", title: "Interface", code: `interface User {\n  id: string;\n  name: string;\n  email: string;\n  role: "admin" | "user";\n}` },
    { id: "ts2", title: "Generic Function", code: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {\n  return obj[key];\n}` },
    { id: "ts3", title: "Type Guard", code: `function isString(value: unknown): value is string {\n  return typeof value === "string";\n}` },
    { id: "ts4", title: "Mapped Type", code: `type Readonly<T> = {\n  readonly [P in keyof T]: T[P];\n};` },
    { id: "ts5", title: "Enum", code: `enum Status {\n  Pending = "PENDING",\n  Active = "ACTIVE",\n  Disabled = "DISABLED",\n}` },
  ],
};

const rust: Language = {
  id: "rust",
  name: "Rust",
  icon: "🦀",
  snippets: [
    { id: "rs1", title: "Match Expression", code: `match status {\n    Status::Active => println!("Running"),\n    Status::Error(e) => eprintln!("Error: {}", e),\n    _ => println!("Unknown"),\n}` },
    { id: "rs2", title: "Struct", code: `struct Config {\n    host: String,\n    port: u16,\n    workers: usize,\n}` },
    { id: "rs3", title: "Result Handling", code: `fn read_file(path: &str) -> Result<String, io::Error> {\n    let content = fs::read_to_string(path)?;\n    Ok(content.trim().to_string())\n}` },
    { id: "rs4", title: "Iterator", code: `let sum: i32 = (1..=100)\n    .filter(|x| x % 2 == 0)\n    .map(|x| x * x)\n    .sum();` },
  ],
};

const go: Language = {
  id: "go",
  name: "Go",
  icon: "🐹",
  snippets: [
    { id: "go1", title: "HTTP Handler", code: `func handleGet(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set("Content-Type", "application/json")\n    json.NewEncoder(w).Encode(data)\n}` },
    { id: "go2", title: "Goroutine", code: `go func() {\n    for msg := range ch {\n        fmt.Println("Received:", msg)\n    }\n}()` },
    { id: "go3", title: "Error Handling", code: `result, err := doSomething()\nif err != nil {\n    log.Fatalf("failed: %v", err)\n}` },
    { id: "go4", title: "Struct & Method", code: `type Server struct {\n    Addr string\n    Port int\n}\n\nfunc (s *Server) Start() error {\n    return http.ListenAndServe(fmt.Sprintf("%s:%d", s.Addr, s.Port), nil)\n}` },
  ],
};

const cpp: Language = {
  id: "cpp",
  name: "C++",
  icon: "⚙️",
  snippets: [
    { id: "cpp1", title: "Vector Operations", code: `std::vector<int> nums = {3, 1, 4, 1, 5};\nstd::sort(nums.begin(), nums.end());\nauto it = std::find(nums.begin(), nums.end(), 4);` },
    { id: "cpp2", title: "Smart Pointer", code: `auto ptr = std::make_unique<Widget>(42);\nstd::shared_ptr<Config> config = std::make_shared<Config>();` },
    { id: "cpp3", title: "Lambda", code: `auto compare = [](const auto& a, const auto& b) {\n    return a.priority > b.priority;\n};` },
  ],
};

const java: Language = {
  id: "java",
  name: "Java",
  icon: "☕",
  snippets: [
    { id: "java1", title: "Stream API", code: `List<String> names = users.stream()\n    .filter(u -> u.isActive())\n    .map(User::getName)\n    .collect(Collectors.toList());` },
    { id: "java2", title: "Optional", code: `Optional<User> user = repository.findById(id);\nString name = user\n    .map(User::getName)\n    .orElse("Unknown");` },
    { id: "java3", title: "Record", code: `public record Point(double x, double y) {\n    public double distance(Point other) {\n        return Math.sqrt(Math.pow(x - other.x, 2) + Math.pow(y - other.y, 2));\n    }\n}` },
  ],
};

const sql: Language = {
  id: "sql",
  name: "SQL",
  icon: "🗄️",
  snippets: [
    { id: "sql1", title: "Join Query", code: `SELECT u.name, COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE u.active = true\nGROUP BY u.name\nHAVING COUNT(o.id) > 5\nORDER BY order_count DESC;` },
    { id: "sql2", title: "CTE", code: `WITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn\n  FROM employees\n)\nSELECT * FROM ranked WHERE rn <= 3;` },
  ],
};

const react: Language = {
  id: "react",
  name: "React",
  icon: "⚛️",
  snippets: [
    { id: "jsx1", title: "Component", code: `export function Card({ title, children }: CardProps) {\n  return (\n    <div className="rounded-lg border p-4">\n      <h3 className="text-lg font-bold">{title}</h3>\n      <div className="mt-2">{children}</div>\n    </div>\n  );\n}` },
    { id: "jsx2", title: "useState Hook", code: `const [count, setCount] = useState(0);\nconst [items, setItems] = useState<Item[]>([]);` },
    { id: "jsx3", title: "useEffect", code: `useEffect(() => {\n  const controller = new AbortController();\n  fetch("/api/data", { signal: controller.signal })\n    .then((res) => res.json())\n    .then(setData);\n  return () => controller.abort();\n}, []);` },
  ],
};

const bash: Language = {
  id: "bash",
  name: "Bash",
  icon: "💻",
  snippets: [
    { id: "sh1", title: "Loop", code: `for file in *.log; do\n  echo "Processing $file"\n  gzip "$file"\ndone` },
    { id: "sh2", title: "Conditionals", code: `if [ -f "$CONFIG_FILE" ]; then\n  source "$CONFIG_FILE"\nelse\n  echo "Config not found" >&2\n  exit 1\nfi` },
    { id: "sh3", title: "Pipe Chain", code: `cat access.log | grep "POST" | awk '{print $1}' | sort | uniq -c | sort -rn | head -10` },
  ],
};

const html: Language = {
  id: "html",
  name: "HTML",
  icon: "🌐",
  snippets: [
    { id: "html1", title: "Form", code: `<form action="/submit" method="POST">\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required />\n  <button type="submit">Send</button>\n</form>` },
    { id: "html2", title: "Semantic Layout", code: `<header>\n  <nav aria-label="Main">\n    <a href="/">Home</a>\n    <a href="/about">About</a>\n  </nav>\n</header>\n<main>\n  <article>\n    <h1>Title</h1>\n    <p>Content goes here.</p>\n  </article>\n</main>` },
  ],
};

const css: Language = {
  id: "css",
  name: "CSS",
  icon: "🎨",
  snippets: [
    { id: "css1", title: "Grid Layout", code: `.container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1.5rem;\n  padding: 2rem;\n}` },
    { id: "css2", title: "Custom Properties", code: `:root {\n  --color-primary: #3b82f6;\n  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);\n}\n\n.card {\n  background: var(--color-primary);\n  box-shadow: var(--shadow-lg);\n}` },
  ],
};

const json: Language = {
  id: "json",
  name: "JSON",
  icon: "📋",
  snippets: [
    { id: "json1", title: "Package Config", code: `{\n  "name": "my-app",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "tsc && vite build",\n    "preview": "vite preview"\n  }\n}` },
  ],
};

const yaml: Language = {
  id: "yaml",
  name: "YAML",
  icon: "📄",
  snippets: [
    { id: "yaml1", title: "Docker Compose", code: `version: "3.8"\nservices:\n  web:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - NODE_ENV=production\n    depends_on:\n      - db\n  db:\n    image: postgres:15\n    volumes:\n      - pgdata:/var/lib/postgresql/data` },
  ],
};

export const languages: Language[] = [
  python, javascript, typescript, rust, go, cpp, java, sql, react, bash, html, css, json, yaml,
];

export const specialCharSnippets: Snippet[] = [
  { id: "sp1", title: "Brackets Basics", code: `{ } [ ] ( ) < >` },
  { id: "sp2", title: "Operators", code: `=> -> !== === && || ??` },
  { id: "sp3", title: "Common Symbols", code: `* & | ! ? ; : = # @ $` },
  { id: "sp4", title: "Comments & Escapes", code: `// /* */ # "\\n" "\\t" "\\r"` },
  { id: "sp5", title: "Template Literals", code: "const msg = `Hello ${name}, you have ${count} items`;" },
  { id: "sp6", title: "Mixed Symbols", code: `if (arr[i] !== null && obj?.key) { result += val * (1 - rate); }` },
  { id: "sp7", title: "Arrow Functions", code: `const fn = (a: number, b: number): number => { return a ** b; };` },
  { id: "sp8", title: "Regex Pattern", code: `const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/;` },
  { id: "sp9", title: "Destructuring", code: `const { data: { users = [] }, error } = await fetchAPI("/v1/users?limit=10&offset=0");` },
  { id: "sp10", title: "Type Annotation", code: `type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };` },
];

export function getTestSnippet(variant: "code" | "symbols"): string {
  if (variant === "symbols") {
    const shuffled = [...specialCharSnippets].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3).map((s) => s.code).join("\n");
  }
  const allSnippets = languages.flatMap((l) => l.snippets);
  const shuffled = [...allSnippets].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((s) => s.code).join("\n");
}
