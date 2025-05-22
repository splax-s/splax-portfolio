'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contact } from '@/lib/terminal/data';
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
      newErrors.name = 'Name is required';
    }
    
    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        
        // Reset form after submission
        setFormState({
          name: '',
          email: '',
          message: ''
        });
        
        // Reset submitted state after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }, 1000);
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

  const getFormStyle = () => {
    switch (osType) {
      case 'mac':
        return 'bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm';
      case 'windows':
        return 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700';
      case 'ios':
        return 'bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md';
      case 'android':
        return 'bg-gray-50 dark:bg-gray-800 rounded-lg shadow';
      default:
        return 'bg-gray-50 dark:bg-gray-800 rounded-lg';
    }
  };

  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
          <p className="text-gray-600 dark:text-gray-300">Let's connect and discuss opportunities</p>
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
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Contact;
