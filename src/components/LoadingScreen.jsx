import Logo from "./Logo";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <Logo className="app-logo app-logo-loading" />
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );
}
