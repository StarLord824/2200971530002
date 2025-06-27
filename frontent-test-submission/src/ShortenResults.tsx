interface ShortUrlResult {
  originalUrl: string;
  shortUrl: string;
  expiry: string;
}

export default function ShortenResults({
  results,
}: {
  results: ShortUrlResult[];
}) {
  if (!results.length) return null;
  return (
    <div>
      <h3>Shortened URLs</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Shortened URL</th>
            <th>Expiry</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => (
            <tr key={i}>
              <td>{r.originalUrl}</td>
              <td>
                <a href={r.shortUrl} target="_blank" rel="noopener noreferrer">
                  {r.shortUrl}
                </a>
              </td>
              <td>{r.expiry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
