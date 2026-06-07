import { createContext, useContext } from 'react';

export const AckAiModelsContext = createContext<number>(2);

export const useAckAiModels = () => useContext(AckAiModelsContext);
