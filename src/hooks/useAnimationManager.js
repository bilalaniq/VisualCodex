// hooks/useAnimationManager.js
import { useState, useRef, useCallback, useEffect } from 'react';

const useAnimationManager = () => {
  const commandsRef = useRef([]);
  const [commandsState, setCommandsState] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [objectsVersion, setObjectsVersion] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  // Removed unused animationRef
  const commandHistoryRef = useRef([]);
  const objectManagerRef = useRef(new Map());
  const nextIdRef = useRef(0);

  // Force objects update
  const forceObjectsUpdate = useCallback(() => {
    setObjectsVersion(prev => prev + 1);
  }, []);

  // Define all object management functions first with proper dependencies
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
    forceObjectsUpdate();
  }, [forceObjectsUpdate]);

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
    forceObjectsUpdate();
  }, [forceObjectsUpdate]);

  const moveObject = useCallback((id, x, y) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) {
      obj.x = parseInt(x, 10);
      obj.y = parseInt(y, 10);
      forceObjectsUpdate();
    }
  }, [forceObjectsUpdate]);

  const setText = useCallback((id, text) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) {
      obj.text = text !== undefined && text !== null ? text.toString() : "";
      forceObjectsUpdate();
    }
  }, [forceObjectsUpdate]);

  const setHighlight = useCallback((id, highlight) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) {
      obj.highlight = parseInt(highlight, 10) === 1;
      forceObjectsUpdate();
    }
  }, [forceObjectsUpdate]);

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
    forceObjectsUpdate();
  }, [forceObjectsUpdate]);

  const deleteObject = useCallback((id) => {
    objectManagerRef.current.delete(id);
    forceObjectsUpdate();
  }, [forceObjectsUpdate]);

  const setForegroundColor = useCallback((id, color) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) obj.textColor = color;
    forceObjectsUpdate();
  }, [forceObjectsUpdate]);

  const setLayer = useCallback((id, layer) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) obj.layer = parseInt(layer, 10);
    forceObjectsUpdate();
  }, [forceObjectsUpdate]);

  const alignRight = useCallback((id, referenceId) => {
    const obj = objectManagerRef.current.get(id);
    const refObj = objectManagerRef.current.get(referenceId);
    if (obj && refObj) {
      obj.x = refObj.x + refObj.width;
      forceObjectsUpdate();
    }
  }, [forceObjectsUpdate]);

  const setAlpha = useCallback((id, alpha) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) obj.alpha = parseFloat(alpha);
    forceObjectsUpdate();
  }, [forceObjectsUpdate]);

  // Now define executeCommand with all dependencies
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
  }, [
    createRectangle,
    createLabel,
    moveObject,
    setText,
    setHighlight,
    createHighlightCircle,
    deleteObject,
    setForegroundColor,
    setLayer,
    alignRight,
    setAlpha
  ]);

  const cmd = useCallback((command, ...args) => {
    const commandString = [command, ...args].join('<;>');
    commandsRef.current.push(commandString);
    return commandString;
  }, []);

  const startNewAnimation = useCallback((newCommands = []) => {
    const commandsToUse = Array.isArray(newCommands) && newCommands.length > 0 
      ? newCommands.slice() 
      : commandsRef.current.slice();
    
    setCommandsState(commandsToUse);
    commandHistoryRef.current = commandsToUse.slice();
    setCurrentStep(0);
    setIsAnimating(true);
    
    commandsRef.current = [];
  }, []);

  // Animation execution
  useEffect(() => {
    if (isAnimating && !isPaused && commandsState.length > 0 && currentStep < commandsState.length) {
      const timer = setTimeout(() => {
        executeCommand(commandsState[currentStep]);
        setCurrentStep(prev => prev + 1);

        if (currentStep + 1 >= commandsState.length) {
          setIsAnimating(false);
          setIsPaused(false);
        }
      }, animationSpeed);

      return () => clearTimeout(timer);
    }
  }, [isAnimating, isPaused, commandsState, currentStep, animationSpeed, executeCommand]);

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
      for (let i = currentStep; i < commandsState.length; i++) {
        executeCommand(commandsState[i]);
      }
      setCurrentStep(commandsState.length);
    }
    setIsAnimating(false);
  }, [commandsState, currentStep, executeCommand]);

  const pauseAnimation = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeAnimation = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stepBack = useCallback(() => {
    if (currentStep > 0) {
      // Reset to the previous step by clearing and replaying from start
      clearObjects();
      nextIdRef.current = 0;
      
      const newStep = currentStep - 1;
      for (let i = 0; i < newStep; i++) {
        executeCommand(commandsState[i]);
      }
      setCurrentStep(newStep);
      setIsAnimating(false);
    }
  }, [currentStep, commandsState, executeCommand, clearObjects]);

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
    isPaused,
    currentStep,
    objectsVersion,
    totalSteps: commandsState.length,
    getObjects,
    clearObjects,
    getNextId,
    skipForward,
    pauseAnimation,
    resumeAnimation,
    stepBack,
    clearHistory,
    resetAnimation,
    setAnimationSpeed,
    animationSpeed
  };
};

export default useAnimationManager;