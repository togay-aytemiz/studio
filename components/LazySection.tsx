import React, { Suspense, useEffect, useRef, useState } from 'react';

type LazySectionProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
};

const LazySection: React.FC<LazySectionProps> = ({ children, fallback = null, rootMargin = '400px 0px' }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node || isVisible) {
      return;
    }

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={wrapperRef}>
      {isVisible ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
};

export default LazySection;
