type Props = {
  title: string;
  status: string;
};

export default function IssueCard({ title, status }: Props) {
  return (
    <div className="issue-card">
      <h3>{title}</h3>
      <p>{status}</p>
    </div>
  );
}