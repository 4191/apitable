import classNames from 'classnames';
import RcTextArea from 'rc-textarea';
import { useContext, useRef, useState } from 'react';
import { Button, DropdownSelect } from '@apitable/components';
import { ClearOutlined, PauseFilled } from '@apitable/icons';
import { KeyCode, stopPropagation } from 'pc/utils';
import { CopilotContext } from '../context';
import styles from '../copilot.module.less';

export function CopilotFooter() {

  const { messageString, setMessageString, sendMessage, isGenerating, abort, clear } = useContext(CopilotContext)!;
  const textAreaRef = useRef<RcTextArea>(null);
  const [isTextAreaFocused, setTextAreaFocused] = useState(false);

  const confirmBtn = (e?: React.MouseEvent) => {
    if(isGenerating) {
      return;
    }
    e?.stopPropagation();
    sendMessage({ message: messageString });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.metaKey) return;
    if (e.keyCode === KeyCode.Enter) {
      confirmBtn();
      stopPropagation(e);
      e.preventDefault();
    }
  };

  const clearMessages = () => {
    clear();
  };

  // const modelSelector = (
  //   <DropdownSelect
  //     disabled
  //     triggerStyle={{
  //       minWidth: '64px',
  //     }}
  //     openSearch
  //     searchPlaceholder={'Model'}
  //     value={'analysis'}
  //     options={[
  //       {
  //         label: '数据分析助手',
  //         value: 'analysis',
  //       },
  //       {
  //         label: '检索帮助中心',
  //         value: 'helper-center',
  //       },
  //     ]}
  //     onSelected={(node) => {
  //       console.log(node);
  //     }}
  //   />
  // );

  return (
    <div className={styles.footer}>
      <div className={styles.tools}>
        {
          isGenerating &&
            <div className={styles.stopBtn}>
              <Button
                variant="jelly"
                size="small"
                prefixIcon={<PauseFilled />}
                onClick={abort}
              >
                Stop
              </Button>
            </div>
        }
        {/* { modelSelector } */}
        <Button
          className={styles.newChatBtn}
          size="small"
          onClick={clearMessages}
          prefixIcon={<ClearOutlined />}
          variant="fill"
          disabled={false}
        >
          新会话
        </Button>
      </div>
      <div
        className={classNames({
          [styles.messageInputContainer]: true,
          [styles.focused]: isTextAreaFocused,
        })}
        onClick={() => textAreaRef.current?.focus()}
      >
        <RcTextArea
          ref={textAreaRef}
          className={styles.rcTextArea}
          autoSize={{ maxRows: 4, minRows: 1 }}
          placeholder={'与AI 助手对话...'}
          value={messageString}
          onChange={(e) => setMessageString(e.target.value)}
          onFocus={() => setTextAreaFocused(true)}
          onBlur={() => setTextAreaFocused(false)}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.submitContainer}>
          <Button onClick={confirmBtn} color="primary" size="small" disabled={isGenerating}>
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}