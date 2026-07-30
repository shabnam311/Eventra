import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PostEventSurvey() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const [status, setStatus] = useState('idle'); // idle, submitting, success

  useEffect(() => {
    const hasSubmitted = localStorage.getItem('eventra_survey_submitted');
    if (hasSubmitted) {
      setStatus('success');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please provide a star rating before submitting.");
      return;
    }
    
    setStatus('submitting');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      localStorage.setItem('eventra_survey_submitted', 'true');
      toast.success("Survey submitted successfully!");
    }, 1500);
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 max-w-md mx-auto border border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-900/20 rounded-2xl shadow-sm text-center"
      >
        <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Thank you for your feedback!</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Your response has been recorded and will help us improve future events.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-md mx-auto border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">How was the event?</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Share your experience with the organizers.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="p-1 focus:outline-none transition-transform hover:scale-110"
            >
              <Star 
                className={`w-10 h-10 ${
                  (hoveredRating || rating) >= star 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : 'fill-transparent text-gray-300 dark:text-gray-700'
                } transition-colors`} 
              />
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Feedback (Optional)
          </label>
          <textarea 
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl min-h-[120px] resize-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-gray-900 dark:text-gray-100" 
            placeholder="What did you love? What could be improved?" 
          />
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
          <input 
            id="anonymous"
            type="checkbox" 
            checked={isAnonymous} 
            onChange={e => setIsAnonymous(e.target.checked)}
            className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <label htmlFor="anonymous" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
            Submit Anonymously
            <span className="block text-xs text-gray-500 font-normal mt-0.5">Your profile identity will be hidden from organizers.</span>
          </label>
        </div>

        <button 
          type="submit"
          disabled={status === 'submitting'}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
        >
          {status === 'submitting' ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
          ) : (
            <><Send className="w-5 h-5" /> Submit Survey</>
          )}
        </button>
      </form>
    </div>
  );
}
