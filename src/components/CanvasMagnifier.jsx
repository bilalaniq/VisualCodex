import React, { useState, useCallback } from 'react';
import './CanvasMagnifier.css';

const CanvasMagnifier = ({ onZoomChange }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  
  const MIN_ZOOM = 50;
  const MAX_ZOOM = 300;
  const ZOOM_STEP = 10;

  const handleZoomChange = useCallback((value) => {
    const newZoom = parseInt(value, 10);
    if (!isNaN(newZoom) && newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
      setZoomLevel(newZoom);
      onZoomChange(newZoom);
    }
  }, [onZoomChange]);

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoomLevel + ZOOM_STEP, MAX_ZOOM);
    setZoomLevel(newZoom);
    onZoomChange(newZoom);
  }, [zoomLevel, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoomLevel - ZOOM_STEP, MIN_ZOOM);
    setZoomLevel(newZoom);
    onZoomChange(newZoom);
  }, [zoomLevel, onZoomChange]);

  const handleReset = useCallback(() => {
    setZoomLevel(100);
    onZoomChange(100);
  }, [onZoomChange]);

  return (
    <div className="canvas-magnifier">
      <div className="magnifier-header">
        <h4 className="magnifier-title">🔍 Zoom</h4>
      </div>
      
      <div className="magnifier-controls">
        <button 
          className="magnifier-btn zoom-out-btn"
          onClick={handleZoomOut}
          title="Zoom Out"
          disabled={zoomLevel <= MIN_ZOOM}
        >
          −
        </button>
        
        <div className="zoom-input-group">
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={ZOOM_STEP}
            value={zoomLevel}
            onChange={(e) => handleZoomChange(e.target.value)}
            className="magnifier-slider"
          />
          <span className="zoom-percentage">{zoomLevel}%</span>
        </div>
        
        <button 
          className="magnifier-btn zoom-in-btn"
          onClick={handleZoomIn}
          title="Zoom In"
          disabled={zoomLevel >= MAX_ZOOM}
        >
          +
        </button>
        
        <button 
          className="magnifier-btn reset-btn"
          onClick={handleReset}
          title="Reset Zoom"
        >
          ↺
        </button>
      </div>
    </div>
  );
};

export default CanvasMagnifier;
