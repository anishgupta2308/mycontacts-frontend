"use client";

import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Form validation
  const isFormValid =
    formData.firstname.trim() &&
    formData.lastname.trim() &&
    formData.email.trim() &&
    formData.phone.trim();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/contacts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ Contact saved successfully");
        setFormData({
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
        });
      } else {
        setMessage(result.message || "❌ Failed to save contact");
      }
    } catch (error) {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <input
            type="text"
            name="firstname"
            placeholder="Enter your first name"
            value={formData.firstname}
            onChange={handleChange}
          />

          <input
            type="text"
            name="lastname"
            placeholder="Enter your last name"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <input
            type="email"
            name="email"
            placeholder="Enter your work email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <h2>Schedule a Demo Call</h2>
        <p>Arrange a demo with a member of our team.</p>

        <button type="submit" disabled={!isFormValid || loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
}
