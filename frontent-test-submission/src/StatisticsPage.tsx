import { useEffect, useState } from "react";

interface ShortUrlStats {
  shortUrl: string;
  created: string;
  expiry: string;
  clickCount: number;
  clicks: { timestamp: string; source: string; location: string }[];
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<ShortUrlStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8000/shorturls/stats");
        const data = await res.json();
        setStats(data);
      } catch {
        setStats([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;
  if (!stats.length) return <div>No statistics available.</div>;

  return (
    <div>
      <h2>Shortened URL Statistics</h2>
      {stats.map((s, i) => (
        <div
          key={i}
          style={{ border: "1px solid #ccc", marginBottom: 16, padding: 12 }}
        >
          <div>
            <b>Short URL:</b>{" "}
            <a href={s.shortUrl} target="_blank" rel="noopener noreferrer">
              {s.shortUrl}
            </a>
          </div>
          <div>
            <b>Created:</b> {s.created}
          </div>
          <div>
            <b>Expiry:</b> {s.expiry}
          </div>
          <div>
            <b>Total Clicks:</b> {s.clickCount}
          </div>
          <details>
            <summary>Click Details</summary>
            {s.clicks.length === 0 ? (
              <div>No clicks yet.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Source</th>
                    <th>Location</th>
                  </tr>
                </thead>
                <tbody>
                  {s.clicks.map((c, j) => (
                    <tr key={j}>
                      <td>{c.timestamp}</td>
                      <td>{c.source}</td>
                      <td>{c.location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </details>
        </div>
      ))}
    </div>
  );
}
