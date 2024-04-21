import React, { useState, useEffect } from 'react';
import { useContextProvider } from "../../utils/globalContext";

export default function TestimonySlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSlideTwo, setCurrentSlideTwo] = useState(0);
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { refreshCount } = useContextProvider();

  useEffect(() => {
    const fetchTestimonies = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/testimony/route');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTestimonies(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonies();
  }, [refreshCount]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % testimonies.length);
      setTimeout(() => {
        setCurrentSlideTwo((prevSlide) => (prevSlide + 1) % testimonies.length);
      }, 400);
    }, 10000);

    return () => clearInterval(slideInterval);
  }, [testimonies.length]);

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
    setCurrentSlideTwo(slideIndex);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    loading ? (
      <div className=" flex flex-col items-center justify-center">
        <div className="w-full">
          <div className="bg-slate-200 rounded p-6">
            <div className='flex flex-col animate-pulse'>
              <div className='flex justify-center mb-6'>
                <div className="bg-slate-300 h-6 w-1/3 rounded mb-3 pulse-gradient"></div>
              </div>
              <div className="bg-slate-300 h-3 w-full rounded mb-3 pulse-gradient"></div>
              <div className="bg-slate-300 h-3 w-full rounded mb-3 pulse-gradient"></div>
              <div className="bg-slate-300 h-3 w-full rounded mb-3 pulse-gradient"></div>
              <div className="bg-slate-300 h-3 w-full rounded mb-3 pulse-gradient"></div>    
              <div className="bg-slate-300 h-3 w-full rounded mb-3 pulse-gradient"></div>    
              <div className="flex justify-end space-x-4 mt-6">
                <div className="bg-slate-300 h-5 w-1/4 rounded mb-3 pulse-gradient"></div> {/* Placeholder for author name */}
              </div>
              <div className='flex justify-center mt-6 space-x-3'>
                <div className='bg-slate-300 h-3 w-3 rounded-full pulse-gradient'></div>
                <div className='bg-slate-300 h-3 w-3 rounded-full pulse-gradient'></div>
                <div className='bg-slate-300 h-3 w-3 rounded-full pulse-gradient'></div>
                <div className='bg-slate-300 h-3 w-3 rounded-full pulse-gradient'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="slideshow-container bg-four-day text-three-day relative min-h-96">
        <h1 className="text-center text-4xl  pt-10">What our customers say</h1>
        {testimonies.map((testimony, index) => (
          <div key={testimony.id} className={`smooth-component ${index === currentSlide ? 'block opacity-0' : 'hidden'} ${index === currentSlideTwo ? 'opacity-100 translate-x-0' : 'translate-x-52'}`}>
            {index === currentSlide && (
              <div className='p-20 w-full min-height-testimony'>
                <p className='text-xl italic'>{testimony.content}</p>
                <h3 className='text-right'>--{testimony.author}--</h3>
                {testimony.profilePicURL && <img src={testimony.profilePicURL} alt="Profile" />}
              </div>
            )}
          </div>
        ))}
  
        <div className="dots-container absolute bottom-0 left-0 right-0 flex justify-center p-4">
          {testimonies.map((_, index) => (
            <span key={index} className={`dot ${index === currentSlide ? 'active' : ''}`} onClick={() => goToSlide(index)}></span>
          ))}
        </div>
      </div>
    )
    
  );
  
}

