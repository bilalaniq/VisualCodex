// hooks/useAlgorithm.js
import { useCallback, useRef } from 'react';

const useAlgorithm = (animationManager) => {
  const actionHistoryRef = useRef([]);
  const recordAnimationRef = useRef(true);
  const { cmd, startNewAnimation, getNextId } = animationManager;

  // Define controlKey first so it's available for other functions
  const controlKey = useCallback((keyASCII) => {
    return keyASCII === 8 || keyASCII === 9 || keyASCII === 37 || keyASCII === 38 ||
           keyASCII === 39 || keyASCII === 40 || keyASCII === 46;
  }, []);

  const implementAction = useCallback((action, value) => {
    if (recordAnimationRef.current) {
      actionHistoryRef.current.push([action, value]);
    }
    
    const commands = action(value);
    startNewAnimation(commands);
    return commands;
  }, [startNewAnimation, recordAnimationRef]);

  const addControlToAlgorithmBar = useCallback((type, name) => {
    return { type, name, id: getNextId() };
  }, [getNextId]);

  const addLabelToAlgorithmBar = useCallback((labelName) => {
    return { type: 'label', name: labelName, id: getNextId() };
  }, [getNextId]);

  const addCheckboxToAlgorithmBar = useCallback((boxLabel) => {
    return { type: 'checkbox', name: boxLabel, id: getNextId() };
  }, [getNextId]);

  const addRadioButtonGroupToAlgorithmBar = useCallback((buttonNames, groupName) => {
    const buttonList = buttonNames.map(name => ({
      type: 'radio',
      name: groupName,
      value: name,
      id: getNextId()
    }));
    return buttonList;
  }, [getNextId]);

  const returnSubmit = useCallback((field, action, maxsize, intOnly) => {
    return (event) => {
      const keyASCII = event.which || event.keyCode;
      
      if (keyASCII === 13 && action) {
        action();
        return true;
      }
      
      if (maxsize !== undefined && field.value.length >= maxsize) {
        if (!controlKey(keyASCII)) {
          return false;
        }
      }
      
      if (intOnly && (keyASCII < 48 || keyASCII > 57)) {
        if (!controlKey(keyASCII)) {
          return false;
        }
      }
      
      return true;
    };
  }, [controlKey]); // Added controlKey dependency

  const returnSubmitFloat = useCallback((field, action, maxsize) => {
    return (event) => {
      const keyASCII = event.which || event.keyCode;
      
      if (keyASCII === 13 && action) {
        action();
        return true;
      }
      
      if (controlKey(keyASCII)) {
        return true;
      }
      
      // Allow minus sign
      if (keyASCII === 109 || keyASCII === 189) {
        return true;
      }
      
      // Allow digits
      if ((maxsize === undefined || field.value.length < maxsize) &&
          (keyASCII >= 48 && keyASCII <= 57)) {
        return true;
      }
      
      // Allow decimal point if not already present
      if ((maxsize === undefined || field.value.length < maxsize) &&
          (keyASCII === 190) && field.value.indexOf(".") === -1) {
        return true;
      }
      
      return false;
    };
  }, [controlKey]);

  const clearHistory = useCallback(() => {
    actionHistoryRef.current = [];
  }, []);

  const reset = useCallback(() => {
    console.log('Reset called - implement in specific algorithm');
  }, []);

  const undo = useCallback(() => {
    if (actionHistoryRef.current.length > 0) {
      actionHistoryRef.current.pop();
      reset();
      
      const len = actionHistoryRef.current.length;
      recordAnimationRef.current = false;
      for (let i = 0; i < len; i++) {
        actionHistoryRef.current[i][0](actionHistoryRef.current[i][1]);
      }
      recordAnimationRef.current = true;
    }
  }, [reset]);

  const isAllDigits = useCallback((str) => {
    for (let i = str.length - 1; i >= 0; i--) {
      if (str.charAt(i) < "0" || str.charAt(i) > "9") {
        return false;
      }
    }
    return true;
  }, []);

  const normalizeNumber = useCallback((input, maxLen) => {
    if (!isAllDigits(input) || input === "") {
      return input;
    } else {
      return ("OOO0000" + input).substr(-maxLen, maxLen);
    }
  }, [isAllDigits]);

  const setCodeAlpha = useCallback((code, newAlpha) => {
    console.log('Set code alpha:', code, newAlpha);
  }, []);

  const addCodeToCanvasBase = useCallback((code, start_x, start_y, line_height, standard_color, layer) => {
    layer = typeof layer !== 'undefined' ? layer : 0;
    const codeID = Array(code.length);
    
    for (let i = 0; i < code.length; i++) {
      codeID[i] = new Array(code[i].length);
      for (let j = 0; j < code[i].length; j++) {
        codeID[i][j] = getNextId();
        cmd("CreateLabel", codeID[i][j], code[i][j], start_x, start_y + i * line_height, 0);
        cmd("SetForegroundColor", codeID[i][j], standard_color);
        cmd("SetLayer", codeID[i][j], layer);
        if (j > 0) {
          cmd("AlignRight", codeID[i][j], codeID[i][j-1]);
        }
      }
    }
    return codeID;
  }, [cmd, getNextId]);

  const addReturnSubmit = useCallback((field, action) => {
    field.onkeydown = returnSubmit(field, action, 4, false);
  }, [returnSubmit]);

  const disableUI = useCallback(() => {
    console.log('UI disabled - implement in specific algorithm');
  }, []);

  const enableUI = useCallback(() => {
    console.log('UI enabled - implement in specific algorithm');
  }, []);

  return {
    // Core animation functions
    cmd,
    implementAction,
    getNextId,
    
    // UI control functions
    addControlToAlgorithmBar,
    addLabelToAlgorithmBar,
    addCheckboxToAlgorithmBar,
    addRadioButtonGroupToAlgorithmBar,
    addReturnSubmit,
    
    // Input handling
    returnSubmit,
    returnSubmitFloat,
    controlKey,
    
    // History and state management
    clearHistory,
    reset,
    undo,
    disableUI,
    enableUI,
    
    // Utility functions
    isAllDigits,
    normalizeNumber,
    setCodeAlpha,
    addCodeToCanvasBase,
    
    // References for state management
    actionHistory: actionHistoryRef,
    recordAnimation: recordAnimationRef
  };
};

export default useAlgorithm;