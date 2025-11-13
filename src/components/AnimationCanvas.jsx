// components/AnimationCanvas.jsx
import React, { useRef, useEffect, useMemo } from 'react';

const AnimationCanvas = ({ objects, width, height, zoom = 100 }) => {
  const canvasRef = useRef(null);

  // Use useMemo to prevent unnecessary re-renders while ensuring updates
  const canvasObjects = useMemo(() => objects, [objects]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Support high DPI displays for crisper rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear the canvas completely
    ctx.clearRect(0, 0, width, height);

    // Apply zoom transformation
    const zoomFactor = zoom / 100;
    ctx.save();
    ctx.scale(zoomFactor, zoomFactor);

    // Set background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, width, height);

    // Draw all objects in layer order (rectangles and circles first, labels last for proper stacking)
    const rectangles = canvasObjects.filter(obj => obj && obj.type === 'rectangle');
    const circles = canvasObjects.filter(obj => obj && obj.type === 'highlightCircle');
    const labels = canvasObjects.filter(obj => obj && obj.type === 'label');

    // Draw rectangles with their internal text
    rectangles.forEach(obj => {
      ctx.save();
      ctx.globalAlpha = obj.alpha !== undefined ? obj.alpha : 1;

      // Draw rectangle background
      ctx.fillStyle = obj.color || '#FFFFFF';
      ctx.fillRect(obj.x, obj.y, obj.width, obj.height);

      // Draw border with highlight if needed
      ctx.strokeStyle = obj.highlight ? '#FF0000' : (obj.borderColor || '#000000');
      ctx.lineWidth = obj.highlight ? 3 : 2;
      ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);

      // Draw text inside box
      if (obj.text !== undefined && obj.text !== null && obj.text !== '') {
        ctx.fillStyle = obj.textColor || '#000000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          obj.text.toString(), 
          obj.x + obj.width / 2, 
          obj.y + obj.height / 2
        );
      }
      ctx.restore();
    });

    // Draw highlight circles as outlines only
    circles.forEach(obj => {
      ctx.save();
      ctx.globalAlpha = obj.alpha !== undefined ? obj.alpha : 1;
      ctx.strokeStyle = obj.color || '#0000FF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(obj.x, obj.y, obj.radius || 20, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.restore();
    });

    // Draw labels last (on top)
    labels.forEach(obj => {
      ctx.save();
      ctx.globalAlpha = obj.alpha !== undefined ? obj.alpha : 1;
      ctx.fillStyle = obj.textColor || '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(obj.text.toString(), obj.x, obj.y);
      ctx.restore();
    });

    ctx.restore(); // Restore zoom transformation
  }, [canvasObjects, width, height, zoom]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ 
        background: '#fafafa',
        display: 'block',
        width: '100%',
        maxWidth: '100%'
      }}
    />
  );
};

export default AnimationCanvas;