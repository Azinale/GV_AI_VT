/* eslint-disable no-unused-vars */
/* eslint-disable no-empty */
import React, { useEffect, useState, useRef, useCallback } from 'react';

const HeyGenAvatar = () => {
  const defaultSize = { width: 280, height: 380 };

  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Kích thước (resize)
  const [size, setSize] = useState(() => {
    try {
      const raw = localStorage.getItem('heygen-size');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return defaultSize;
  });

  

  // Trạng thái resize dùng ref để tránh re-render liên tục
  const resizeStateRef = useRef({
    active: false,
    dir: null,
    startX: 0,
    startY: 0,
    startW: 0,
    startH: 0,
    ratio: null,
  });

  const rafRef = useRef(null);
  const handlePointerMoveResizeRef = useRef(null);
  const handlePointerUpResizeRef = useRef(null);

  // Vị trí (drag)
  const [position, setPosition] = useState({
    x: 20,
    y: typeof window !== 'undefined' ? window.innerHeight - 120 : 20,
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  const USER_SHARE_LINK =
    'https://labs.heygen.com/interactive-avatar/share?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiI2OTU3MTc4OGNiOTU0ZDk2OGVkYzc2NjI5%0D%0AMDVkZDZjMCIsInByZXZpZXdJbWciOiJodHRwczovL2ZpbGVzMi5oZXlnZW4uYWkvYXZhdGFyL3Yz%0D%0ALzY5NTcxNzg4Y2I5NTRkOTY4ZWRjNzY2MjkwNWRkNmMwL2Z1bGwvMi4yL3ByZXZpZXdfdGFyZ2V0%0D%0ALndlYnAiLCJuZWVkUmVtb3ZlQmFja2dyb3VuZCI6ZmFsc2UsImtub3dsZWRnZUJhc2VJZCI6ImIw%0D%0AZDczNmJjNTJhNjRiM2E5NTgyZDAwMTM0MjEyZDgxIiwic2hhcmVfY29kZSI6ImE0OWIxZjczLWZl%0D%0AMDMtNGE4ZC1hM2M3LWJmNTliNGU5ZmIyYSIsInVzZXJuYW1lIjoiYTVjYTExYmIwOTk2NGFjZWJl%0D%0AMzY4MzI3YjljNTIyOTkifQ%3D%3D';
  const HOST = 'https://labs.heygen.com';

  const extractShare = (link) => {
    try {
      const url = new URL(link);
      const share = url.searchParams.get('share');
      if (share) return share;
    } catch (error) {}
    const index = link.indexOf('share=');
    return index >= 0 ? link.slice(index + 6) : link;
  };

  const shareToken = extractShare(USER_SHARE_LINK);
  const embedUrl = `${HOST}/guest/streaming-embed?share=${shareToken}`;

  /* ===================== DRAG LOGIC ===================== */

  const handleMouseDown = (e) => {
    if (e.button !== 0 || isFullscreen) return;
    if (!containerRef.current) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      const maxX = window.innerWidth - (containerRef.current.offsetWidth || 80);
      const maxY = window.innerHeight - (containerRef.current.offsetHeight || 80);

      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX > maxX) newX = maxX;
      if (newY > maxY) newY = maxY;

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  /* ===================== RESIZE LOGIC (Pointer Events) ===================== */

  const handlePointerMoveResize = useCallback((e) => {
    const state = resizeStateRef.current;
    if (!state.active || !containerRef.current) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    const minW = 120;
    const minH = 120;
    const maxW = window.innerWidth - 20;
    const maxH = window.innerHeight - 20;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      let newW = state.startW;
      let newH = state.startH;

      // Always resize independently (no aspect-ratio lock)
      if (state.dir === 'right' || state.dir === 'bottom-right') {
        newW = Math.max(minW, Math.min(maxW, state.startW + dx));
      }
      if (state.dir === 'bottom' || state.dir === 'bottom-right') {
        newH = Math.max(minH, Math.min(maxH, state.startH + dy));
      }

      const el = containerRef.current;
      if (el) {
        el.style.width = `${newW}px`;
        el.style.height = `${newH}px`;
      }
    });
  }, []);

  // keep a ref to the handler so we can add/remove listeners safely
  useEffect(() => {
    handlePointerMoveResizeRef.current = handlePointerMoveResize;
  }, [handlePointerMoveResize]);

  const handlePointerUpResize = useCallback(
    (e) => {
      const state = resizeStateRef.current;
      if (!state.active) return;

      resizeStateRef.current.active = false;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      const el = containerRef.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const finalSize = {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        };

        setSize(finalSize);
        try {
          localStorage.setItem('heygen-size', JSON.stringify(finalSize));
        } catch {}

        try {
          el.releasePointerCapture && el.releasePointerCapture(e.pointerId);
        } catch {}
      }

      window.removeEventListener('pointermove', handlePointerMoveResizeRef.current);
      window.removeEventListener('pointerup', handlePointerUpResizeRef.current);
    },
    []
  );

  // keep ref to the up handler as well
  useEffect(() => {
    handlePointerUpResizeRef.current = handlePointerUpResize;
  }, [handlePointerUpResize]);

  const handlePointerDownResize = useCallback(
    (e, dir) => {
      if (isFullscreen || !containerRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      const rect = containerRef.current.getBoundingClientRect();

      resizeStateRef.current = {
        active: true,
        dir,
        startX: e.clientX,
        startY: e.clientY,
        startW: rect.width,
        startH: rect.height,
        ratio: null,
      };

      try {
        containerRef.current.setPointerCapture(e.pointerId);
      } catch {}

      window.addEventListener('pointermove', handlePointerMoveResizeRef.current, { passive: false });
      window.addEventListener('pointerup', handlePointerUpResizeRef.current, { passive: false });
    },
    [isFullscreen]
  );

  // Double-click để reset kích thước
  const handleDoubleClickResize = () => {
    setSize(defaultSize);
    try {
      localStorage.setItem('heygen-size', JSON.stringify(defaultSize));
    } catch {}
    if (containerRef.current) {
      containerRef.current.style.width = `${defaultSize.width}px`;
      containerRef.current.style.height = `${defaultSize.height}px`;
    }
  };

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMoveResizeRef.current);
      window.removeEventListener('pointerup', handlePointerUpResizeRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ===================== FULLSCREEN LOGIC ===================== */

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  /* ===================== IFRAME MESSAGE LOGIC ===================== */

  useEffect(() => {
    let initTimer;
    const handleMessage = (event) => {
      if (event.origin === HOST && event.data && event.data.type === 'streaming-embed') {
        if (event.data.action === 'init') {
          setIsInitialized(true);
          if (initTimer) clearTimeout(initTimer);
        }
        if (event.data.action === 'show') setIsExpanded(true);
        if (event.data.action === 'hide') setIsExpanded(false);
      }
    };

    window.addEventListener('message', handleMessage);
    initTimer = setTimeout(() => {
      if (!isInitialized && iframeRef.current) {
        iframeRef.current.src = USER_SHARE_LINK;
      }
    }, 5000);

    return () => {
      window.removeEventListener('message', handleMessage);
      if (initTimer) clearTimeout(initTimer);
    };
  }, [isInitialized]);

  /* ===================== RENDER ===================== */

  return (
    <>
      <style>{`
        .heygen-widget-wrapper {
          position: fixed;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid #ED1B2E;
          box-shadow: 0 8px 24px rgba(237, 27, 46, 0.3);
          transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
          overflow: hidden;
          opacity: 0; 
          visibility: hidden;
          z-index: 2147483647; 
          backdrop-filter: blur(6px);
        }
        
        .heygen-widget-wrapper.show {
          opacity: 1;
          visibility: visible;
        }

        .heygen-widget-wrapper.expand {
          width: min(280px, 80vw);
          height: min(380px, 70vh);
          border-radius: 16px;
        }

        /* Fullscreen */
        .heygen-widget-wrapper:fullscreen {
          width: 100vw !important;
          height: 100vh !important;
          border-radius: 0 !important;
          border: none !important;
          left: 0 !important;
          top: 0 !important;
        }

        .heygen-resize-edge.right {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 10px;
          cursor: ew-resize;
          z-index: 2147483649;
          background: transparent;
        }

        .heygen-resize-edge.bottom {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 10px;
          cursor: ns-resize;
          z-index: 2147483649;
          background: transparent;
        }

        .heygen-resize-edge.corner {
          position: absolute;
          right: 6px;
          bottom: 6px;
          width: 22px;
          height: 22px;
          cursor: se-resize;
          z-index: 2147483650;
          background: rgba(255,255,255,0.9);
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        }

        @media (hover: none) {
          .heygen-resize-edge.corner {
            width: 32px;
            height: 32px;
            right: 10px;
            bottom: 10px;
          }
          .heygen-resize-edge.right {
            width: 18px;
          }
          .heygen-resize-edge.bottom {
            height: 18px;
          }
        }

        .heygen-widget-container {
          width: 100%;
          height: 100%;
          pointer-events: ${isDragging ? 'none' : 'auto'};
          background: #000;
        }

        .heygen-widget-container iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }

        .heygen-move-handle {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 20px;
          cursor: move;
          z-index: 1102;
          display: ${isFullscreen ? 'none' : 'block'};
        }

        .heygen-move-btn {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 24px;
          height: 24px;
          background: #ED1B2E;
          color: white;
          border-radius: 50%;
          display: ${isFullscreen ? 'none' : 'flex'};
          align-items: center;
          justify-content: center;
          cursor: move;
          font-size: 14px;
          z-index: 1103;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .heygen-fullscreen-btn {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          font-size: 18px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          cursor: pointer;
          z-index: 2147483648;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .heygen-fullscreen-btn:hover {
          background: rgba(237, 27, 46, 0.8);
          border-color: #ED1B2E;
        }

        /* Ẩn nút fullscreen khi đang thu nhỏ (hình tròn) */
        .heygen-widget-wrapper:not(.expand) .heygen-fullscreen-btn {
          display: none;
        }

        /* Trong fullscreen phải hiện nút */
        .heygen-widget-wrapper:fullscreen .heygen-fullscreen-btn {
          display: flex !important;
        }
      `}</style>

      <div
        id="heygen-streaming-embed"
        ref={containerRef}
        className={`heygen-widget-wrapper ${isInitialized ? 'show' : ''} ${
          isExpanded ? 'expand' : ''
        }`}
        style={{
          left: isFullscreen ? undefined : `${position.x}px`,
          top: isFullscreen ? undefined : `${position.y}px`,
          width: isFullscreen ? undefined : isExpanded ? `${size.width}px` : undefined,
          height: isFullscreen ? undefined : isExpanded ? `${size.height}px` : undefined,
        }}
      >
        {/* Nút kéo */}
        {!isFullscreen && (
          <>
            <div className="heygen-move-btn" onMouseDown={handleMouseDown}>
              ✥
            </div>
            {isExpanded && <div className="heygen-move-handle" onMouseDown={handleMouseDown} />}
          </>
        )}

        <div className="heygen-widget-container">
          <iframe
            ref={iframeRef}
            title="Giảng viên AI"
            allow="microphone; fullscreen"
            src={embedUrl}
          />
        </div>

        {/* Nút Fullscreen */}
        <button
          className="heygen-fullscreen-btn"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
        >
          {isFullscreen ? '✖' : '⛶'}
        </button>

        {/* (Aspect ratio lock removed) */}

        {/* Resize handles */}
        {!isFullscreen && isExpanded && (
          <>
            <div
              className="heygen-resize-edge right"
              onPointerDown={(e) => handlePointerDownResize(e, 'right')}
              title="Kéo để thay đổi chiều rộng"
            />
            <div
              className="heygen-resize-edge bottom"
              onPointerDown={(e) => handlePointerDownResize(e, 'bottom')}
              title="Kéo để thay đổi chiều cao"
            />
            <div
              className="heygen-resize-edge corner"
              onPointerDown={(e) => handlePointerDownResize(e, 'bottom-right')}
              onDoubleClick={handleDoubleClickResize}
              title="Kéo để thay đổi kích thước (double-click để reset)"
            />
          </>
        )}
      </div>
    </>
  );
};

export default HeyGenAvatar;
