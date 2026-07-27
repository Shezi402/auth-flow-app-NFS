// Lightweight validation - no extra dependency needed
const EMAIL_RE = /^\S+@\S+\.\S+$/;
// At least 8 chars, one uppercase, one lowercase, one number
const PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const validateSignup = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  if (!email || !EMAIL_RE.test(email)) {
    errors.push("A valid email is required");
  }
  if (!password || !PASSWORD_RE.test(password)) {
    errors.push(
      "Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number"
    );
  }

  if (errors.length) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !EMAIL_RE.test(email)) errors.push("A valid email is required");
  if (!password) errors.push("Password is required");

  if (errors.length) {
    return res.status(400).json({ message: "Validation failed", errors });
  }
  next();
};
