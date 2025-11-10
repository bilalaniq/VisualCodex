// components/AnimationCanvas.jsx
import React, { useRef, useEffect, useMemo } from 'react';

const AnimationCanvas = ({ objects, width, height }) => {
  const canvasRef = useRef(null);

  // Use useMemo to prevent unnecessary re-renders while ensuring updates
  const canvasObjects = useMemo(() => objects, [objects]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Clear the canvas completely
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, width, height);

    // Draw all objects in layer order
    canvasObjects.forEach(obj => {
      if (!obj) return;
      
      ctx.save();
      ctx.globalAlpha = obj.alpha !== undefined ? obj.alpha : 1;
      
      switch (obj.type) {
        case 'rectangle':
          // Draw rectangle background
          ctx.fillStyle = obj.color || '#FFFFFF';
          ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
          
          // Draw border with highlight if needed
          ctx.strokeStyle = obj.highlight ? '#FF0000' : (obj.borderColor || '#000000');
          ctx.lineWidth = obj.highlight ? 3 : 2;
          ctx.strokeRect(obj.x, obj.y, obj.width, obj.height);
          
          // Draw text
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
          break;

        case 'label':
          ctx.fillStyle = obj.textColor || '#000000';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(obj.text.toString(), obj.x, obj.y);
          break;

        case 'highlightCircle':
          ctx.fillStyle = obj.color || '#0000FF';
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, obj.radius || 20, 0, 2 * Math.PI);
          ctx.fill();
          break;

        default:
          console.warn('Unknown object type:', obj.type);
      }
      
      ctx.restore();
    });
  }, [canvasObjects, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ 
        border: '1px solid #ccc', 
        background: '#fafafa',
        display: 'block',
        margin: '0 auto'
      }}
    />
  );
};

export default AnimationCanvas;