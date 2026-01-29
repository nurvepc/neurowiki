import { useState, useEffect } from 'react';

interface UseScrollSpyProps {
  sectionIds: string[];
  offset?: number;
}

export const useScrollSpy = ({ sectionIds, offset = 100 }: UseScrollSpyProps): string | null => {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position
      const scrollPosition = window.scrollY + offset;

      // Find all sections and their positions
      const sectionPositions = sectionIds.map(id => {
        const element = document.getElementById(id);
        if (!element) {
          console.warn(`⚠️ Section element not found: ${id}`);
          return null;
        }
        
        // Use getBoundingClientRect to get accurate position, then add scrollY
        const rect = element.getBoundingClientRect();
        const offsetTop = window.scrollY + rect.top;
        
        return {
          id,
          offsetTop, // Distance from top of page
        };
      }).filter(Boolean) as Array<{ id: string; offsetTop: number }>;

      if (sectionPositions.length === 0) {
        console.warn('⚠️ No sections found for scroll spy');
        return;
      }

      // Debug: Log all section positions
      console.log('📐 Scroll spy check:', {
        scrollY: Math.round(window.scrollY),
        scrollPosition: Math.round(scrollPosition),
        sections: sectionPositions.map(s => ({
          id: s.id,
          offsetTop: Math.round(s.offsetTop),
          passed: scrollPosition >= s.offsetTop
        }))
      });

      // Find the active section: the last one whose offsetTop we've scrolled past
      let active = sectionPositions[0]; // Default to first section
      
      for (const section of sectionPositions) {
        if (section && scrollPosition >= section.offsetTop) {
          active = section;
        } else {
          break; // Stop when we reach a section we haven't scrolled to yet
        }
      }

      // Always update if different (use functional update to avoid stale closure)
      setActiveSectionId(prev => {
        if (active && active.id !== prev) {
          console.log('📍 Active section CHANGED:', active.id, 'scrollPosition:', Math.round(scrollPosition), 'offsetTop:', Math.round(active.offsetTop));
          return active.id;
        }
        return prev;
      });
    };

    // Run on mount after a delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 200);

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', throttledScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [sectionIds, offset]); // Removed activeSectionId - don't recreate effect when it changes

  return activeSectionId;
};
