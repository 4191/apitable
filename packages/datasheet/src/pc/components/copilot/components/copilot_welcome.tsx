import { useContext } from 'react';
import { Typography } from '@apitable/components';
import PatsnapCopilotIcon from 'static/icon/robot/patsnap_copilot.svg';
import { CopilotContext } from '../context';
import styles from '../copilot.module.less';

export function CopilotWelcome() {
  const { sendMessage, isGenerating, setMessageString } = useContext(CopilotContext)!;

  const send = (message: string) => {
    if(isGenerating) {
      return;
    }
    setMessageString('');
    sendMessage({ message });
  };

  const messages = [
    'In our data, what information is related to each other?',
    'In our data, what information is related to each other?',
    'In our data, what information is related to each other?',
    'In our data, what information is related to each other?',
    'In our data, what information is related to each other?',
    'In our data, what information is related to each other?',
    'In our data, what information is related to each other?',
  ].map((message, index) => {
    return <Typography key={index} onClick={() => send(message)}>{message}</Typography>;
  });

  return (
    <div className={styles.welcome}>
      <div className={styles.info}>
        <PatsnapCopilotIcon />
        <h3>Patsnap Copilot</h3>
        <p>基于您的视图生成数据分析/可视化</p>
      </div>
      <div className={styles.message}>
        <div>以下是一些示例问题，点击其中一条问题试一试：</div>
        { messages }
      </div>
    </div>
  );
}