import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useState, useEffect } from 'react';
import { fetchMessages, token } from '../mock/api';

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

// export interface ICopilotMessageTurn {
//   id: string;
//   question: string;
//   answer: {
//     text: string;
//   };
//   isError: boolean;
//   isLoading: boolean;
// }

export function useCopilot() {
  const [messages, setMessages] = useState<ICopilotMessageTurn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  function sendMessage() {
    fetchEventSource('https://qa-lab-service.zhihuiya.com/lab-service/message/connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.token || ''}`,
      },
      // signal: controller.signal,
      body: JSON.stringify({
        chat_id: 'f6135271f20c40da982e8e32dc95dbbd',
        type: 'Normal',
        question: '你好啊！',
        app_id: 'patent_webgpt', // patent， pharm
      }),
      async onopen(response) {
        // if (response.status === 401) {
        //   logoutWithAuthToast();
        //   throw new Error('401');
        // }
      },
      onmessage(ev) {
        let data = null;
        try {
          data = JSON.parse(ev.data);
        } catch (error) {}

        console.log('onmessage', data);

        // if(data.type === 'last_answer') {
        //   let finishData = null;
        //   try {
        //     finishData = JSON.parse(data.content);
        //   } catch (error) {}
        //   message.answer.finishData = finishData;
        //   console.log('onmessage Finish', finishData);
        // } else if(data.type === 'streaming') {
        //   message.answer.text += data.content;
        // }

        // scrollToBottomByDelay();
      },
      onclose() {
        // message.answer.loading = false;
      },
      onerror(error) {
        // console.log('onerror: ', error);
        // message.answer.error = 'error';
        // message.answer.loading = false;
        throw error;
      }
    });
  }

  return {
    messages,
    isLoading,
    sendMessage,
  };
}