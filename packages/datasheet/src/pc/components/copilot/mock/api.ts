import { ICopilotMessageTurn } from '../hooks/use_copilot';

export const token = {};

export function fetchMessages() {
  return new Promise<ICopilotMessageTurn[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          question: 'Hello!',
          answer: {
            text: 'Hello, I am Copilot!',
            error: '',
            loading: false,
            controller: null,
          },
        },
        {
          question: 'what\'s your name?',
          answer: {
            text: 'My name is XXXXXX!',
            error: '',
            loading: false,
            controller: null,
          },
        },
      ]);
    }, 1000);
  });
}