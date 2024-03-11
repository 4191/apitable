import {
  Selectors,
  IReduxState,
} from '@apitable/core';
import { CloseOutlined } from '@apitable/icons';
import { useAppSelector } from 'pc/store/react-redux';
import { CopilotFooter } from './components/copilot_footer';
import { CopilotMessageTurn } from './components/copilot_message_turn';
import { useCopilot } from './hooks/use_copilot';
import styles from './copilot.module.less';

interface ICopilot {
  onClose: (visible: false) => void;
}

export function Copilot(props: ICopilot) {
  const { messages, isLoading, sendMessage } = useCopilot();

  const view = useAppSelector((state: IReduxState) => Selectors.getCurrentView(state));

  const messageContent = messages.map((turn, index) => {
    return <CopilotMessageTurn key={index} />;
  });

  const loadingContent = <div>Loading...</div>;

  const content = isLoading ? loadingContent : messageContent;

  return (
    <div className={styles.paCopilot}>
      <div className={styles.header}>
        <div className={styles.title}>
          <span>Copilot</span>
          <span className={styles.viewName}>{view?.name}</span>
        </div>
        <div className={styles.closeBtn}>
          <CloseOutlined onClick={() => props.onClose(false)}/>
        </div>
      </div>
      <div className={styles.content}>
        { content }
      </div>
      <CopilotFooter />
    </div>
  );
}