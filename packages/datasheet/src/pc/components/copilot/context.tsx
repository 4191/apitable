import { createContext } from 'react';
import { useCopilot } from './hooks/use_copilot';

export const CopilotContext = createContext<ReturnType<typeof useCopilot> | null>(null);