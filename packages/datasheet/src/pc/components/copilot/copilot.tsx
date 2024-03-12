import {
  Selectors,
  IReduxState,
} from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import { CopilotFooter } from './components/copilot_footer';
import { CopilotMessageTurn } from './components/copilot_message_turn';
import { CopilotContext } from './context';
import { useCopilot } from './hooks/use_copilot';
import styles from './copilot.module.less';

interface ICopilot {
  onClose: (visible: false) => void;
}

export function Copilot(props: ICopilot) {
  const copilot = useCopilot();
  const { messages, isLoading, contentRef } = copilot;

  const view = useAppSelector((state: IReduxState) => Selectors.getCurrentView(state));

  const messageContent = messages.map((turn) => {
    return <CopilotMessageTurn key={turn.uid} turn={turn}/>;
  });

  const loadingContent = <div>Loading...</div>;

  const content = isLoading ? loadingContent : messageContent.length ? messageContent : <div>No messages</div>;

  return (
    <CopilotContext.Provider value={copilot}>
      <div className={styles.copilot}>
        <div className={styles.header}>
          <div className={styles.title}>
            <span>Copilot</span>
            <span className={styles.viewName}>{view?.name}</span>
          </div>
          <div className={styles.closeBtn}>
            <CloseOutlined onClick={() => props.onClose(false)}/>
          </div>
        </div>
        <div className={styles.content} ref={contentRef}>
          { content }
        </div>
        <CopilotFooter />
      </div>
    </CopilotContext.Provider>
  );
}