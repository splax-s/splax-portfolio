'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useOsStore } from '@/store/useOsStore';

const Contact: React.FC = () => {
  const { osType } = useOsStore();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Input refs for mobile focus handling
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle mobile keyboard display
  useEffect(() => {
    const isMobile = osType === 'ios' || osType === 'android';
    if (isMobile && nameInputRef.current) {
      // Focus the first input field with a slight delay to ensure window is fully rendered
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 300);
    }
  }, [osType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({
      ...formState,
      [e.target.id]: e.target.value
    });
    
    // Clear error for this field
    if (errors[e.target.id]) {
      setErrors({
        ...errors,
        [e.target.id]: ''
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formState.message.trim()) {
      newErrors.message = "Message is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      try {
        // Create mailto URL with form data
        const mailtoLink = `mailto:ikhanobamichael@gmail.com?subject=Contact from ${encodeURIComponent(formState.name)}&body=${encodeURIComponent(
          `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`
        )}`;

        // Open email client
        window.location.href = mailtoLink;
        
        setSubmitted(true);
        
        // Reset form after submission
        setFormState({
          name: '',
          email: '',
          message: ''
        });

        // Success notification
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } catch (error) {
        console.error('Error opening mail client:', error);
        // Handle error appropriately
        setErrors({
          ...errors,
          submit: 'Failed to open mail client. Please try again or use the contact information above.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Apply OS-specific styling
  const getButtonStyle = () => {
    switch (osType) {
      case 'mac':
        return 'bg-blue-600 hover:bg-blue-700 text-white rounded-md';
      case 'windows':
        return 'bg-blue-700 hover:bg-blue-800 text-white';
      case 'ios':
        return 'bg-blue-500 hover:bg-blue-600 text-white rounded-xl';
      case 'android':
        return 'bg-green-600 hover:bg-green-700 text-white rounded-full';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white rounded-md';
    }
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
          <p className="text-gray-600 dark:text-gray-300">Let&apos;s connect and discuss opportunities</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:ikhanobamichael@gmail.com" className="hover:text-blue-500 dark:hover:text-blue-400">
                  ikhanobamichael@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <a href="https://github.com/splax-s" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">
                  github.com/splax-s
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="https://www.linkedin.com/in/michael-ikhanoba/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 dark:hover:text-blue-400">
                  linkedin.com/in/michael-ikhanoba
                </a>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  ref={nameInputRef}
                  type="text"
                  id="name"
                  value={formState.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  ref={emailInputRef}
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  ref={messageInputRef}
                  id="message"
                  value={formState.message}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                    errors.message ? 'border-red-500' : ''
                  }`}
                  required
                ></textarea>
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                )}
              </div>
              
              {errors.submit && (
                <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                  {errors.submit}
                </div>
              )}
              
              {submitted && (
                <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                  Opening your email client...
                </div>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 ${getButtonStyle()} transition-colors flex items-center justify-center space-x-2`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
