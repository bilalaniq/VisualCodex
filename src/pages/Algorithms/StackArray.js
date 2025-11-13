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
    const { getObjects, isAnimating, isPaused, isAtLatestSnapshot, skipForward, pauseAnimation, resumeAnimation, stepBack, stepForward, currentStep, totalSteps, startNewAnimation, setAnimationSpeed, animationSpeed, objectsVersion, applyCommandsImmediately } = animationManager;

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
      // Position index label centered below the box
      const labelXpos = xpos + ARRAY_ELEM_WIDTH / 2;
      const labelYpos = ypos + ARRAY_ELEM_HEIGHT + 5;
      cmd("CreateLabel", labelID, i.toString(), labelXpos, labelYpos);
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

  // Register internal handlers so state changes happen when commands execute
  useEffect(() => {
    const unregisterPush = animationManager.registerInternalHandler('applyPush', (val) => {
      // applyPush updates the internal refs at execution time
      stackDataRef.current[topRef.current] = val;
    });

    const unregisterPop = animationManager.registerInternalHandler('applyPop', () => {
      if (topRef.current > 0) {
        topRef.current--;
        stackDataRef.current[topRef.current] = null;
      }
    });

    const unregisterTopInc = animationManager.registerInternalHandler('incTop', () => {
      topRef.current++;
    });

    return () => {
      unregisterPush();
      unregisterPop();
      unregisterTopInc();
    };
  }, [animationManager]);

  const push = useCallback((elemToPush) => {
    const commands = [];
    
    if (topRef.current >= SIZE) {
      cmd("SetText", messageIDRef.current, "Stack Overflow!");
      return commands;
    }

  // Defer actual state mutation until the Internal handler runs during execution
    
    const labPushID = getNextId();
    const labPushValID = getNextId();
    const highlight1ID = getNextId();
    
  // Step 1: create labels and show the top position with a highlight circle
  cmd("SetText", messageIDRef.current, "");
  cmd("CreateLabel", labPushID, "Pushing Value: ", PUSH_LABEL_X, PUSH_LABEL_Y);
  cmd("CreateLabel", labPushValID, elemToPush, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
  // Center circle on the top box (circle center at box center)
  cmd("CreateHighlightCircle", highlight1ID, "#0000FF", TOP_POS_X + ARRAY_ELEM_WIDTH / 2, TOP_POS_Y + ARRAY_ELEM_HEIGHT / 2);
  cmd("Step");

  // Step 2: highlight the top box
  cmd("SetHighlight", topIDRef.current, 1);
  cmd("Step");

  // Step 3: move highlight and value into slot, place value, update top, cleanup
  const xpos = (topRef.current % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
  const ypos = Math.floor(topRef.current / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;
  // Move circle to center of target box
  cmd("Move", highlight1ID, xpos + ARRAY_ELEM_WIDTH / 2, ypos + ARRAY_ELEM_HEIGHT / 2);
  cmd("Move", labPushValID, xpos, ypos);
  // set visual text now
  cmd("SetText", arrayIDsRef.current[topRef.current], elemToPush);
  // and defer updating the internal arrays until the same step via Internal
  cmd("Internal", "applyPush", elemToPush);
  cmd("Delete", labPushValID);
  cmd("Delete", highlight1ID);
  // increment top visually and in internal refs via Internal handler
  cmd("Internal", "incTop");
  cmd("SetText", topIDRef.current, String(topRef.current + 1));
  cmd("Delete", labPushID);
  cmd("SetHighlight", topIDRef.current, 0);
  cmd("SetText", messageIDRef.current, `Pushed: ${elemToPush}`);
  cmd("Step");
    
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
    
  // Defer actual pop until execution time
    
    cmd("SetText", topIDRef.current, topRef.current.toString());
    cmd("Step");
    cmd("SetHighlight", topIDRef.current, 0);
    
    // Center circle on the top box
    cmd("CreateHighlightCircle", highlight1ID, "#0000FF", TOP_POS_X + ARRAY_ELEM_WIDTH / 2, TOP_POS_Y + ARRAY_ELEM_HEIGHT / 2);
    cmd("Step");
    
  const xpos = ((topRef.current - 1) % ARRAY_ELEMS_PER_LINE) * ARRAY_ELEM_WIDTH + ARRAY_START_X;
  const ypos = Math.floor((topRef.current - 1) / ARRAY_ELEMS_PER_LINE) * ARRAY_LINE_SPACING + ARRAY_START_Y;
    
    // Move circle to center of target box
    cmd("Move", highlight1ID, xpos + ARRAY_ELEM_WIDTH / 2, ypos + ARRAY_ELEM_HEIGHT / 2);
    cmd("Step");
    // Create popped label using the current visual text in the cell
    let currentText = '';
    try {
      const objs = getObjects();
      const idToCheck = arrayIDsRef.current[topRef.current - 1];
      const found = objs.find(o => o.id === idToCheck);
      if (found && found.text !== undefined && found.text !== null) {
        currentText = found.text.toString();
      }
    } catch (e) {
      currentText = '';
    }
    cmd("CreateLabel", labPopValID, currentText, xpos, ypos);
  cmd("SetText", arrayIDsRef.current[topRef.current - 1], "");
  cmd("Move", labPopValID, PUSH_ELEMENT_X, PUSH_ELEMENT_Y);
    cmd("Step");
  // Clear internal via Internal handler when this step executes
  cmd("Internal", "applyPop");
  cmd("Delete", labPopValID);
  cmd("Delete", labPopID);
  cmd("Delete", highlight1ID);
  cmd("SetText", messageIDRef.current, `Popped`);
    
    
    return commands;
  }, [cmd, getNextId, getObjects]);

  const clearStack = useCallback(() => {
    const commands = [];
    
    for (let i = 0; i < SIZE; i++) {
      cmd("SetText", arrayIDsRef.current[i], "");
      stackDataRef.current[i] = null;
    }
    topRef.current = 0;
    cmd("SetText", topIDRef.current, "0");
    cmd("SetText", messageIDRef.current, "Stack Cleared");
    cmd("Step");
    
    return commands;
  }, [cmd]);

  const pushCallback = useCallback(() => {
    if (inputValue.trim() && !isAnimating && !isPaused && isAtLatestSnapshot) {
      setInputValue('');
      implementAction(push, inputValue);
    }
  }, [inputValue, isAnimating, isPaused, isAtLatestSnapshot, implementAction, push]);

  const popCallback = useCallback(() => {
    if (!isAnimating && !isPaused && isAtLatestSnapshot && topRef.current > 0) {
      implementAction(pop);
    }
  }, [isAnimating, isPaused, isAtLatestSnapshot, implementAction, pop]);

  const clearCallback = useCallback(() => {
    if (!isAnimating) {
      implementAction(clearStack);
    }
  }, [isAnimating, implementAction, clearStack]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      if (!isAnimating && !isPaused && isAtLatestSnapshot) {
        pushCallback();
      } else {
        e.preventDefault();
      }
    }
  }, [pushCallback, isAnimating, isPaused, isAtLatestSnapshot]);

  // Initialize on component mount
  useEffect(() => {
    // Build commands and prerender immediately so canvas shows initial state
    const initialCommands = setup();
    // Apply commands immediately to render initial static layout
    applyCommandsImmediately(initialCommands);
    // Keep command history ready for further actions by starting a fresh animation
    startNewAnimation([]);
  }, [setup, startNewAnimation, applyCommandsImmediately]);

  // Helper to sync internal refs from visual objects (used after stepping back/forward)
  const syncFromObjects = useCallback(() => {
    const objs = getObjects();
    // Map by id for quick lookup
    const objMap = new Map();
    objs.forEach(o => objMap.set(o.id, o));

    // Sync top value
    if (topIDRef.current) {
      const topObj = objMap.get(topIDRef.current);
      if (topObj && topObj.text !== undefined && topObj.text !== null && topObj.text !== '') {
        const parsed = parseInt(topObj.text.toString(), 10);
        if (!Number.isNaN(parsed)) {
          topRef.current = parsed;
        }
      } else {
        topRef.current = 0;
      }
    }

    // Sync array cell values
    for (let i = 0; i < SIZE; i++) {
      const id = arrayIDsRef.current[i];
      if (!id) continue;
      const cellObj = objMap.get(id);
      if (cellObj && cellObj.text !== undefined && cellObj.text !== null && cellObj.text !== '') {
        stackDataRef.current[i] = cellObj.text.toString();
      } else {
        stackDataRef.current[i] = null;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            disabled={isAnimating || isPaused || currentStep < totalSteps}
            maxLength={10}
          />
        </div>

        <div className="control-group">
          <button 
            onClick={pushCallback} 
            className="algorithm-btn primary"
            disabled={isAnimating || isPaused || currentStep < totalSteps || !inputValue.trim()}
          >
            Push
          </button>
          <button 
            onClick={() => {
              if (isPaused) {
                resumeAnimation();
              } else {
                pauseAnimation();
              }
            }}
            className="algorithm-btn pause"
            title={isPaused ? 'Resume Animation' : 'Pause Animation'}
            disabled={!isAnimating}
          >
            {isPaused ? '\u25b6 Play' : '\u23f8 Pause'}
          </button>
          <button 
            onClick={popCallback} 
            className="algorithm-btn secondary"
            disabled={isAnimating || isPaused || currentStep < totalSteps || topRef.current === 0}
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
            onClick={() => {
              stepBack();
              // Sync refs after stepping back
              setTimeout(() => syncFromObjects(), 20);
            }}
            className="algorithm-btn step-back"
            title="Step Back to Previous Step"
            disabled={currentStep === 0}
          >
            ⏮ Step Back
          </button>
          
          <button
            onClick={() => {
              // step forward one logical step
              stepForward();
              setTimeout(() => syncFromObjects(), 20);
            }}
            className="algorithm-btn step-forward"
            title="Step Forward One Step"
            disabled={(!isAnimating && !isPaused) || currentStep >= totalSteps}
          >
            ⏭ Step Forward
          </button>

          <button 
            onClick={() => { skipForward(); setTimeout(() => syncFromObjects(), 20); }} 
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