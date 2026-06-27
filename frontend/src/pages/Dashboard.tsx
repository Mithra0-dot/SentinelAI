import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import IssueCard from "../components/IssueCard";

export default function Dashboard() {
  return (
    <div className="container">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <div className="stats">
          <div className="stat-card">
            <h2>145</h2>
            <p>Total Issues</p>
          </div>

          <div className="stat-card">
            <h2>89</h2>
            <p>Resolved</p>
          </div>

          <div className="stat-card">
            <h2>56</h2>
            <p>Pending</p>
          </div>
        </div>

        <h2>Recent Issues</h2>

        <IssueCard
          title="Large Pothole Near Junction"
          status="Reported"
        />

        <IssueCard
          title="Broken Streetlight"
          status="In Progress"
        />

        <IssueCard
          title="Water Leakage"
          status="Resolved"
        />
      </div>
    </div>
  );
}