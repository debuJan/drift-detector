"use client";
import { useState } from "react";

const SAMPLE_PLAN = `You are a research assistant. You may ONLY:
- Read files in the project folder
- Search the web for public information
You must NOT run shell commands, edit files, or fetch private URLs.`;

const SAMPLE_LOG = `Read package.json
Read README.md
WebSearch "Next.js 14 docs"
Bash rm -rf /tmp/cache
WebFetch https://unknown-private-url.example.com/data
Read src/index.ts`;

type Row = { call: string; verdict: "IN PLAN" | "DRIFT"; reason: string };
type Result = { overall: string; driftPercent: number; rows: Row[] };

export default function Home() {
  const [plan, setPlan] = useState(SAMPLE_PLAN);
  const [log, setLog] = useState(SAMPLE_LOG);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        body: JSON.stringify({ log, plan }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Drift <span>Detector</span></h1>
      <p className="sub">
        AI agents declare a plan, then call tools. Paste the plan and the tool-call log —
        Drift Detector flags every call that went off-plan.
      </p>
      <div className="grid">
        <div>
          <label>Agent&apos;s declared plan</label>
          <textarea onChange={(e) => setPlan(e.target.value)} value={plan} />
        </div>
        <div>
          <label>Tool-call log (one call per line)</label>
          <textarea onChange={(e) => setLog(e.target.value)} value={log} />
        </div>
      </div>
      <button className="analyze" disabled={loading} onClick={analyze}>
        {loading ? "Analyzing…" : "Analyze for drift"}
      </button>
      {error && <div className="error">{error}</div>}
      {result && (
        <div className="results">
          <div className={`verdict ${result.overall === "Clean" ? "clean" : "drift"}`}>
            {result.overall === "Clean" ? "✓ Clean — no drift detected" : "⚠ Drift detected"} · {result.driftPercent}% of calls off-plan
          </div>
          <table>
            <thead>
              <tr><th>Tool call</th><th>Verdict</th><th>Why</th></tr>
            </thead>
            <tbody>
              {result.rows.map((r, i) => (
                <tr key={i}>
                  <td className="call">{r.call}</td>
                  <td><span className={`badge ${r.verdict === "IN PLAN" ? "inplan" : "drift"}`}>{r.verdict}</span></td>
                  <td>{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <footer>Built with ArmorClaude and ArmorOpenCode on.</footer>
    </main>
  );
}
