export function getAuthErrorMessage(error) {
  const code = error?.code || "";

  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered. Please login instead.";
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "permission-denied":
      return "Firestore permission denied. In Firebase Console, set Firestore rules to allow users to write their own profile document.";
    default:
      return error?.message || "Something went wrong. Please try again.";
  }
}
