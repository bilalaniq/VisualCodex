import React, { useCallback } from 'react';

const CanvasSizeControl = ({ 
  canvasWidth, 
  setCanvasWidth, 
  canvasHeight, 
  setCanvasHeight,
  minWidth = 100,
  maxWidth = 9999,
  minHeight = 100,
  maxHeight = 9999
}) => {
  const handleCanvasWidthChange = useCallback((value) => {
    const newWidth = parseInt(value, 10);
    if (!isNaN(newWidth) && newWidth >= minWidth && newWidth <= maxWidth) {
      setCanvasWidth(newWidth);
    }
  }, [minWidth, maxWidth, setCanvasWidth]);

  const handleCanvasHeightChange = useCallback((value) => {
    const newHeight = parseInt(value, 10);
    if (!isNaN(newHeight) && newHeight >= minHeight && newHeight <= maxHeight) {
      setCanvasHeight(newHeight);
    }
  }, [minHeight, maxHeight, setCanvasHeight]);

  return (
    <div className="canvas-size-control">
      <div className="size-control-section">
        <h3 className="size-control-title">Canvas Size</h3>
        
        <div className="size-input-group">
          <div className="size-input-row">
            <label className="size-label">Width: {canvasWidth}px</label>
            <input
              type="number"
              min={minWidth}
              max={maxWidth}
              value={canvasWidth}
              onChange={(e) => handleCanvasWidthChange(e.target.value)}
              className="size-input-simple"
              placeholder={`${minWidth}-${maxWidth}`}
            />
            <span className="size-range">{minWidth}–{maxWidth}px</span>
          </div>
          <div className="slider-container">
            <span className="slider-limit-label">{minWidth}px</span>
            <input
              type="range"
              min={minWidth}
              max={maxWidth}
              step="10"
              value={canvasWidth}
              onChange={(e) => handleCanvasWidthChange(e.target.value)}
              className="size-slider"
            />
            <span className="slider-limit-label">{maxWidth}px</span>
          </div>
        </div>
        
        <div className="size-input-group">
          <div className="size-input-row">
            <label className="size-label">Height: {canvasHeight}px</label>
            <input
              type="number"
              min={minHeight}
              max={maxHeight}
              value={canvasHeight}
              onChange={(e) => handleCanvasHeightChange(e.target.value)}
              className="size-input-simple"
              placeholder={`${minHeight}-${maxHeight}`}
            />
            <span className="size-range">{minHeight}–{maxHeight}px</span>
          </div>
          <div className="slider-container">
            <span className="slider-limit-label">{minHeight}px</span>
            <input
              type="range"
              min={minHeight}
              max={maxHeight}
              step="10"
              value={canvasHeight}
              onChange={(e) => handleCanvasHeightChange(e.target.value)}
              className="size-slider"
            />
            <span className="slider-limit-label">{maxHeight}px</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasSizeControl;
