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

    // Simulate sending (replace with real backend call)
    setTimeout(() => {
      toast.success("Message sent successfully! We'll reply within 1 hour.");
      setSubmitting(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
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
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#09a353] focus:ring-4 focus:ring-[#09a353]/20 transition-all outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#09a353] focus:ring-4 focus:ring-[#09a353]/20 transition-all outline-none"
                />
              </div>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (optional)"
                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#09a353] focus:ring-4 focus:ring-[#09a353]/20 transition-all outline-none"
              />

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#09a353] focus:ring-4 focus:ring-[#09a353]/20 transition-all outline-none"
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="How can we help you today?"
                required
                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:border-[#09a353] focus:ring-4 focus:ring-[#09a353]/20 transition-all resize-none outline-none"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#09a353] hover:bg-[#0a5c36] text-white font-bold py-5 rounded-xl flex items-center justify-center gap-3 text-lg transition-all transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
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
                  <div className="w-12 h-12 bg-[#09a353]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-[#09a353]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Phone Support</p>
                    <p className="text-2xl font-bold text-[#09a353] mt-1">+234 700 000 0000</p>
                    <p className="text-gray-500 mt-1">24/7 Dedicated Line</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#09a353]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-[#09a353]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-xl text-[#09a353] mt-1">support@yourbank.com</p>
                    <p className="text-gray-500 mt-1">Average response: 30 mins</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#09a353]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-[#09a353]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Head Office</p>
                    <p className="text-gray-700 mt-1 leading-relaxed">
                      123 Finance Street<br />
                      Victoria Island, Lagos<br />
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-[#09a353]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-[#09a353]" />
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
            <div className="bg-gradient-to-r from-[#09a353] to-[#0a5c36] rounded-3xl shadow-2xl p-8 text-white text-center">
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