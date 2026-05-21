"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

export default function SackPetition() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [petitionCount, setPetitionCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const cockroachImgRef = useRef<HTMLImageElement | null>(null);

  // Detect device performance capability
  const getOptimizedBugCount = () => {
    if (typeof window === "undefined") return 0;
    
    const width = window.innerWidth;
    const memory = (navigator as any).deviceMemory; // Device RAM in GB
    const cores = navigator.hardwareConcurrency || 1;
    
    // Very old phone detection: low RAM, low cores
    const isOldDevice = memory && memory <= 2 && cores <= 2;
    
    if (width > 768) {
      // Desktop
      return isOldDevice ? 100 : 400;
    } else if (width > 480) {
      // Tablet/Large mobile
      return isOldDevice ? 40 : 120;
    } else {
      // Small mobile
      return isOldDevice ? 30 : 80;
    }
  };

  const BUG_COUNT = getOptimizedBugCount();
  
  useEffect(() => {
    // Preload cockroach image
    const img = new window.Image();
    img.src = "/cockroach.webp";
    img.onload = () => {
      // Skip transparency processing on old devices to save processing
      const memory = (navigator as any).deviceMemory;
      const shouldSkipProcessing = memory && memory <= 2;

      if (shouldSkipProcessing) {
        // Just use the image as-is on old devices
        cockroachImgRef.current = img;
      } else {
        // Create offscreen canvas to remove white background
        const offCanvas = document.createElement("canvas");
        offCanvas.width = img.width;
        offCanvas.height = img.height;
        const offCtx = offCanvas.getContext("2d");
        if (offCtx) {
          offCtx.drawImage(img, 0, 0);
          const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
          const data = imgData.data;
          // Make near-white pixels transparent
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > 200 && g > 200 && b > 200) {
              data[i + 3] = 0; // Set alpha to 0
            }
          }
          offCtx.putImageData(imgData, 0, 0);
          
          const processedImg = new window.Image();
          processedImg.src = offCanvas.toDataURL();
          processedImg.onload = () => {
            cockroachImgRef.current = processedImg;
          };
        } else {
          cockroachImgRef.current = img;
        }
      }
    };
  }, []);

  // Fetch initial petition count and check if user already voted
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/petition.php?action=get");
        const data = await response.json();
        setPetitionCount(data.count);
        
        // Check if this user already voted (store in localStorage)
        const voted = localStorage.getItem("sack-petition-voted");
        if (voted) {
          setHasVoted(true);
        }
      } catch (error) {
        console.error("Failed to fetch petition count:", error);
        setPetitionCount(0);
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchCount();
  }, []);
  
  const drawBug = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    // Add 90 degrees (Math.PI/2) because top-down images usually face UP, but Math.atan2 faces RIGHT
    ctx.rotate(angle + Math.PI / 2); 
    
    // Normal blending
    ctx.globalCompositeOperation = "source-over";
    
    if (cockroachImgRef.current) {
      // Draw the realistic cockroach image with responsive size
      ctx.drawImage(cockroachImgRef.current, -size/2, -size/2, size, size);
    }
    
    ctx.restore();
  };

  const handleSack = useCallback(() => {
    if (isAnimating || !canvasRef.current || !imageRef.current) return;
    
    setIsAnimating(true);

    // Increment petition counter (only once per user session)
    if (!hasVoted) {
      fetch("/api/petition.php?action=sign", { method: "POST" })
        .then((res) => res.json())
        .then((data) => {
          setPetitionCount(data.count);
          setHasVoted(true);
          localStorage.setItem("sack-petition-voted", "true");
        })
        .catch((error) => console.error("Failed to increment count:", error));
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const section = canvas.parentElement;
    if (!ctx || !section) return;
    
    // Set canvas to full section size (so it scrolls naturally)
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    
    // Get target coordinates (center of the image) relative to the section canvas
    const imgRect = imageRef.current.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();
    const targetX = (imgRect.left - sectionRect.left) + imgRect.width / 2;
    const targetY = (imgRect.top - sectionRect.top) + imgRect.height / 2;
    const eatRadius = Math.min(imgRect.width, imgRect.height) * 0.4;

    // Initialize bugs outside the section boundaries
    const bugs = Array.from({ length: BUG_COUNT }).map(() => {
      // Pick a random edge: 0=top, 1=right, 2=bottom, 3=left
      const edge = Math.floor(Math.random() * 4);
      let startX = 0;
      let startY = 0;
      
      switch (edge) {
        case 0: startX = Math.random() * canvas.width; startY = -40; break;
        case 1: startX = canvas.width + 40; startY = Math.random() * canvas.height; break;
        case 2: startX = Math.random() * canvas.width; startY = canvas.height + 40; break;
        case 3: startX = -40; startY = Math.random() * canvas.height; break;
      }
      
      return {
        x: startX,
        y: startY,
        speed: 1.5 + Math.random() * 4,
        angle: 0,
        isEating: false,
        scatterAngle: 0
      };
    });

    let animationFrameId: number;
    let eatenCount = 0;
    let phase = 0; // 0: Swarming/Eating, 1: Scattering
    const startTime = performance.now();
    let frameCounter = 0;

    // On old devices, skip every other frame (30fps instead of 60fps)
    const memory = (navigator as any).deviceMemory;
    const shouldSkipFrames = memory && memory <= 2;
    const frameSkip = shouldSkipFrames ? 2 : 1;

    const render = (time: number) => {
      // Skip frames on old devices
      frameCounter++;
      if (frameCounter % frameSkip !== 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const elapsed = time - startTime;
      
      // Responsive cockroach size - much bigger for desktop!
      const bugSize = window.innerWidth > 1280 ? 120 : window.innerWidth > 1024 ? 90 : window.innerWidth > 768 ? 60 : 40;

      let allBugsOut = true;

      bugs.forEach(bug => {
        if (phase === 0) {
          // Calculate direction to constant target (relative to section)
          const dx = targetX - bug.x;
          const dy = targetY - bug.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < eatRadius + 40) {
            if (!bug.isEating) {
              bug.isEating = true;
              eatenCount++;
            }
            // Roam randomly over the target area instead of jittering in place
            bug.angle += (Math.random() - 0.5) * 1.5;
            
            // If they wander too far from target, gently steer them back to center
            if (dist > eatRadius + 80) {
              bug.angle = Math.atan2(dy, dx);
            }
            
            // Move more slowly while eating
            bug.x += Math.cos(bug.angle) * (bug.speed * 0.9);
            bug.y += Math.sin(bug.angle) * (bug.speed * 0.9);
          } else {
            // Swarm towards target
            const wobble = Math.sin(time / 180 + bug.x) * 0.4;
            bug.angle = Math.atan2(dy, dx) + wobble;
            bug.x += Math.cos(bug.angle) * bug.speed;
            bug.y += Math.sin(bug.angle) * bug.speed;
          }
        } else if (phase === 1) {
          // Scattering phase - run away fast!
          bug.x += Math.cos(bug.scatterAngle) * bug.speed;
          bug.y += Math.sin(bug.scatterAngle) * bug.speed;
          bug.angle = bug.scatterAngle; // face the direction they run
          
          // Check if bug is still visible on canvas
          if (
            bug.x > -150 && bug.x < canvas.width + 150 &&
            bug.y > -150 && bug.y < canvas.height + 150
          ) {
            allBugsOut = false;
          }
        }
        
        drawBug(ctx, bug.x, bug.y, bug.angle, bugSize);
      });

      if (phase === 0 && imageRef.current) {
        // Update image opacity based on how many bugs are eating
        const eatProgress = Math.min(eatenCount / (BUG_COUNT * 0.8), 1);
        imageRef.current.style.opacity = (1 - eatProgress).toString();
        imageRef.current.style.transform = `scale(${1 - eatProgress * 0.5})`;
        
        if (eatProgress >= 1 && elapsed > 2000) {
          // Image completely eaten! Switch to scatter phase
          phase = 1;
          bugs.forEach(bug => {
            // Pick a random direction roughly AWAY from the center
            const dx = bug.x - targetX;
            const dy = bug.y - targetY;
            bug.scatterAngle = Math.atan2(dy, dx) + (Math.random() - 0.5); 
            // Give them slow scatter speed
            bug.speed = 2 + Math.random() * 3;
          });
        }
      } else if (phase === 1 && allBugsOut) {
        // Finished scattering, all bugs are off-screen
        cancelAnimationFrame(animationFrameId);
        setIsAnimating(false);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Restore image back to original state
        if (imageRef.current) {
          imageRef.current.style.opacity = "1";
          imageRef.current.style.transform = "scale(1)";
        }
        return;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isAnimating, hasVoted]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!isAnimating && canvasRef.current) {
        const canvas = canvasRef.current;
        const parent = canvas.parentElement;
        if (!parent) return;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAnimating]);

  return (
    <section id="sack-petition" className="relative border-b-[3px] border-ink bg-paper-2 py-[72px] lg:py-[100px] overflow-hidden" data-screen-label="Petition">
      {/* Canvas for bugs - Absolute positioning to scroll with section */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-50 pointer-events-none"
      />

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-[56px] relative z-10 flex flex-col items-center text-center">
        <h2 className="font-display text-[42px] sm:text-[64px] leading-[0.9] tracking-[-0.015em] mb-[24px] text-ink">
          Petition to Sack the<br />
          <span className="text-blood italic font-['Georgia',serif]">Education Minister</span>
        </h2>
        <p className="font-sans text-[18px] max-w-[600px] text-ink-2 mb-[48px]">
          We demand accountability. The current education system is broken, our exams leak like sieves, and the future of millions of students hangs in the balance. Sign the petition with an action.
        </p>

        <div className="relative flex flex-col items-center">
          <div className="relative mb-8 transition-transform duration-300">
            <img 
              ref={imageRef}
              src="/education_minister.webp" 
              alt="Education Minister" 
              onClick={handleSack}
              className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] object-contain mix-blend-multiply transition-all duration-300 ease-in-out cursor-pointer hover:scale-105"
              style={{ opacity: 1, transform: "scale(1)" }}
            />
          </div>

          <div className="h-[80px] flex items-center justify-center">
            <button
              onClick={handleSack}
              disabled={isAnimating}
              className={`bg-blood text-paper font-condensed text-[20px] sm:text-[24px] font-bold tracking-[0.1em] uppercase py-[16px] px-[48px] border-[3px] border-ink shadow-[6px_6px_0_var(--color-ink)] transition-all duration-150 inline-flex items-center gap-[14px] group hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0_var(--color-ink)] ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isAnimating ? 'Sacking in progress...' : 'SACK NOW'}
            </button>
          </div>

          {/* Petitions Counter */}
          <div className="mt-[32px] text-center">
            <p className="font-sans text-[16px] sm:text-[18px] text-ink-2 mb-[8px]">
              Join the movement:
            </p>
            <p className="font-display text-[32px] sm:text-[48px] font-bold text-blood">
              {isLoadingCount ? "..." : petitionCount.toLocaleString()}
            </p>
            <p className="font-sans text-[14px] text-ink-2">
              {hasVoted ? "✓ You've signed" : "petition signatures"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
