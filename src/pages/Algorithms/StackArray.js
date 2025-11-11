// src/pages/Algorithms/StackArray.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import useAnimationManager from '../../hooks/useAnimationManager';
import useAlgorithm from '../../hooks/useAlgorithm';
import AnimationCanvas from '../../components/AnimationCanvas';
import CanvasSizeControl from '../../components/CanvasSizeControl';
import CanvasMagnifier from '../../components/CanvasMagnifier';
import './StackArray.css';

const StackArray = () => {
  const [inputValue, setInputValue] = useState('');
  const [canvasWidth, setCanvasWidth] = useState(1000);
  const [canvasHeight, setCanvasHeight] = useState(500);
  const [zoomLevel, setZoomLevel] = useState(100);
  
  // Remove canvas dimensions from useAnimationManager
  const animationManager = useAnimationManager();
  const algorithm = useAlgorithm(animationManager);
  
  const { cmd, implementAction, getNextId, addControlToAlgorithmBar } = algorithm;
  const { getObjects, isAnimating, isPaused, skipForward, pauseAnimation, resumeAnimation, stepBack, startNewAnimation, setAnimationSpeed, animationSpeed, objectsVersion } = animationManager;

  // Constants matching the original
  const ARRAY_START_X = 100;
  const ARRAY_START_Y = 200;
  const ARRAY_ELEM_WIDTH = 50;
  const ARRAY_ELEM_HEIGHT = 50;
  const ARRAY_ELEMS_PER_LINE = 15;
  const ARRAY_LINE_SPACING = 130;
  const TOP_POS_X = 180;
  const TOP_POS_Y = 100;
  const TOP_LABEL_X = 130;
  const TOP_LABEL_Y = 100;
  const PUSH_LABEL_X = 50;
  const PUSH_LABEL_Y = 30;
  const PUSH_ELEMENT_X = 120;
  const PUSH_ELEMENT_Y = 30;
  const SIZE = 15;

  // Stack state
  const stackDataRef = useRef(new Array(SIZE).fill(null));
  const topRef = useRef(0);
  const arrayIDsRef = useRef([]);
  const arrayLabelIDsRef = useRef([]);
  const topIDRef = useRef(null);
  const topLabelIDRef = useRef(null);
  const messageIDRef = useRef(null);

  const setup = useCallback(() => {
    const commands = [];
    arrayIDsRef.current = [];
    arrayLabelIDsRef.current = [];
    
    // Create array visualization
    for (let i = 0; i < SIZE; i++) {
      const xpos = (i % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
      const ypos = Math.floor(i / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;
      
      const arrayID = getNextId();
      const labelID = getNextId();
      
      arrayIDsRef.current[i] = arrayID;
      arrayLabelIDsRef.current[i] = labelID;
      
      cmd("CreateRectangle", arrayID, "", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, xpos, ypos);
      cmd("CreateLabel", labelID, i.toString(), xpos, ypos + ARRAY_ELEM_HEIGHT);
      cmd("SetForegroundColor", labelID, "#0000FF");
    }
    
    // Create top pointer
    topLabelIDRef.current = getNextId();
    topIDRef.current = getNextId();
    cmd("CreateLabel", topLabelIDRef.current, "top", TOP_LABEL_X, TOP_LABEL_Y);
    cmd("CreateRectangle", topIDRef.current, "0", ARRAY_ELEM_WIDTH, ARRAY_ELEM_HEIGHT, TOP_POS_X, TOP_POS_Y);
    
    // Create message label
    messageIDRef.current = getNextId();
    cmd("CreateLabel", messageIDRef.current, "", PUSH_LABEL_X, PUSH_LABEL_Y);
    
    return commands;
  }, [cmd, getNextId]);

  const push = useCallback((elemToPush) => {
    const commands = [];
    
    if (topRef.current >= SIZE) {
      cmd("SetText", messageIDRef.current, "Stack Overflow!");
      return commands;
    }

    stackDataRef.current[topRef.current] = elemToPush;
    
    const labPushID = getNextId();
    const labPushValID = getNextId();
    const highlight1ID = getNextId();
    
    cmd("SetText", messageIDRef.current, "");
    cmd("CreateLabel", labPushID, "Pushing Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
    cmd("CreateLabel", labPushValID, elemToPush, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
    cmd("Step");
    
    cmd("CreateHighlightCircle", highlight1ID, "#0000FF", TOP_POS_X, TOP_POS_Y);
    cmd("Step");
    
    const xpos = (topRef.current % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
    const ypos = Math.floor(topRef.current / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;
    
    cmd("Move", highlight1ID, xpos, ypos + ARRAY_ELEM_HEIGHT);
    cmd("Step");
    cmd("Move", labPushValID, xpos, ypos);
    cmd("Step");
    cmd("SetText", arrayIDsRef.current[topRef.current], elemToPush);
    cmd("Delete", labPushValID);
    cmd("Delete", highlight1ID);
    cmd("SetHighlight", topIDRef.current, 1);
    cmd("Step");
    
    topRef.current++;
    cmd("SetText", topIDRef.current, topRef.current.toString());
    cmd("Delete", labPushID);
    cmd("Step");
    cmd("SetHighlight", topIDRef.current, 0);
    cmd("SetText", messageIDRef.current, `Pushed: ${elemToPush}`);
    
    return commands;
  }, [cmd, getNextId]);

  const pop = useCallback(() => {
    const commands = [];
    
    if (topRef.current <= 0) {
      cmd("SetText", messageIDRef.current, "Stack Underflow!");
      return commands;
    }

    const labPopID = getNextId();
    const labPopValID = getNextId();
    const highlight1ID = getNextId();
    
    cmd("SetText", messageIDRef.current, "");
    cmd("CreateLabel", labPopID, "Popping Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
    
    cmd("SetHighlight", topIDRef.current, 1);
    cmd("Step");
    
    topRef.current--;
    const poppedValue = stackDataRef.current[topRef.current];
    
    cmd("SetText", topIDRef.current, topRef.current.toString());
    cmd("Step");
    cmd("SetHighlight", topIDRef.current, 0);
    
    cmd("CreateHighlightCircle", highlight1ID, "#0000FF", TOP_POS_X, TOP_POS_Y);
    cmd("Step");
    
    const xpos = (topRef.current % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
    const ypos = Math.floor(topRef.current / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;
    
    cmd("Move", highlight1ID, xpos, ypos + ARRAY_ELEM_HEIGHT);
    cmd("Step");
    cmd("CreateLabel", labPopValID, poppedValue, xpos, ypos);
    cmd("SetText", arrayIDsRef.current[topRef.current], "");
    cmd("Move", labPopValID, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
    cmd("Step");
    cmd("Delete", labPopValID);
    cmd("Delete", labPopID);
    cmd("Delete", highlight1ID);
    cmd("SetText", messageIDRef.current, `Popped: ${poppedValue}`);
    
    stackDataRef.current[topRef.current] = null;
    
    return commands;
  }, [cmd, getNextId]);

  const clearStack = useCallback(() => {
    const commands = [];
    
    for (let i = 0; i < SIZE; i++) {
      cmd("SetText", arrayIDsRef.current[i], "");
      stackDataRef.current[i] = null;
    }
    topRef.current = 0;
    cmd("SetText", topIDRef.current, "0");
    cmd("SetText", messageIDRef.current, "Stack Cleared");
    
    return commands;
  }, [cmd]);

  const pushCallback = useCallback(() => {
    if (inputValue.trim() && !isAnimating) {
      setInputValue('');
      implementAction(push, inputValue);
    }
  }, [inputValue, isAnimating, implementAction, push]);

  const popCallback = useCallback(() => {
    if (!isAnimating && topRef.current > 0) {
      implementAction(pop);
    }
  }, [isAnimating, implementAction, pop]);

  const clearCallback = useCallback(() => {
    if (!isAnimating) {
      implementAction(clearStack);
    }
  }, [isAnimating, implementAction, clearStack]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      pushCallback();
    }
  }, [pushCallback]);

  // Initialize on component mount
  useEffect(() => {
    const initialCommands = setup();
    startNewAnimation(initialCommands);
  }, [setup, startNewAnimation]);

  // Add controls to algorithm bar - remove unused variables
  useEffect(() => {
    addControlToAlgorithmBar("Text", "");
    addControlToAlgorithmBar("Button", "Push");
    addControlToAlgorithmBar("Button", "Pop");
    addControlToAlgorithmBar("Button", "Clear Stack");
  }, [addControlToAlgorithmBar]);

  return (
    <div className="stack-array-page">
      <div className="algorithm-header">
        <h1>Stack (Array Implementation)</h1>
        <p>Visualization of stack operations using array implementation</p>
      </div>

      <div className="algorithm-controls">
        <div className="canvas-controls-section">
          <CanvasSizeControl 
            canvasWidth={canvasWidth}
            setCanvasWidth={setCanvasWidth}
            canvasHeight={canvasHeight}
            setCanvasHeight={setCanvasHeight}
          />
          
          <CanvasMagnifier 
            onZoomChange={setZoomLevel}
          />
          
          <div className="speed-control">
            <label htmlFor="speedRange" className="speed-label">Animation Speed</label>
            <div className="speed-slider-wrapper">
              <input
                id="speedRange"
                type="range"
                min={50}
                max={2000}
                step={10}
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="speed-slider"
              />
              <div className="speed-display">
                <div className="speed-value">{animationSpeed} ms</div>
                <div className="speed-hint">Lower = faster</div>
              </div>
            </div>
          </div>
        </div>

        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter value to push"
            className="algorithm-input"
            disabled={isAnimating}
            maxLength={10}
          />
        </div>

        <div className="control-group">
          <button 
            onClick={pushCallback} 
            className="algorithm-btn primary"
            disabled={isAnimating || !inputValue.trim()}
          >
            Push
          </button>
          <button 
            onClick={popCallback} 
            className="algorithm-btn secondary"
            disabled={isAnimating || topRef.current === 0}
          >
            Pop
          </button>
          <button 
            onClick={clearCallback} 
            className="algorithm-btn danger"
            disabled={isAnimating}
          >
            Clear Stack
          </button>
          
          <div className="button-divider"></div>
          
          <button 
            onClick={stepBack} 
            className="algorithm-btn step-back"
            title="Step Back to Previous Frame"
            disabled={!isAnimating}
          >
            ⏮ Step Back
          </button>
          <button 
            onClick={pauseAnimation} 
            className="algorithm-btn pause"
            title="Pause Animation"
            disabled={!isAnimating}
          >
            ⏸ Pause
          </button>
          <button 
            onClick={skipForward} 
            className="algorithm-btn skip-forward"
            title="Skip to End"
            disabled={!isAnimating}
          >
            ⏭ Skip Forward
          </button>
        </div>
      </div>

      <div className="animation-container">
        <AnimationCanvas
          key={`objects-${objectsVersion}`}
          objects={getObjects()}
          width={canvasWidth}
          height={canvasHeight}
          zoom={zoomLevel}
        />
      </div>

      <div className="algorithm-info">
        <div className="info-panel">
          <h3>Stack Information:</h3>
          <p>Size: {topRef.current} / {SIZE}</p>
          <p>Status: {topRef.current === 0 ? 'Empty' : topRef.current >= SIZE ? 'Full' : 'Available'}</p>
          <p>Top Element: {topRef.current > 0 ? stackDataRef.current[topRef.current - 1] : 'None'}</p>
          {!isAnimating && <p className="animation-status">✓ Animation Complete</p>}
        </div>
        
        <div className="instructions">
          <h3>Instructions:</h3>
          <ul>
            <li><strong>Push Value:</strong> Enter a value and click "Push" to add to stack (or press Enter)</li>
            <li><strong>Pop:</strong> Click "Pop" to remove the top element</li>
            <li><strong>Clear Stack:</strong> Click "Clear Stack" to reset all data</li>
            <li><strong>Canvas Controls:</strong>
              <ul>
                <li>Adjust <strong>Canvas Size</strong> (width and height) to change visualization area</li>
                <li>Use <strong>Zoom</strong> control to magnify the visualization (50% to 300%)</li>
                <li>Adjust <strong>Animation Speed</strong> to control step timing</li>
              </ul>
            </li>
            <li><strong>Animation Controls:</strong>
              <ul>
                <li><strong>⏮ Step Back</strong> - Go to previous animation frame</li>
                <li><strong>⏸ Pause</strong> - Pause animation at current frame</li>
                <li><strong>⏭ Skip Forward</strong> - Complete animation instantly</li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ); 
};

export default StackArray;