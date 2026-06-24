import logoSrc from "../logo.png";

export default function Logo({ className = "app-logo" }) {
  return <img src={logoSrc} alt="MedCare" className={className} />;
}
