/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE}/contact`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Success from backend
      toast.success(response.data.message || "Message sent successfully! We'll reply soon.");
      
      // Reset form
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      // Error handling
      const errorMsg = 
        error.response?.data?.message || 
        error.message || 
        'Failed to send message. Please try again.';

      toast.error('Sending Failed', {
        description: errorMsg,
        duration: 6000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl mt-5 font-bold text-gray-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help. Reach out via any channel — our team responds fast.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Full Name"
                  required
                  disabled={submitting}
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none disabled:opacity-70"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  disabled={submitting}
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none disabled:opacity-70"
                />
              </div>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (optional)"
                disabled={submitting}
                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none disabled:opacity-70"
              />

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                disabled={submitting}
                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none disabled:opacity-70"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="How can we help you today?"
                required
                disabled={submitting}
                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all resize-none outline-none disabled:opacity-70"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-5 rounded-xl flex items-center justify-center gap-3 text-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-6 w-6" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone Support</p>
                    <p className="text-2xl font-bold text-green-500 mt-1">+2348166489562</p>
                    <p className="text-gray-500 mt-1">24/7 Dedicated Line</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-xl text-green-500 mt-1">support@codequor.com</p>
                    <p className="text-gray-500 mt-1">Average response: 30 mins</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Support Hours</p>
                    <p className="text-gray-700 mt-1 leading-relaxed">
                      Monday - Sunday: 24 hours<br />
                      We're always here for you
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badge Card */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl shadow-2xl p-8 text-white text-center">
              <CheckCircle className="h-16 w-16 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Licensed & Regulated</h3>
              <p className="opacity-90 leading-relaxed">
                CBN Licensed Digital Bank • NDIC Insured • PCI DSS Compliant
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;