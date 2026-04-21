import { PageHeader } from "../../components/page-header";
import { LoginForm } from "../../components/login-form";

export default function LoginPage() {
  return (
    <div className="page-grid">
      <PageHeader
        title="Login"
        subtitle="Supabase auth will control company-scoped access for admins, supervisors, and agents."
      />
      <LoginForm />
    </div>
  );
}
