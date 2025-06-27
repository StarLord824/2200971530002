import axios from "axios";
import { useState } from "react";

interface UrlInput {
  originalUrl: string;
  validity: string;
  shortcode: string;
}

interface ShortUrlResult {
  originalUrl: string;
  shortUrl: string;
  expiry: string;
}

const urlRegex =
  /^(https?:\/\/)?([\w\\-]+\.)+[\w\\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

export default function UrlShortenerForm({
  onResults,
}: {
  onResults: (results: ShortUrlResult[]) => void;
}) {
  const [inputs, setInputs] = useState<UrlInput[]>([
    { originalUrl: "", validity: "", shortcode: "" },
  ]);
  const [errors, setErrors] = useState<string[][]>([[]]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    idx: number,
    field: keyof UrlInput,
    value: string
  ) => {
    const newInputs = [...inputs];
    newInputs[idx][field] = value;
    setInputs(newInputs);
  };

  const addInput = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { originalUrl: "", validity: "", shortcode: "" }]);
      setErrors([...errors, []]);
    }
  };

  const removeInput = (idx: number) => {
    setInputs(inputs.filter((_, i) => i !== idx));
    setErrors(errors.filter((_, i) => i !== idx));
  };

  const validate = (): boolean => {
    let valid = true;
    const newErrors: string[][] = [];
    inputs.forEach((input, idx) => {
      const errs: string[] = [];
      if (!input.originalUrl.trim()) {
        errs.push("URL is required.");
      } else if (!urlRegex.test(input.originalUrl.trim())) {
        errs.push("Invalid URL format.");
      }
      if (
        input.validity &&
        (!/^[0-9]+$/.test(input.validity) || parseInt(input.validity) <= 0)
      ) {
        errs.push("Validity must be a positive integer.");
      }
      newErrors[idx] = errs;
      if (errs.length > 0) valid = false;
    });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const results: ShortUrlResult[] = [];
      for (const input of inputs) {
        const res = await axios.post(
          "http://localhost:8000/shorturls",
          {
            url: input.originalUrl,
            validity: input.validity ? parseInt(input.validity) : undefined,
            shortcode: input.shortcode || undefined,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = res.data;
        results.push({
          originalUrl: input.originalUrl,
          shortUrl: data.short_url,
          expiry: data.expiry,
        });
      }
      onResults(results);
    } catch (err) {
      alert("Error creating short URLs"+ err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {inputs.map((input, idx) => (
        <div
          key={idx}
          style={{ border: "1px solid #ccc", padding: 12, marginBottom: 8 }}
        >
          <div>
            <label>
              Original URL:{" "}
              <input
                type="text"
                value={input.originalUrl}
                onChange={(e) =>
                  handleInputChange(idx, "originalUrl", e.target.value)
                }
              />
            </label>
          </div>
          <div>
            <label>
              Validity (minutes, optional):{" "}
              <input
                type="text"
                value={input.validity}
                onChange={(e) =>
                  handleInputChange(idx, "validity", e.target.value)
                }
              />
            </label>
          </div>
          <div>
            <label>
              Preferred Shortcode (optional):{" "}
              <input
                type="text"
                value={input.shortcode}
                onChange={(e) =>
                  handleInputChange(idx, "shortcode", e.target.value)
                }
              />
            </label>
          </div>
          {errors[idx] && errors[idx].length > 0 && (
            <ul style={{ color: "red" }}>
              {errors[idx].map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          )}
          {inputs.length > 1 && (
            <button type="button" onClick={() => removeInput(idx)}>
              Remove
            </button>
          )}
        </div>
      ))}
      {inputs.length < 5 && (
        <button type="button" onClick={addInput}>
          Add Another URL
        </button>
      )}
      <div>
        <button type="submit" disabled={loading}>
          {loading ? "Shortening..." : "Shorten URLs"}
        </button>
      </div>
    </form>
  );
}
