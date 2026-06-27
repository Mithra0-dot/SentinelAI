import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import axios from "axios";
import L from "leaflet";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = new L.Icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Issue = {
  id: number;
  issue: string;
  description: string;
  severity: string;
  confidence: number;
  latitude: number;
  longitude: number;
  votes: number;
  status: string;
  image_path: string;
};
export default function IssueMap() {
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    fetchIssues();

    const interval = setInterval(() => {
      fetchIssues();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchIssues = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/issues"
      );

      setIssues(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const voteIssue = async (id: number) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/vote/${id}`
      );

      fetchIssues();
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (
    id: number,
    status: string
  ) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/status/${id}/${status}`
      );

      fetchIssues();
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
        return "#22c55e";

      case "InProgress":
        return "#f59e0b";

      case "Verified":
        return "#3b82f6";

      default:
        return "#9ca3af";
    }
  };

  return (
    <div style={{ marginTop: "30px" }}>
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        🗺️ Live Civic Issue Map
      </h2>

      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={12}
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "18px",
        }}
      >
        <TileLayer
          attribution="&copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={defaultIcon}
          >
          
<Popup>
  {issue.image_path && (
    <img
      src={`http://127.0.0.1:8000/${issue.image_path}`}
      alt={issue.issue}
      style={{
        width: "220px",
        height: "140px",
        objectFit: "cover",
        borderRadius: "10px",
        marginBottom: "10px",
      }}
    />
  )}

  <h3>{issue.issue}</h3>

  <p>{issue.description}</p>

  <p>
    <b>Confidence:</b> {issue.confidence}%
  </p>

  <p>
    <span
      style={{
        background:
          issue.severity === "High"
            ? "#ef4444"
            : issue.severity === "Medium"
            ? "#f59e0b"
            : "#22c55e",
        color: "white",
        padding: "4px 10px",
        borderRadius: "8px",
        fontWeight: "bold",
      }}
    >
      {issue.severity}
    </span>
  </p>

  <p>
    <b>Status:</b>{" "}
    <span
      style={{
        color: getStatusColor(issue.status),
        fontWeight: "bold",
      }}
    >
      {issue.status}
    </span>
  </p>

  <p>
    👍 Votes: <b>{issue.votes}</b>
  </p>

  <button onClick={() => voteIssue(issue.id)}>
    👍 Upvote
  </button>

  <div className="popup-buttons">
    <button onClick={() => updateStatus(issue.id, "Verified")}>
      Verified
    </button>

    <button onClick={() => updateStatus(issue.id, "InProgress")}>
      In Progress
    </button>

    <button onClick={() => updateStatus(issue.id, "Resolved")}>
      Resolve
    </button>
  </div>
</Popup>

          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}