import { PageHeader } from "../../components/page-header";

export default function DeploymentPage() {
  return (
    <div className="page-grid">
      <PageHeader
        title="Deploy Guide"
        subtitle="The repo now includes a step-by-step deployment guide written in very simple language."
      />
      <section className="panel">
        <div className="panel-body">
          <div className="callout">
            Open <code>docs/DEPLOYMENT_GUIDE.md</code> to follow the setup in order: install tools,
            set env vars, start the API, start the web app, connect Telnyx, add campaigns, then test the dialer.
          </div>
        </div>
      </section>
    </div>
  );
}
