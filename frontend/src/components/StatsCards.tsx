import { useEffect, useState } from "react";
import axios from "axios";

type Issue = {
  id: number;
  severity: string;
  votes: number;
};

export default function StatsCards() {
  const [issues, setIssues] = useState<Issue[]>([]);

  const loadData = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/issues");
      setIssues(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalIssues = issues.length;

  const highPriority = issues.filter(
    (issue) => issue.severity === "High"
  ).length;

  const totalVotes = issues.reduce(
    (sum, issue) => sum + (issue.votes || 0),
    0
  );

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <h2>{totalIssues}</h2>
        <span>Total Issues</span>
      </div>

      <div className="stat-card">
        <h2>{highPriority}</h2>
        <span>High Priority</span>
      </div>

      <div className="stat-card">
        <h2>{totalIssues}</h2>
        <span>Verified Issues</span>
      </div>

      <div className="stat-card">
        <h2>{totalVotes}</h2>
        <span>Community Votes</span>
      </div>
    </div>
  );
}