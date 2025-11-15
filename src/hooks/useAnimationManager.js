// hooks/useAnimationManager.js
import { useState, useRef, useCallback, useEffect } from 'react';

// useRef is like a pocket for your component. It lets you keep something (usually an element or a value) and know that it will be there, unchanged, every time your component re-renders.
// useState is React's memory for a component. It lets your component "remember" information that can change, and update the screen when that information changes.




const useAnimationManager = () => {
  const commandsRef = useRef([]);    // This stores the main list of animation commands.
  const [commandsState, setCommandsState] = useState([]);   // This stores the commands that should appear on the UI. 
  const [isAnimating, setIsAnimating] = useState(false);  // Tracks whether animation is currently running.
  const [isPaused, setIsPaused] = useState(false);        // Tracks whether animation is currently paused.
  const [objectsVersion, setObjectsVersion] = useState(0);   // This is a number that forces React to re-render animated objects.
  const [currentStep, setCurrentStep] = useState(0);         // Tracks the current step in the animation sequence.
  const [animationSpeed, setAnimationSpeed] = useState(500);   // shows the speed of the animation in milliseconds.
  const animationSpeedRef = useRef(animationSpeed);         // Keep a ref for animation speed to avoid re-creating functions
  // Removed unused animationRef
  const commandHistoryRef = useRef([]);             // This keeps a history of all commands ever executed.
  const objectManagerRef = useRef(new Map());     // This manages all the animated objects by their IDs. This tracks actual visual objects.
  const nextIdRef = useRef(0);                    // This helps generate unique IDs for new objects.
  const baselineCommandsRef = useRef([]);         // Stores the original command list before animation starts.
  const internalHandlersRef = useRef({});         // This holds internal handler functions that can be called from commands.
  const snapshotsRef = useRef([]);                // This keeps snapshots of object states at various steps for stepping back in the animation. Stores snapshots of UI states at each step.
  const isAnimatingRef = useRef(false);           // Tracks whether animation is currently running (ref version).
  const currentStepRef = useRef(0);              // Tracks the current step in the animation sequence (ref version).
  const commandsStateRef = useRef([]);           // This stores the commands that should appear on the UI (ref version).

  // Force objects update
  // This function increments objectsVersion to trigger a re-render of animated objects.
  // Incrementing objectsVersion forces React to re-render your component so the UI reflects the updated objects.
  const forceObjectsUpdate = useCallback(() => {
    setObjectsVersion(prev => prev + 1);
  }, []);
  // useCallback ensures that the same function instance is used across renders.
  // This avoids unnecessary re-renders if this function is passed as a dependency elsewhere.

  

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
  const immediateModeRef = useRef(false);

  const deleteObject = useCallback((id) => {
    if (objectManagerRef.current.has(id)) {
      objectManagerRef.current.delete(id);
      forceObjectsUpdate();
    }
  }, [forceObjectsUpdate]);

  const setForegroundColor = useCallback((id, color) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) {
      obj.color = color || obj.color;
      forceObjectsUpdate();
    }
  }, [forceObjectsUpdate]);

  const setLayer = useCallback((id, layer) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) {
      obj.layer = parseInt(layer, 10) || 0;
      forceObjectsUpdate();
    }
  }, [forceObjectsUpdate]);

  const alignRight = useCallback((id, referenceId) => {
    const obj = objectManagerRef.current.get(id);
    const refObj = objectManagerRef.current.get(referenceId);
    if (obj && refObj && refObj.width !== undefined) {
      obj.x = refObj.x + refObj.width + 8; // 8px padding
      obj.y = refObj.y;
      forceObjectsUpdate();
    }
  }, [forceObjectsUpdate]);

  const setAlpha = useCallback((id, alpha) => {
    const obj = objectManagerRef.current.get(id);
    if (obj) {
      obj.alpha = parseFloat(alpha) || 1;
      forceObjectsUpdate();
    }
  }, [forceObjectsUpdate]);

  const executeCommand = useCallback(async (commandString) => {
    const [command, ...args] = commandString.split('<;>');

    try {
      switch (command) {
        case 'CreateRectangle':
          createRectangle(...args);
          return;
        case 'CreateLabel':
          createLabel(...args);
          return;
        case 'Move': {
          // args: id, x, y
          const [id, xStr, yStr] = args;
          const x = parseInt(xStr, 10);
          const y = parseInt(yStr, 10);
          const obj = objectManagerRef.current.get(id);
          if (!obj) return;

          if (immediateModeRef.current) {
            obj.x = x;
            obj.y = y;
            forceObjectsUpdate();
            return;
          }

          const startX = obj.x;
          const startY = obj.y;
          const dx = x - startX;
          const dy = y - startY;
          const duration = Math.max(50, animationSpeedRef.current || 50);

          await new Promise((resolve) => {
            const start = performance.now();
            function step(now) {
              const t = Math.min(1, (now - start) / duration);
              obj.x = Math.round(startX + dx * t);
              obj.y = Math.round(startY + dy * t);
              forceObjectsUpdate();
              if (t < 1) requestAnimationFrame(step);
              else resolve();
            }
            requestAnimationFrame(step);
          });
          return;
        }
        case 'SetText':
          setText(...args);
          return;
        case 'SetHighlight':
          setHighlight(...args);
          return;
        case 'CreateHighlightCircle':
          createHighlightCircle(...args);
          return;
        case 'Delete':
          deleteObject(...args);
          return;
        case 'SetForegroundColor':
          setForegroundColor(...args);
          return;
        case 'SetLayer':
          setLayer(...args);
          return;
        case 'AlignRight':
          alignRight(...args);
          return;
        case 'SetAlpha':
          setAlpha(...args);
          return;
        case 'Step':
          return 'Step';
        case 'Internal': {
          const handlerName = args[0];
          const handlerArgs = args.slice(1);
          const handler = internalHandlersRef.current && internalHandlersRef.current[handlerName];
          if (typeof handler === 'function') handler(...handlerArgs);
          return;
        }
        default:
          console.warn('Unknown command:', command);
          return;
      }
    } catch (error) {
      console.error('Error executing command:', commandString, error);
    }
  }, [
    createRectangle,
    createLabel,
    setText,
    setHighlight,
    createHighlightCircle,
    deleteObject,
    setForegroundColor,
    setLayer,
    alignRight,
    setAlpha,
    forceObjectsUpdate
  ]);

  // Keep animationSpeedRef in sync so executeCommand doesn't need to re-create when speed changes
  useEffect(() => {
    animationSpeedRef.current = animationSpeed;
  }, [animationSpeed]);

  const cmd = useCallback((command, ...args) => {
    const commandString = [command, ...args].join('<;>');
    commandsRef.current.push(commandString);
    return commandString;
  }, []);

  const registerInternalHandler = useCallback((name, fn) => {
    internalHandlersRef.current[name] = fn;
    return () => { delete internalHandlersRef.current[name]; };
  }, []);

  const startNewAnimation = useCallback((newCommands = []) => {
    // Prevent starting a new animation if an animation is already running or there are pending steps
    if (isAnimatingRef.current || (commandsStateRef.current.length > 0 && currentStepRef.current < commandsStateRef.current.length)) {
      return false;
    }

    const commandsToUse = Array.isArray(newCommands) && newCommands.length > 0
      ? newCommands.slice()
      : commandsRef.current.slice();

    setCommandsState(commandsToUse);
    commandHistoryRef.current = commandsToUse.slice();
    setCurrentStep(0);
    setIsAnimating(true);

    commandsRef.current = [];
    return true;
  }, []);

  // Keep refs in sync with state so startNewAnimation can read latest values
  useEffect(() => { isAnimatingRef.current = isAnimating; }, [isAnimating]);
  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);
  useEffect(() => { commandsStateRef.current = commandsState; }, [commandsState]);

  // Animation execution
  useEffect(() => {
    // Execute animation in "steps" grouped by 'Step' commands.
    if (isAnimating && !isPaused && commandsState.length > 0 && currentStep < commandsState.length) {
      let cancelled = false;

      (async () => {
        let nextIndex = currentStep;
        while (nextIndex < commandsState.length && !cancelled) {
          const commandString = commandsState[nextIndex];
          const cmdName = commandString.split('<;>')[0];
          const res = await executeCommand(commandString);
          nextIndex++;
          if (res === 'Step' || cmdName === 'Step') {
            // Advance currentStep to the next command after the processed group
            setCurrentStep(nextIndex);

            // Capture snapshot of objects after this logical step
            try {
              const cloneMap = new Map();
              for (const [k, v] of objectManagerRef.current.entries()) {
                cloneMap.set(k, Object.assign({}, v));
              }
              snapshotsRef.current.push({ stepIndex: nextIndex, objects: cloneMap });
            } catch (e) {
              // ignore snapshot errors
            }

            // pause here until next tick
            break;
          }
        }

        // If we've reached the end, finish animation
        if (nextIndex >= commandsState.length) {
          setIsAnimating(false);
          setIsPaused(false);
        }
      })();

      return () => { cancelled = true; };
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
    // Jump to the end immediately. Use immediateMode to avoid animations.
    (async () => {
      immediateModeRef.current = true;
      if (commandsState.length > 0) {
        for (let i = currentStep; i < commandsState.length; i++) {
          try { await executeCommand(commandsState[i]); } catch (e) { /* ignore */ }
        }
        setCurrentStep(commandsState.length);
      }
      immediateModeRef.current = false;
      setIsAnimating(false);
    })();
  }, [commandsState, currentStep, executeCommand]);

  // Apply commands immediately without animation (useful for initial prerender)
  const applyCommandsImmediately = useCallback(async (commands = []) => {
    const cmdsToRun = Array.isArray(commands) && commands.length > 0 ? commands : commandsRef.current.slice();
    // Save baseline (static scene) so stepBack can restore it
    baselineCommandsRef.current = cmdsToRun.slice();
    immediateModeRef.current = true;
    for (let i = 0; i < cmdsToRun.length; i++) {
      try { await executeCommand(cmdsToRun[i]); } catch (e) { /* ignore */ }
    }
    immediateModeRef.current = false;
    // Mark that we've executed everything
    setCommandsState([]);
    setCurrentStep(cmdsToRun.length);
    // Record baseline snapshot
    try {
      const cloneMap = new Map();
      for (const [k, v] of objectManagerRef.current.entries()) {
        cloneMap.set(k, Object.assign({}, v));
      }
      snapshotsRef.current = [{ stepIndex: cmdsToRun.length, objects: cloneMap }];
    } catch (e) {
      snapshotsRef.current = [];
    }
    setIsAnimating(false);
    setIsPaused(false);
  }, [executeCommand]);

  const pauseAnimation = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeAnimation = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stepBack = useCallback(() => {
    // Restore previous snapshot if available
    if (snapshotsRef.current.length > 1) {
      // Pop current snapshot
      snapshotsRef.current.pop();
      const prev = snapshotsRef.current[snapshotsRef.current.length - 1];
      if (prev) {
        objectManagerRef.current = new Map();
        for (const [k, v] of prev.objects.entries()) {
          objectManagerRef.current.set(k, Object.assign({}, v));
        }
        forceObjectsUpdate();
        setCurrentStep(prev.stepIndex);
      }
    } else if (snapshotsRef.current.length === 1) {
      const base = snapshotsRef.current[0];
      if (base) {
        objectManagerRef.current = new Map();
        for (const [k, v] of base.objects.entries()) {
          objectManagerRef.current.set(k, Object.assign({}, v));
        }
        forceObjectsUpdate();
        setCurrentStep(base.stepIndex);
      }
    }
    setIsAnimating(false);
  }, [forceObjectsUpdate]);

  const stepForward = useCallback(() => {
    (async () => {
      // Execute next logical group of commands up to and including the next 'Step' marker
      if (currentStep >= commandsState.length) return;

      // Execute commands from currentStep until we hit a 'Step' or end
      let nextIndex = currentStep;
      while (nextIndex < commandsState.length) {
        const cmdName = commandsState[nextIndex].split('<;>')[0];
        try { await executeCommand(commandsState[nextIndex]); } catch (e) { /* ignore */ }
        nextIndex++;
        if (cmdName === 'Step') break;
      }

      setCurrentStep(nextIndex);
      // Capture snapshot after manual step forward
      try {
        const cloneMap = new Map();
        for (const [k, v] of objectManagerRef.current.entries()) {
          cloneMap.set(k, Object.assign({}, v));
        }
        snapshotsRef.current.push({ stepIndex: nextIndex, objects: cloneMap });
      } catch (e) {
        // ignore
      }
      // If we've reached end, ensure animation state is not running
      if (nextIndex >= commandsState.length) {
        setIsAnimating(false);
        setIsPaused(false);
      }
    })();
  }, [currentStep, commandsState, executeCommand]);

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
    // True when the currentStep corresponds exactly to the latest recorded snapshot
    isAtLatestSnapshot: (snapshotsRef.current.length === 0) ? true : currentStep === (snapshotsRef.current[snapshotsRef.current.length - 1].stepIndex),
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
    stepForward,
    clearHistory,
    resetAnimation,
    applyCommandsImmediately,
    registerInternalHandler,
    setAnimationSpeed,
    animationSpeed
  };
};

export default useAnimationManager;