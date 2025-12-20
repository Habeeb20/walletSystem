/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { 
  Search, 
  ChevronRight, 
  MessageCircle, 
  Phone, 
  Mail, 
  Clock, 
  Shield, 
  HelpCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const faqs = [
    {
      category: "Account & Security",
      icon: Shield,
      items: [
        { q: "How do I reset my password?", a: "Go to login page → 'Forgot Password' → Enter your registered email → Follow the link sent to reset." },
        { q: "My account is locked. What should I do?", a: "Contact support immediately via live chat or call +234 816 648 9562. We'll verify and unlock within minutes." },
        { q: "How secure is my account?", a: "We use bank-grade 256-bit encryption, biometric login, and real-time fraud monitoring." },
      ]
    },
    {
      category: "Transfers & Payments",
      icon: ArrowRight,
      items: [
        { q: "How long do transfers take?", a: "Instant to all Nigerian banks. International transfers take 1-3 business days." },
        { q: "What are transfer limits?", a: "Daily limit: ₦5,000,000. Monthly: ₦50,000,000. Verified users can request higher limits." },
        { q: "Can I schedule payments?", a: "No, We are sorry about that." },
      ]
    },
    // {
    //   category: "Cards & ATM",
    //   icon: CheckCircle,
    //   items: [
    //     { q: "How do I order a debit card?", a: "Go to Cards → Request Card → Choose design → Delivered in 3-5 days." },
    //     { q: "My card was declined. Why?", a: "Possible reasons: insufficient funds, daily limit reached, or fraud alert. Check transactions or contact support." },
    //     { q: "How do I block my card?", a: "App: Cards → Block Card. Or call +234 700 000 0000 instantly." },
    //   ]
    // },
    {
      category: "Deposits & Savings",
      icon: MessageCircle,
      items: [
        { q: "How do I fund my account?", a: "Bank transfer, kindly do a transfer to your wallet on profile section" },
        { q: "What is the interest rate?", a: "50 naira will be deducted on all transfer done from Nigerian banks to your wallet." },
        { q: "Can I create multiple savings goals?", a: "No!, we are sorry about that" },
      ]
    },
  ];

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 ">
            Help & Support Center
          </h1>
          <p className="text-xl text-gray-600 ">
            Get instant answers to common questions or connect with our 24/7 support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help... e.g. 'reset password', 'transfer limit'"
              className="w-full pl-14 pr-6 py-5 text-lg rounded-2xl border border-gray-200"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredFaqs.length === 0 ? (
            <div className="col-span-2 text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No results found. Try a different search term.</p>
            </div>
          ) : (
            filteredFaqs.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div key={idx} className="bg-white ">
                  <div className="bg-gradient-to-r from-[#09a353] to-green-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                      <Icon className="h-10 w-10" />
                      <h2 className="text-2xl font-bold">{category.category}</h2>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {category.items.map((faq, i) => (
                      <details key={i} className="group">
                        <summary className="flex items-center justify-between cursor-pointer py-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <span className="font-medium text-gray-900 ">
                            {faq.q}
                          </span>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-open:rotate-90 transition-transform" />
                        </summary>
                        <p className="text-gray-600 ">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Support Options */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 ">
            Still need help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-white ">
  <MessageCircle className="h-12 w-12 text-[#09a353] mx-auto mb-4" />
  <h3 className="text-xl font-bold mb-2">Live Chat</h3>
  <p className="text-gray-600 ">Chat with an agent now on WhatsApp</p>
  
  <a
    href="https://wa.me/2348166489562"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-3 bg-[#09a353] text-white px-3 py-2 rounded-xl font-semibold hover:bg-green-700 transition transform hover:scale-105 shadow-lg"
  >
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.884 3.088" />
    </svg>
    Start Chat on WhatsApp
  </a>
</div>
            <div className="bg-white ">
              <Phone className="h-12 w-12 text-[#09a353] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-600 ">24/7 Support</p>
              <a href="tel:+2347000000000" className="text-2xl font-bold text-[#09a353]">+234 8166489562</a>
            </div>

            <div className="bg-white ">
              <Mail className="h-12 w-12 text-[#09a353] mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Email Support</h3>
              <p className="text-gray-600 ">Response within 1 hour</p>
              <a href="mailto:support@yourbank.com" className="text-[#09a353] font-semibold underline">
                support@codequor.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;