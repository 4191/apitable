import classNames from 'classnames';
import RcTextArea from 'rc-textarea';
import { useRef, useState, type MouseEvent } from 'react';
import { Button, DropdownSelect } from '@apitable/components';
import { ClearOutlined } from '@apitable/icons';
import styles from '../copilot.module.less';

export function CopilotFooter() {
  const textAreaRef = useRef<RcTextArea>(null);
  const [isTextAreaFocused, setTextAreaFocused] = useState(false);

  const confirmBtn = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const modelSelector = (
    <DropdownSelect
      disabled={false}
      triggerStyle={{
        minWidth: '64px',
      }}
      openSearch
      searchPlaceholder={'Model'}
      value={'analysis'}
      options={[
        {
          label: '数据分析助手',
          value: 'analysis',
        },
        {
          label: '检索帮助中心',
          value: 'helper-center',
        },
      ]}
      onSelected={(node) => {
        console.log(node);
      }}
    />
  );

  return (
    <div className={styles.footer}>
      <div className={styles.tools}>
        { modelSelector }
        <Button onClick={confirmBtn} prefixIcon={<ClearOutlined />} variant="fill" disabled={false}>新会话</Button>
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
          onFocus={() => setTextAreaFocused(true)}
          onBlur={() => setTextAreaFocused(false)}
        />
        <div className={styles.submitContainer}>
          <Button onClick={confirmBtn} color="primary" size="small" disabled={false}>
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}