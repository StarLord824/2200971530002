import { useState } from 'react';
import './App.css'

function App() {
  const API_Base= 'http://localhost:8000/shorturls'
  const [urls, setUrls] = useState([{ url: '', validity: '', shortcode: '' }]);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const handleChange = (index, key, value) => {
    const updated = [...urls];
    updated[index][key] = value;
    setUrls(updated);
  };

  const addInput = () => {
    if (urls.length < 5) setUrls([...urls, { url: '', validity: '', shortcode: '' }]);
  };

  const handleSubmit = async () => {
    const newResults = [];
    for (const item of urls) {
      if (!validateUrl(item.url)) {
        alert(`Invalid URL: ${item.url}`);
        continue;
      }

      const body = {
        url: item.url,
        ...(item.validity && { validity: parseInt(item.validity) }),
        ...(item.shortcode && { shortcode: item.shortcode })
      };

      const res = await fetch(`${API_BASE}/shorturls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok) newResults.push(data);
      else alert(data.error);
    }
    setResults(newResults);
    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await fetch(`${API_BASE}/shorturls`);
    const data = await res.json();
    setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="app">
      <h1>URL Shortener</h1>
      {urls.map((entry, i) => (
        <div key={i} className="input-row">
          <input placeholder="Original URL" value={entry.url} onChange={e => handleChange(i, 'url', e.target.value)} />
          <input placeholder="Validity (mins)" value={entry.validity} onChange={e => handleChange(i, 'validity', e.target.value)} />
          <input placeholder="Custom shortcode" value={entry.shortcode} onChange={e => handleChange(i, 'shortcode', e.target.value)} />
        </div>
      ))}
      <button onClick={addInput}>+ Add Another</button>
      <button onClick={handleSubmit}>Shorten</button>

      <h2>Shortened URLs</h2>
      {results.map((r, i) => (
        <div key={i} className="result">
          <p><strong>Short URL:</strong> <a href={r.shortLink} target="_blank" rel="noreferrer">{r.shortLink}</a></p>
          <p><strong>Expires:</strong> {new Date(r.expiry).toLocaleString()}</p>
        </div>
      ))}

      <h2>URL Statistics</h2>
      {history.map((h, i) => (
        <div key={i} className="stat">
          <p><strong>{h.shortcode}</strong> - {h.url}</p>
          <p>Created: {new Date(h.createdAt).toLocaleString()} | Expires: {new Date(h.expiry).toLocaleString()}</p>
          <p>Total Clicks: {h.totalClicks}</p>
          <ul>
            {h.clickData.map((click, idx) => (
              <li key={idx}>[{new Date(click.timestamp).toLocaleString()}] Referrer: {click.referrer}, Location: {click.location}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App
