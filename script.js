const form = document.getElementById("contactForm");
const successBox = document.getElementById("success");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const messageInput = document.getElementById("message");
const counter = document.getElementById("count");

// Each rule returns an error message, or "" when the value is valid.
const rules = {
  name(v) {
    if (!v) return "Please enter your full name.";
    if (v.length < 3) return "Name must be at least 3 characters.";
    if (!/^[\p{L}\s.'-]+$/u.test(v)) return "Name can only contain letters and spaces.";
    return "";
  },
  email(v) {
    if (!v) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email, like name@example.com.";
    return "";
  },
  phone(v) {
    if (!v) return "Please enter your phone number.";
    if (!/^\+?[0-9\s-]+$/.test(v)) return "Phone can only contain digits, spaces, - and a leading +.";
    const digits = v.replace(/\D/g, "");
    if (digits.length < 8 || digits.length > 15) return "Phone must have between 8 and 15 digits.";
    return "";
  },
  subject(v) {
    if (!v) return "Please enter a subject.";
    if (v.length < 3) return "Subject must be at least 3 characters.";
    return "";
  },
  message(v) {
    if (!v) return "Please write your message.";
    if (v.length < 10) return `Message is too short. ${10 - v.length} more characters needed.`;
    return "";
  }
};

function validateField(input) {
  const field = input.closest(".field");
  const error = document.getElementById(`${input.id}-error`);
  const msg = rules[input.id](input.value.trim());

  error.textContent = msg;
  field.classList.toggle("invalid", Boolean(msg));
  field.classList.toggle("valid", !msg);
  input.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

const inputs = [...form.querySelectorAll("input, textarea")];

inputs.forEach((input) => {
  // Validate when leaving a field, then live while the user fixes it.
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => {
    if (input.closest(".field").classList.contains("invalid")) validateField(input);
  });
});

messageInput.addEventListener("input", () => {
  counter.textContent = messageInput.value.length;
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const results = inputs.map(validateField);
  if (results.includes(false)) {
    inputs[results.indexOf(false)].focus(); // jump to first invalid field
    return;
  }

  // Demo submit: simulate a network request.
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  submitBtn.querySelector(".btn-text").textContent = "Sending...";

  setTimeout(() => {
    document.getElementById("successName").textContent = document.getElementById("name").value.trim().split(" ")[0];
    form.hidden = true;
    successBox.hidden = false;
    successBox.querySelector("h2").focus?.();
  }, 1200);
});

resetBtn.addEventListener("click", () => {
  form.reset();
  inputs.forEach((i) => {
    i.closest(".field").classList.remove("valid", "invalid");
    i.removeAttribute("aria-invalid");
    document.getElementById(`${i.id}-error`).textContent = "";
  });
  counter.textContent = "0";
  submitBtn.disabled = false;
  submitBtn.classList.remove("loading");
  submitBtn.querySelector(".btn-text").textContent = "Send message";
  successBox.hidden = true;
  form.hidden = false;
  document.getElementById("name").focus();
});