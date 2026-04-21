import { PageHeader } from "../../components/page-header";
import { billingPlans } from "../../lib/mock-data";

export default function BillingPage() {
  return (
    <div className="page-grid">
      <PageHeader
        title="Billing"
        subtitle="Seat-based SaaS billing, usage tracking for calls and AI minutes, and Stripe-ready plan management."
        rightSlot={<div className="pill">Stripe</div>}
      />
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2 className="panel-title">Subscription Plans</h2>
            <p className="panel-subtitle">Usage should cover seats, calls, minutes, and AI consumption.</p>
          </div>
        </div>
        <div className="panel-body">
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Seats</th>
                <th>Voice Minutes</th>
                <th>AI Minutes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {billingPlans.map((plan) => (
                <tr key={plan.plan}>
                  <td>{plan.plan}</td>
                  <td>{plan.seats}</td>
                  <td>{plan.voiceMinutes}</td>
                  <td>{plan.aiMinutes}</td>
                  <td><span className="badge purple">{plan.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

