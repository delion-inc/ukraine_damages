'use client';

import { useState } from 'react';

interface AiFeedbackRatingProps {
  onRatingSubmit?: (rating: number, comment: string) => void;
}

export default function AiFeedbackRating({ onRatingSubmit }: AiFeedbackRatingProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleMouseEnter = (starValue: number) => {
    setHoveredRating(starValue);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      if (onRatingSubmit) {
        onRatingSubmit(rating, comment);
      }
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-6 bg-green-50 rounded-lg text-center">
        <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">Дякуємо за ваш відгук!</h3>
        <p className="text-sm text-gray-600">Ваша оцінка допоможе нам покращити роботу штучного інтелекту.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-100">
      <h3 className="text-lg font-medium text-gray-900 mb-3 text-center">Оцініть якість розрахунку</h3>
      <p className="text-sm text-gray-600 mb-4 text-center">
        Ваш відгук допоможе нам покращити роботу штучного інтелекту
      </p>
      
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            className="p-1 mx-1 focus:outline-none"
            aria-label={`Оцінити на ${star} із 5`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
              stroke="currentColor"
              className={`w-8 h-8 sm:w-10 sm:h-10 ${
                star <= (hoveredRating || rating) 
                  ? 'text-yellow-400' 
                  : 'text-gray-400'
              }`}
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={star <= (hoveredRating || rating) ? 0 : 1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </button>
        ))}
      </div>
      
      <div className="text-center mb-3">
        <span className="text-sm font-medium">
          {rating === 0 
            ? 'Натисніть на зірку, щоб оцінити' 
            : `Ваша оцінка: ${rating} із 5`}
        </span>
      </div>
      
      <div className="mb-4">
        <textarea
          placeholder="Додаткові коментарі (необов'язково)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
          rows={3}
        />
      </div>
      
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={rating === 0}
          className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors 
          ${rating === 0 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          Надіслати відгук
        </button>
      </div>
    </div>
  );
} 