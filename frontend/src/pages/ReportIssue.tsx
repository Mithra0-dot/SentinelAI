import { useState } from "react";
import axios from "axios";

export default function ReportIssue() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFile = e.target.files[0];

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const getLocation = (): Promise<{
    lat: number;
    lng: number;
  }> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => reject(error)
      );
    });
  };

  const analyzeImage = async () => {
    if (!file) {
      alert("Please select an image first.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let location = {
        lat: 13.0827,
        lng: 80.2707,
      };

      try {
        location = await getLocation();
      } catch (err) {
        console.log(
          "Location unavailable. Using Chennai fallback."
        );
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("lat", String(location.lat));
      formData.append("lng", String(location.lng));

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-image",
        formData
      );

      console.log("SUCCESS:", response.data);

      const analysis = response.data.analysis;

      if (typeof analysis === "string") {
        setResult(analysis);
      } else {
        setResult(JSON.stringify(analysis, null, 2));
      }
    } catch (err: any) {
      console.error("FULL ERROR:", err);

      if (err.response) {
        console.error(
          "Backend Response:",
          err.response.data
        );
      }

      setResult("Backend Error. Check browser console.");
    }

    setLoading(false);
  };

  const parseJSON = (text: string) => {
    try {
      const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  };

  const data = result ? parseJSON(result) : null;

  return (
    <div className="report-container">
      <h1 className="title">
        📸 Smart Issue Reporting
      </h1>

      <div className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="preview"
          />
        )}

        <button
          onClick={analyzeImage}
          disabled={loading}
        >
          {loading
            ? "Analyzing AI..."
            : "Analyze Image"}
        </button>
      </div>

      {result && (
        <div className="result-card">
          <h2>AI Analysis</h2>

          {data ? (
            <>
              <p>
                <b>Issue:</b> {data.issue_type}
              </p>

              <p>
                <b>Severity:</b> {data.severity}
              </p>

              <p>
                <b>Description:</b>{" "}
                {data.description}
              </p>

              <p>
                <b>Confidence:</b>{" "}
                {data.confidence}%
              </p>
            </>
          ) : (
            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "lightgray",
              }}
            >
              {result}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}