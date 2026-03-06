export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Induction Heat Treatment</h1>
        <p>Secure access for operator, supervisor, and admin.</p>
        <input placeholder="User ID" />
        <input placeholder="Password" type="password" />
        <button>Login</button>
      </div>
    </div>
  );
}
