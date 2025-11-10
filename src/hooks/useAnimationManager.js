// hooks/useAnimationManager.js
import { useState, useRef, useCallback, useEffect } from 'react';

const useAnimationManager = (canvasWidth, canvasHeight) => {
  const commandsRef = useRef([]);
  const [commandsState, setCommandsState] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [objectsVersion, setObjectsVersion] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const animationRef = useRef(null);
  const commandHistoryRef = useRef([]);
  const objectManagerRef = useRef(new Map());
  const nextIdRef = useRef(0);

  // Force objects update
  const forceObjectsUpdate = useCallback(() => {
    setObjectsVersion(prev => prev + 1);
  }, []);

  const cmd = useCallback((command, ...args) => {
    const commandString = [command, ...args].join('<;>');
    commandsRef.current.push(commandString);
    return commandString;
  }, []);

  const startNewAnimation = useCallback((newCommands = []) => {
    // Use provided commands or current commandsRef
    const commandsToUse = Array.isArray(newCommands) && newCommands.length > 0 
      ? newCommands.slice() 
      : commandsRef.current.slice();
    
    setCommandsState(commandsToUse);
    commandHistoryRef.current = commandsToUse.slice();
    setCurrentStep(0);
    setIsAnimating(true);
    
    // Clear any existing commands for next operation
    commandsRef.current = [];
  }, []);

  const executeCommand = useCallback((commandString) => {
    const [command, ...args] = commandString.split('<;>');

    try {
      switch (command) {
        case 'CreateRectangle':
          createRectangle(...args);
          break;
        case 'CreateLabel':
          createLabel(...args);
          break;
        case 'Move':
          moveObject(...args);
          break;
        case 'SetText':
          setText(...args);
          break;
        case 'SetHighlight':
          setHighlight(...args);
          break;
        case 'CreateHighlightCircle':
          createHighlightCircle(...args);
          break;
        case 'Delete':
          deleteObject(...args);
          break;
        case 'SetForegroundColor':
          setForegroundColor(...args);
          break;
        case 'SetLayer':
          setLayer(...args);
          break;
        case 'AlignRight':
          alignRight(...args);
          break;
        case 'SetAlpha':
          setAlpha(...args);
          break;
        case 'Step':
          // Pause marker - no object change needed
          break;
        default:
          console.warn('Unknown command:', command);
      }
    } catch (error) {
      console.error('Error executing command:', commandString, error);
    }
    
    // Force update after every command
    forceObjectsUpdate();
  }, [forceObjectsUpdate]);

  // Object Management Methods (update these to include forceObjectsUpdate)
  const createRectangle = useCallback((id, text, width, height, x, y) => {
    objectManagerRef.current.set(id, {
      type: 'rectangle',
      id,
      text: text || "",
      width: parseInt(width, 10),
      height: parseInt(height, 10),
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      color: '#FFFFFF',
      borderColor: '#000000',
      textColor: '#000000',
      alpha: 1,
      layer: 0,
      highlight: false
    });
  }, []);

  const createLabel = useCallback((id, text, x, y) => {
    objectManagerRef.current.set(id, {
      type: 'label',
      id,
      text: text || "",
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      textColor: '#000000',
      alpha: 1,
      layer: 0
    });
  }, []);

  const moveObject = useCallback((id, x, y) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) {
      obj.x = parseInt(x, 10);
      obj.y = parseInt(y, 10);
    }
  }, []);

  const setText = useCallback((id, text) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) {
      obj.text = text !== undefined && text !== null ? text.toString() : "";
    }
  }, []);

  const setHighlight = useCallback((id, highlight) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) {
      obj.highlight = parseInt(highlight, 10) === 1;
    }
  }, []);

  const createHighlightCircle = useCallback((id, color, x, y) => {
    objectManagerRef.current.set(id, {
      type: 'highlightCircle',
      id,
      color: color || '#0000FF',
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      radius: 20,
      alpha: 1,
      layer: 1
    });
  }, []);

  const deleteObject = useCallback((id) => {
    objectManagerRef.current.delete(id);
  }, []);

  const setForegroundColor = useCallback((id, color) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) obj.textColor = color;
  }, []);

  const setLayer = useCallback((id, layer) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) obj.layer = parseInt(layer, 10);
  }, []);

  const alignRight = useCallback((id, referenceId) => {
    const obj = objectManagerRef.current.get(id);
    const refObj = objectManagerRef.current.get(referenceId);
    if (obj && refObj) {
      obj.x = refObj.x + refObj.width;
    }
  }, []);

  const setAlpha = useCallback((id, alpha) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) obj.alpha = parseFloat(alpha);
  }, []);

  // Animation execution
  useEffect(() => {
    if (isAnimating && commandsState.length > 0 && currentStep < commandsState.length) {
      const timer = setTimeout(() => {
        executeCommand(commandsState[currentStep]);
        setCurrentStep(prev => prev + 1);

        // Check if animation is complete
        if (currentStep + 1 >= commandsState.length) {
          setIsAnimating(false);
        }
      }, animationSpeed);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, commandsState, currentStep, animationSpeed, executeCommand]);

  const getNextId = useCallback(() => {
    return (nextIdRef.current++).toString();
  }, []);

  const getObjects = useCallback(() => {
    const objectsArray = Array.from(objectManagerRef.current.values());
    return objectsArray.sort((a, b) => (a.layer || 0) - (b.layer || 0));
  }, []);

  const clearObjects = useCallback(() => {
    objectManagerRef.current.clear();
    forceObjectsUpdate();
  }, [forceObjectsUpdate]);

  const skipForward = useCallback(() => {
    if (commandsState.length > 0) {
      // Execute all remaining commands immediately
      for (let i = currentStep; i < commandsState.length; i++) {
        executeCommand(commandsState[i]);
      }
      setCurrentStep(commandsState.length);
    }
    setIsAnimating(false);
  }, [commandsState, currentStep, executeCommand]);

  const clearHistory = useCallback(() => {
    commandHistoryRef.current = [];
    commandsRef.current = [];
    setCommandsState([]);
    setCurrentStep(0);
  }, []);

  const resetAnimation = useCallback(() => {
    commandsRef.current = [];
    setCommandsState([]);
    setCurrentStep(0);
    setIsAnimating(false);
    clearObjects();
  }, [clearObjects]);

  return {
    cmd,
    startNewAnimation,
    isAnimating,
    currentStep,
    objectsVersion,
    totalSteps: commandsState.length,
    getObjects,
    clearObjects,
    getNextId,
    skipForward,
    clearHistory,
    resetAnimation,
    setAnimationSpeed,
    animationSpeed
  };
};

export default useAnimationManager;