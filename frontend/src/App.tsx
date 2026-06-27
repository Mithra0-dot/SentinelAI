import ReportIssue from "./pages/ReportIssue";
import IssueMap from "./pages/IssueMap";
import StatsCards from "./components/StatsCards";
import "./index.css";

export default function App() {
  return (
    <div className="app">
      <header className="hero">
        <h1>SENTINEL AI</h1>
        <p>Hyperlocal Civic Intelligence Platform</p>
      </header>

      <StatsCards />

      <ReportIssue />

      <IssueMap />
    </div>
  );
}