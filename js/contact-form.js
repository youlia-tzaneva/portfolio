document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact__form");
  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const statusEl = form.querySelector(".form-status");
  const defaultButtonLabel = submitButton.textContent;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    statusEl.textContent = "";
    statusEl.className = "form-status";

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/youlia.tzaneva@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `Portfolio message from ${name}`,
            _replyto: email,
            _captcha: "false",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Send failed");
      }

      form.reset();
      statusEl.textContent = "Thanks! Your message has been sent.";
      statusEl.classList.add("form-status--success");
    } catch {
      statusEl.textContent =
        "Something went wrong. Please try again or email me directly.";
      statusEl.classList.add("form-status--error");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = defaultButtonLabel;
    }
  });
});
