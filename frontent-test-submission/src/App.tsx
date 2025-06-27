import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import UrlShortenerForm from "./UrlShortenerForm";
import ShortenResults from "./ShortenResults";
import StatisticsPage from "./StatisticsPage";
import "./App.css";

import type { ShortUrlResult } from "./ShortenResults";

function App() {
  const [results, setResults] = useState<ShortUrlResult[]>([]);
  return (
    <Router>
      <div className="App">
        <nav style={{ marginBottom: 24 }}>
          <Link to="/">Shorten URLs</Link> | <Link to="/stats">Statistics</Link>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <UrlShortenerForm onResults={setResults} />
                <ShortenResults results={results} />
              </>
            }
          />
          <Route path="/stats" element={<StatisticsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
