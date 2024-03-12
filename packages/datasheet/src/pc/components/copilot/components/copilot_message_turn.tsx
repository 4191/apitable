import PatsnapCopilotIcon from 'static/icon/robot/patsnap_copilot.svg';
import styles from '../copilot.module.less';
import { type ICopilotMessageTurn } from '../hooks/use_copilot';
interface ICopilotMessageTurnProps {
  turn: ICopilotMessageTurn;
}

export function CopilotMessageTurn({ turn }: ICopilotMessageTurnProps) {

  let answer= <p>{turn.answer.loading ? '思考中...' : ''}</p>;
  if(turn.answer.error) {
    answer = <p>{ turn.answer.text || turn.answer.error }</p>;
  } else if(turn.answer.finishData) {
    answer = <p dangerouslySetInnerHTML={{ __html: turn.answer.finishData.engine_result.plain_result }} />;
  } else if (turn.answer.text) {
    answer = <p>{ turn.answer.text }</p>;
  }

  return (
    <div className={styles.messageTurn}>
      <div className={styles.question}>
        <div className={styles.left}>
          <div className={styles.message}>{ turn.question }</div>
        </div>
        <div className={styles.right}>
          <div className={styles.avatar}>J</div>
        </div>
      </div>
      <div className={styles.answer}>
        <div className={styles.left}>
          <div className={styles.avatar}>
            <PatsnapCopilotIcon />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.message}>
            { answer }
          </div>
        </div>
      </div>
    </div>
  );
}