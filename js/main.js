/* ==========================================
   UI Mockup Client-Side Interactions & GSAP
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof gsap === 'undefined') {
    console.error('GSAP is not loaded. Animations disabled.');
    return;
  }

  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // ── 1. HERO TEXT INTRADAY LOADING ANIMATION ──
  const heroTl = gsap.timeline();
  heroTl.from('.hero-content .eyebrow', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  })
  .from('.hero-content h1', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.4')
  .from('.hero-content .subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.5')
  .from('.hero-cta-wrap', {
    scale: 0.9,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)'
  }, '-=0.4')
  .from('.hero-viewport-container', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  }, '-=0.3');

  // ── 2. FLASHLIGHT DASHBOARD REVEAL INTERACTION ──
  const trigger = document.getElementById('flashlight-trigger');

  if (trigger) {
    let isInside = false;
    const maskState = { size: 0 };

    const updateMaskProps = (x, y) => {
      trigger.style.setProperty('--hero-mask-x', `${x}px`);
      trigger.style.setProperty('--hero-mask-y', `${y}px`);
    };

    trigger.addEventListener('mouseenter', (e) => {
      isInside = true;
      const rect = trigger.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      updateMaskProps(x, y);

      gsap.to(maskState, {
        size: 240, // reveal radius in px
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
        onUpdate: () => {
          trigger.style.setProperty('--hero-mask-size', `${maskState.size}px`);
        }
      });
    });

    trigger.addEventListener('mousemove', (e) => {
      if (!isInside) return;
      const rect = trigger.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      updateMaskProps(x, y);
    });

    trigger.addEventListener('mouseleave', () => {
      isInside = false;
      gsap.to(maskState, {
        size: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onUpdate: () => {
          trigger.style.setProperty('--hero-mask-size', `${maskState.size}px`);
        }
      });
    });
  }

  // ── 3. BENTO CARDS CURSOR GLOW ──
  const cards = document.querySelectorAll('.card-hover-glow');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ── 4. SCROLL TRIGGER BENTO GRID ANIMATION ──
  gsap.from('.bento-card', {
    scrollTrigger: {
      trigger: '.features',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  });

  // ── 5. SCROLL TRIGGER OFFICE ANIMATION ──
  gsap.from('.office-showcase', {
    scrollTrigger: {
      trigger: '.work-together',
      start: 'top 75%',
      toggleActions: 'play none none none'
    },
    scale: 0.95,
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'power2.out'
  });

  // ── 6. BENTO GRID ANIMATION LOOPS ──
  // A. Keyboard Shortcuts
  const shortcutKeys = document.querySelectorAll('.keys-grid .key-item');
  if (shortcutKeys.length > 0) {
    setInterval(() => {
      const randomKey = shortcutKeys[Math.floor(Math.random() * shortcutKeys.length)];
      randomKey.classList.add('pressed');
      setTimeout(() => {
        randomKey.classList.remove('pressed');
      }, 500);
    }, 1500);
  }

  // B. Team Planner Scroller
  const scroller = document.getElementById('task-scroller');
  if (scroller) {
    setInterval(() => {
      const firstCard = scroller.firstElementChild;
      if (!firstCard) return;
      
      const cardHeight = firstCard.offsetHeight;
      const gap = 10;
      const totalShift = cardHeight + gap;
      
      gsap.to(firstCard, {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: 'power2.inOut'
      });
      
      gsap.to(scroller, {
        y: -totalShift,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          scroller.appendChild(firstCard);
          gsap.set(scroller, { y: 0 });
          gsap.set(firstCard, { opacity: 1, scale: 1 });
        }
      });
    }, 3500);
  }

  // C. Time-blocking Calendar Block Slider
  const activeBlock = document.getElementById('active-schedule-block');
  const staticB1 = document.querySelector('.schedule-block-static.b-1');
  const staticB2 = document.querySelector('.schedule-block-static.b-2');
  
  if (activeBlock) {
    const states = [
      {
        top: 130,
        title: 'Design meeting',
        time: '03:00 - 04:00 pm',
        desc: 'Weekly review and refinement of project prototypes.',
        hideStatic: null
      },
      {
        top: 10,
        title: 'Prototype review',
        time: '09:00 - 09:45 am',
        desc: 'Walkthrough of the new mobile app designs.',
        hideStatic: staticB1
      },
      {
        top: 70,
        title: 'Dev team sync',
        time: '11:00 - 11:30 am',
        desc: 'Daily standup and code review alignment.',
        hideStatic: staticB2
      }
    ];
    
    let currentState = 0;
    
    setInterval(() => {
      currentState = (currentState + 1) % states.length;
      const state = states[currentState];
      
      gsap.to(activeBlock, {
        y: state.top - 130, // relative to default top position (130px)
        duration: 0.8,
        ease: 'power2.inOut',
        onStart: () => {
          gsap.to([staticB1, staticB2], { opacity: 0.3, duration: 0.3 });
        },
        onComplete: () => {
          if (state.hideStatic) {
            gsap.to(state.hideStatic, { opacity: 0, duration: 0.3 });
          }
          
          const titleEl = activeBlock.querySelector('.block-title');
          const timeEl = activeBlock.querySelector('.block-time');
          const descEl = activeBlock.querySelector('.block-desc');
          
          gsap.to([titleEl, timeEl, descEl], {
            opacity: 0,
            duration: 0.2,
            onComplete: () => {
              titleEl.textContent = state.title;
              timeEl.textContent = state.time;
              descEl.textContent = state.desc;
              gsap.to([titleEl, timeEl, descEl], { opacity: 1, duration: 0.2 });
            }
          });
        }
      });
    }, 5000);
  }

  // D. Notifications Bell Shaker
  const bellTrigger = document.getElementById('bell-trigger');
  const bellBadge = document.querySelector('.bell-badge-count');
  
  if (bellTrigger && bellBadge) {
    let count = 26;
    setInterval(() => {
      bellTrigger.classList.add('bell-ring-active');
      count++;
      bellBadge.textContent = count;
      
      gsap.fromTo(bellBadge, 
        { scale: 1 }, 
        { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.out' }
      );
      
      gsap.fromTo(bellTrigger,
        { scale: 1 },
        { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: 'power1.out' }
      );
      
      setTimeout(() => {
        bellTrigger.classList.remove('bell-ring-active');
      }, 600);
    }, 4000);
  }



  // ── 8. REAL-TIME NEON CLOCK TICKER (DYNAMIC ARCS & HANDS) ──
  const hourHand = document.querySelector('.hour-hand');
  const minuteHand = document.querySelector('.minute-hand');
  const secondHand = document.querySelector('.second-hand');
  const hourArc = document.querySelector('.clock-hour-arc');
  const minuteArc = document.querySelector('.clock-minute-arc');
  const hulyClock = document.querySelector('.huly-clock');
  const beamOrange = document.querySelector('.beam-orange');
  const beamBlue = document.querySelector('.beam-blue');

  if (hulyClock) {
    // A. Fade in/scale in entrance animation
    gsap.fromTo(hulyClock, 
      { scale: 0.92, opacity: 0 }, 
      { 
        scale: 1, 
        opacity: 1, 
        duration: 1.5, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.huly-clock',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  if (hourHand && minuteHand && secondHand && hourArc && minuteArc) {
    const blueCirc = 2 * Math.PI * 125;   // Radius 125
    const orangeCirc = 2 * Math.PI * 110; // Radius 110
    
    // Tail trail length (blue = 150 deg, orange = 120 deg)
    const blueTrailLength = blueCirc * 0.416;
    const orangeTrailLength = orangeCirc * 0.333;
    
    // Set initial stroke dash properties
    minuteArc.style.strokeDasharray = `${blueTrailLength} ${blueCirc}`;
    hourArc.style.strokeDasharray = `${orangeTrailLength} ${orangeCirc}`;
    let startTime = null;
    let lastTime = null;
    let virtualTime = 0;
    let pulseTimer = 0;
    let wasInPulse = false;
    let startOffset = 315 - 180;

    function updateClock(timestamp) {
      if (!startTime) {
        startTime = timestamp;
        lastTime = timestamp;
      }
      
      const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;
      
      pulseTimer += dt;
      if (pulseTimer >= 10.0) {
        pulseTimer = pulseTimer % 10.0;
      }
      
      // Asymmetric speed pulse multiplier:
      // T1 = 6.0s steady slow ticking, L = 4.0s pulse (0.8s ramp up, 3.2s long soft decay)
      let M = 1.0;
      if (pulseTimer > 6.0) {
        const t_pulse = pulseTimer - 6.0;
        if (t_pulse <= 0.8) {
          const x = t_pulse / 0.8;
          M = 1.0 + 15.0 * (x * x * (3 - 2 * x)); // Smooth acceleration up to 16x
        } else {
          const x = (t_pulse - 0.8) / 3.2;
          // Smooth cosine-based ease-out decay back to 1.0 (continuous 1st derivative at peak and base)
          const ease = 0.5 * (1 + Math.cos(x * Math.PI));
          M = 1.0 + 15.0 * ease;
        }
      }
      
      // Accumulate virtual time
      virtualTime += dt * M;

      // Base speeds (Time-lapse ratios):
      // Minute hand: 1 full rotation every 4 seconds
      const minDeg = 180 + (virtualTime / 4) * 360;
      const hrSlowDeg = 315 + (virtualTime / 48) * 360;
      
      // Hands sync dance:
      const inPulse = (pulseTimer > 6.0);
      if (inPulse && !wasInPulse) {
        startOffset = hrSlowDeg - minDeg;
      }
      wasInPulse = inPulse;
      
      // Blend factor tracks the speed multiplier
      const blend = (M - 1.0) / 15.0;
      const hrDeg = (1 - blend) * hrSlowDeg + blend * (minDeg + startOffset);
      
      // Second hand: 1 full rotation every 0.6 seconds
      const secDeg = 165 + (virtualTime / 0.6) * 360;

      // Update hands rotation style
      hourHand.style.transform = `rotate(${hrDeg}deg)`;
      minuteHand.style.transform = `rotate(${minDeg}deg)`;
      secondHand.style.transform = `rotate(${secDeg}deg)`;

      // Blue minute arc: trailing pulse behind minute hand
      const minSweep = (minDeg % 360);
      const minDistance = (minSweep / 360) * blueCirc;
      const minOffset = blueCirc + blueTrailLength - minDistance;
      minuteArc.style.strokeDashoffset = `${minOffset}`;

      // Orange hour arc: trailing pulse counter-clockwise behind hour hand
      const hrSweep = 360 - (hrDeg % 360);
      const hrDistance = (hrSweep / 360) * orangeCirc;
      const hrOffset = orangeCirc + orangeTrailLength - hrDistance;
      hourArc.style.strokeDashoffset = `${hrOffset}`;

      // Pulse background beams in phase with the clock speed/rotation
      if (beamOrange && beamBlue) {
        const pulse = Math.sin(secDeg * Math.PI / 180);
        // Alternate opacity between 0.35 and 0.95 out of phase
        const opacityOrange = 0.65 + 0.3 * pulse;
        const opacityBlue = 0.65 - 0.3 * pulse;
        beamOrange.style.setProperty('--beam-opacity', opacityOrange);
        beamBlue.style.setProperty('--beam-opacity', opacityBlue);
      }

      requestAnimationFrame(updateClock);
    }

    // Start fluid continuous render loop
    requestAnimationFrame(updateClock);
  }

  // ── 9. SCROLL-DRIVEN GLOW STREAKS FOR TRANSITIONS ──
  const topStreak = document.getElementById('top-glow-streak');
  if (topStreak) {
    try {
      const length = topStreak.getTotalLength() || 1800;
      topStreak.style.strokeDasharray = `150, ${length}`;
      topStreak.style.strokeDashoffset = `${length + 150}`;

      gsap.to(topStreak, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.top-divider',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    } catch(err) {
      console.warn("Failed to animate top glow streak:", err);
    }
  }

  const bottomStreak = document.getElementById('bottom-glow-streak');
  if (bottomStreak) {
    try {
      const length = bottomStreak.getTotalLength() || 1800;
      bottomStreak.style.strokeDasharray = `150, ${length}`;
      bottomStreak.style.strokeDashoffset = `${length + 150}`;

      gsap.to(bottomStreak, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.bottom-divider',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    } catch(err) {
      console.warn("Failed to animate bottom glow streak:", err);
    }
  }

  // C. GitHub to MetaBrain Glow Streak
  const githubStreak = document.getElementById('github-glow-streak');
  if (githubStreak) {
    try {
      const length = githubStreak.getTotalLength() || 1800;
      githubStreak.style.strokeDasharray = `150, ${length}`;
      githubStreak.style.strokeDashoffset = `${length + 150}`;

      gsap.to(githubStreak, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.github-to-metabrain-divider',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    } catch(err) {
      console.warn("Failed to animate github glow streak:", err);
    }
  }

  // D. Knowledge to Clock Glow Streak
  const knowledgeStreak = document.getElementById('knowledge-glow-streak');
  if (knowledgeStreak) {
    try {
      const length = knowledgeStreak.getTotalLength() || 1800;
      knowledgeStreak.style.strokeDasharray = `150, ${length}`;
      knowledgeStreak.style.strokeDashoffset = `${length + 150}`;

      gsap.to(knowledgeStreak, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '.knowledge-to-clock-divider',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5
        }
      });
    } catch(err) {
      console.warn("Failed to animate knowledge glow streak:", err);
    }
  }

  // ── 10. SCROLL-DRIVEN KNOWLEDGE STICKY CARDS TOGGLE ──
  const cardCollab = document.querySelector('.slide-collaborate');
  const cardHistory = document.querySelector('.slide-history');
  if (cardCollab && cardHistory) {
    // Set initial state
    cardCollab.classList.add('active');
    cardHistory.classList.remove('active');

    ScrollTrigger.create({
      trigger: '.knowledge',
      start: 'top 30%',
      end: 'bottom 70%',
      onUpdate: (self) => {
        if (self.progress < 0.5) {
          cardCollab.classList.add('active');
          cardHistory.classList.remove('active');
        } else {
          cardCollab.classList.remove('active');
          cardHistory.classList.add('active');
        }
      }
    });
  }

  // ── 11. SCROLL-DRIVEN KNOWLEDGE EDITOR HIGHLIGHT & CURSOR ──
  const highlightOverlay = document.querySelector('.knowledge-highlight-overlay');
  const cursorOverlay = document.querySelector('.knowledge-cursor-overlay');
  const cursorBlink = document.querySelector('.editor-text-cursor-overlay');
  const editorToolbar = document.querySelector('.editor-toolbar-mock');
  const textLiveAnim = document.querySelector('.text-live-anim');
  const textLiveAnimDelayed = document.querySelector('.text-live-anim-delayed');

  if (highlightOverlay && cursorOverlay && editorToolbar) {
    const editTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.knowledge',
        start: 'top 25%',
        end: 'top -20%',
        scrub: 1.0
      }
    });

    // Step 1: Fade in overlays and blink cursor
    editTimeline.to([highlightOverlay, cursorOverlay, cursorBlink], {
      opacity: 1,
      duration: 0.1
    })
    // Step 2: Animate cursor and highlight position sweep
    .to(highlightOverlay, {
      '--highlight-position': 0.86,
      duration: 1.5,
      ease: 'power1.inOut'
    }, 'sweep')
    .to(cursorOverlay, {
      '--cursor-position': 0.86,
      duration: 1.5,
      ease: 'power1.inOut'
    }, 'sweep')
    // Step 3: Fade in toolbar and slide it up
    .to(editorToolbar, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2')
    // Step 4: Fade out overlays at the end of typing
    .to([highlightOverlay, cursorOverlay, cursorBlink], {
      opacity: 0,
      duration: 0.1
    })
    // Step 5: Underline live text and advanced solutions
    .call(() => {
      if (textLiveAnim) textLiveAnim.classList.add('active');
      if (textLiveAnimDelayed) textLiveAnimDelayed.classList.add('active');
    }, null, '+=0.2');

    // Clean up classes on scroll back
    ScrollTrigger.create({
      trigger: '.knowledge',
      start: 'top 45%',
      onLeaveBack: () => {
        if (textLiveAnim) textLiveAnim.classList.remove('active');
        if (textLiveAnimDelayed) textLiveAnimDelayed.classList.remove('active');
      }
    });
  }
});