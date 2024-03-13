import { fetchEventSource } from '@microsoft/fetch-event-source';
import { cloneDeep } from 'lodash';
import { useState, useEffect, useRef } from 'react';
import { fetchMessages, token } from '../mock/api';

class CopilotError extends Error {}
export interface IMessageFinishData {
  error_message?: string;
  intermediate_steps?: number;
  plain_result: string;
  polished_result: string;
  status: 'succcess';
  time_used: number;
  references?: {
      name: string;
      url: string;
      favicon_url: string;
      content: string;
  }[];
}

export interface ICopilotMessageTurn {
  uid: string;
  question: string;
  // type: MessageType;
  answer: {
      controller: AbortController | null;
      text: string;
      error: string;
      loading: boolean;
      finishData?: {
          engine_result: IMessageFinishData;
      } | null;
  }
}

let id = 0;
function getUID() {
  return `${++id}_${Date.now()}`;
}

export function useCopilot() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ICopilotMessageTurn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messageString, setMessageString] = useState<string>('');

  const currentMessageTurn = messages[messages.length - 1];
  const isGenerating = currentMessageTurn?.answer.loading;

  useEffect(() => {

    async function init() {
      setIsLoading(true);
      try {
        const messages = await fetchMessages();
        setMessages(messages);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }

    init();
  }, []);

  useEffect(() => {
    try {
      contentRef.current?.scrollTo(0, contentRef.current.scrollHeight);
    } catch (error) {
      console.log('scrollToBottomByDelay error: ', error);
    }
  }, [currentMessageTurn]);

  function updateMessageTurn(turn: ICopilotMessageTurn, cb: (turn: ICopilotMessageTurn) => ICopilotMessageTurn){
    setMessages((messages) => {
      return messages.map((item) => {
        if(item.uid === turn.uid) {
          return cb(cloneDeep(item));
        }
        return item;
      });
    });
  }

  function sendMessage({ message }: { message: string }) {
    if(!message) return;

    const question = message.trim();

    if(isLoading || !question) return;

    setMessageString('');

    const controller = new AbortController();

    const messageTurn: ICopilotMessageTurn = {
      uid: getUID(),
      question,
      answer: {
        controller,
        text: '',
        error: '',
        loading: true,
      }
    };

    setMessages((messages) => [...messages, messageTurn]);

    fetchEventSource('https://qa-lab-service.zhihuiya.com/lab-service/message/connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.token || ''}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        chat_id: 'f6135271f20c40da982e8e32dc95dbbd',
        type: 'Normal',
        question,
        app_id: 'patent_webgpt', // patent， pharm
      }),
      onopen(response) {
        if (response.status === 401) {
          throw new CopilotError('401 身份认证过期!');
        }
        return Promise.resolve();
      },
      onmessage(ev) {
        let data: any = null;
        try {
          data = JSON.parse(ev.data);
        } catch (error) {
          console.error('流数据解析失败: ', ev);
        }

        if(!data) {
          console.log('[Chat] - close with no data');
          return;
        }

        console.log('onmessage: ', data);

        if(data?.type === 'last_answer') {
          let finishData = null;
          try {
            finishData = JSON.parse(data.content);
          } catch (error) {}
          updateMessageTurn(messageTurn, (turn) => {
            turn.answer.finishData = finishData;
            return turn;
          });
          console.log('onmessage Finish: ', finishData);
        } else if(data.type === 'streaming') {
          updateMessageTurn(messageTurn, (turn) => {
            turn.answer.text += data.content;
            return turn;
          });
        }
      },
      onclose() {
        updateMessageTurn(messageTurn, (turn) => {
          turn.answer.loading = false;
          return turn;
        });
      },
      onerror(error) {
        updateMessageTurn(messageTurn, (turn) => {
          const errorMessage = error instanceof CopilotError ? `${error}` : 'Unknow Error';
          turn.answer.loading = false;
          turn.answer.error = errorMessage;
          return turn;
        });
        throw error;
      }
    })
      .catch((error) => {
        console.log('[fetchEventSource Error]: ', error);
      });
  }

  function abort() {
    if(!currentMessageTurn) return;
    updateMessageTurn(currentMessageTurn, (turn) => {
      turn.answer.controller?.abort();
      turn.answer.loading = false;
      turn.answer.error = 'abort';
      return turn;
    });
  }

  function clear() {
    abort();
    setMessages([]);
  }

  return {
    messages,
    isLoading,
    sendMessage,
    messageString,
    setMessageString,
    updateMessageTurn,
    currentMessageTurn,
    isGenerating,
    abort,
    clear,
    contentRef,
  };
}