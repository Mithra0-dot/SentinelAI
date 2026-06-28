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
  priority: number;
  repair_verified: number;
repair_confidence: number;
};
export default function IssueMap() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [recommendations, setRecommendations] = useState<any>({});
  const [repairFiles, setRepairFiles] = useState<any>({});
  const [repairResults, setRepairResults] = useState<any>({});

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
  const fetchRecommendation = async (id: number) => {
  try {
    const res = await axios.get(
      `http://127.0.0.1:8000/recommendation/${id}`
    );

    setRecommendations((prev) => ({
      ...prev,
      [id]: res.data.recommendation,
    }));
  } catch (err) {
    console.log(err);
  }
};
const verifyRepair = async (id: number) => {
  if (!repairFiles[id]) {
    alert("Please choose an after-repair image first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", repairFiles[id]);

  try {
    const res = await axios.post(
      `http://127.0.0.1:8000/verify-repair/${id}`,
      formData
    );

    setRepairResults((prev: any) => ({
      ...prev,
      [id]: res.data.analysis,
    }));
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
const totalIssues = issues.length;

const highPriority = issues.filter(
  (i) => i.priority >= 120
).length;

const resolved = issues.filter(
  (i) => i.status === "Resolved"
).length;

const avgConfidence =
  issues.length > 0
    ? Math.round(
        issues.reduce(
          (sum, i) => sum + i.confidence,
          0
        ) / issues.length
      )
    : 0;
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
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
    gap: "18px",
    marginBottom: "25px",
  }}
>

  <div
    style={{
      background: "#2563eb",
      color: "white",
      borderRadius: "18px",
      padding: "22px",
      textAlign: "center",
    }}
  >
    <h1>{totalIssues}</h1>
    <p>📍 Total Issues</p>
  </div>

  <div
    style={{
      background: "#dc2626",
      color: "white",
      borderRadius: "18px",
      padding: "22px",
      textAlign: "center",
    }}
  >
    <h1>{highPriority}</h1>
    <p>🚨 High Priority</p>
  </div>

  <div
    style={{
      background: "#16a34a",
      color: "white",
      borderRadius: "18px",
      padding: "22px",
      textAlign: "center",
    }}
  >
    <h1>{resolved}</h1>
    <p>✅ Resolved</p>
  </div>

  <div
    style={{
      background: "#7c3aed",
      color: "white",
      borderRadius: "18px",
      padding: "22px",
      textAlign: "center",
    }}
  >
    <h1>{avgConfidence}%</h1>
    <p>🧠 AI Confidence</p>
  </div>

</div>      
<div
  style={{
    background: "#111827",
    color: "white",
    padding: "22px",
    borderRadius: "18px",
    marginBottom: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
  }}
>
  <h2
    style={{
      marginBottom: "18px",
      textAlign: "center",
    }}
  >
    🚨 AI Priority Dashboard
  </h2>

  {[...issues]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5)
    .map((issue) => {
      let color = "#22c55e";
      let label = "Low";

      if (issue.priority >= 140) {
        color = "#ef4444";
        label = "Critical";
      } else if (issue.priority >= 120) {
        color = "#f97316";
        label = "High";
      } else if (issue.priority >= 100) {
        color = "#eab308";
        label = "Medium";
      }

      return (
        <div
          key={issue.id}
          style={{
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                {issue.issue === "road damage"
  ? "🛣️ Road Damage"
  : issue.issue === "garbage"
  ? "🗑️ Garbage"
  : issue.issue === "water leakage"
  ? "💧 Water Leakage"
  : issue.issue === "broken streetlight"
  ? "💡 Broken Streetlight"
  : `📍 ${issue.issue}`}
              </div>

              <div
                style={{
                  fontSize: "13px",
                  color: "#9ca3af",
                }}
              >
                Confidence: {issue.confidence}% • 👍 {issue.votes} Votes
              </div>
            </div>

            <span
              style={{
                background: color,
                color: "white",
                padding: "5px 12px",
                borderRadius: "10px",
                fontWeight: "bold",
              }}
            >
              {label}
            </span>
          </div>

          <div
            style={{
              width: "100%",
              height: "10px",
              background: "#374151",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(issue.priority, 150) / 1.5}%`,
                height: "100%",
                background: color,
                transition: "0.4s",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "6px",
              textAlign: "right",
              fontSize: "13px",
              color: "#d1d5db",
            }}
          >
            AI Score: <b>{issue.priority}</b>
          </div>
        </div>
      );
    })}
</div>

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
  <button onClick={() => fetchRecommendation(issue.id)}>
  🤖 Get AI Recommendation
</button>
<div style={{ marginTop: "10px", background: "#111827", padding: "10px", borderRadius: "10px" }}>
  {recommendations[issue.id] && (
  <div
    style={{
      marginTop: "10px",
      background: "#111827",
      color: "white",
      padding: "12px",
      borderRadius: "10px",
    }}
  >
    <h4>🤖 AI Recommendation</h4>

    <p><b>Department:</b> {recommendations[issue.id].department}</p>

    <p><b>Action:</b> {recommendations[issue.id].recommended_action}</p>

    <p><b>Urgency:</b> {recommendations[issue.id].urgency}</p>

    <p><b>Estimated Time:</b> {recommendations[issue.id].estimated_time}</p>

    <p><b>Citizen Advice:</b> {recommendations[issue.id].citizen_advice}</p>
  </div>
)}
</div>
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
  <input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setRepairFiles((prev: any) => ({
      ...prev,
      [issue.id]: e.target.files?.[0],
    }))
  }
/>

<button
  onClick={() => verifyRepair(issue.id)}
>
  🤖 Verify Repair
</button>
{repairResults[issue.id] && (
  <div
    style={{
      marginTop: "10px",
      background: "#111827",
      color: "white",
      padding: "10px",
      borderRadius: "8px",
    }}
  >
    <p>
      <b>Status:</b>{" "}
      {repairResults[issue.id].repair_status}
    </p>

    <p>
      <b>Confidence:</b>{" "}
      {repairResults[issue.id].confidence}%
    </p>

    <p>
      <b>Reason:</b>{" "}
      {repairResults[issue.id].reason}
    </p>
  </div>
)}
</Popup>

          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}