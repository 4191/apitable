import { useMount, useSize, useThrottleFn } from 'ahooks';
import classNames from 'classnames';
import { get } from 'lodash';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { colorVars, TextButton, useThemeColors } from '@apitable/components';
import {
  CollaCommandName,
  DATASHEET_ID,
  Events,
  ExecuteResult,
  FieldType,
  IDatasheetClientState,
  IGalleryViewProperty,
  IGridViewProperty,
  IKanbanViewProperty,
  IViewProperty,
  LayoutType,
  Player,
  ResourceType,
  RowHeightLevel,
  Selectors,
  StoreActions,
  Strings,
  t,
  UN_GROUP,
  ViewType,
} from '@apitable/core';
import { FilterOutlined } from '@apitable/icons';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { ToolHandleType } from './interface';
import { ToolItem } from './tool_item';
import styles from './style.module.less';

interface IHideFieldNode {
  id: string;
  type: ToolHandleType;
  viewType: ViewType;
  actualColumnCount: number;
  visibleColumnsCount: number;
  showLabel: boolean;
  disabled: boolean;
}

const AiIndexStep1 = (props) => {
  const { setStep, index, setCurrentIndex, currentIndex } = props;

  return (
    <div className={classNames(styles.step, styles.step1)}>
      <div className={styles.subTitle}>选择字段</div>

      <div className={styles.minHeight}>
        {index.map((item) => (
          <div
            key={item.key}
            onClick={() => {
              setCurrentIndex(item);
            }}
            className={classNames(styles.selectItem, { [styles.activeSelect]: item.key === currentIndex.key })}
          >
            {item.label}
          </div>
        ))}
      </div>

      <button onClick={() => setStep(2)} className={styles.btn}>
        下一步
      </button>
    </div>
  );
};

const AiIndexStep2 = (props) => {
  const { setStep } = props;
  const clList = [
    {
      key: 0,
      label: '单值',
    },
    {
      key: 1,
      label: '多值',
    },
  ];
  const jzList = [
    {
      key: 0,
      label: '基础',
    },
    {
      key: 1,
      label: '标准',
    },
    {
      key: 2,
      label: '高级',
    },
  ];
  const [cl, setCl] = useState(0);
  const [jz, setJz] = useState(1);

  return (
    <div className={classNames(styles.step, styles.step2)}>
      <header className={styles.subTitle}>
        字段： <b>性别</b>
      </header>
      <div className={styles.statistics}>
        <div>
          <span className={styles.blueNumber}>2</span>个选项
          <span className={styles.blueNumber2}>1</span>个选项可用
        </div>
        <span className={styles.blueNumberRight}>50%</span>
      </div>
      <div>
        <div className={styles.subTitle}>标引策略</div>
        <div className={styles.radio}>
          {clList.map((item) => (
            <div
              key={item.key}
              className={classNames({ [styles.activeItem]: cl === item.key })}
              onClick={() => {
                setCl(item.key);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className={styles.subTitle}>标引基准</div>
        <div className={styles.radio3}>
          {jzList.map((item) => (
            <div
              key={item.key}
              className={classNames({ [styles.activeItem]: jz === item.key })}
              onClick={() => {
                setJz(item.key);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
      <hr />
      <footer>
        <div>
          标引范围：当前专利列表（<b>100</b> 条专利）
        </div>
        <span>人工标引过此字段的专利无法被AI标引</span>
      </footer>

      <button onClick={() => setStep(1)} className={styles.backBtn}>
        上一步
      </button>
      <button onClick={() => setStep(3)} className={styles.btn}>
        开始标引
      </button>
    </div>
  );
};

const AiIndexStep3 = (props) => {
  const { setStep, currentStep } = props;
  const [schedule, setSchedule] = useState(0);
  const sleepTime = 3;

  useEffect(() => {
    if (currentStep === 3) {
      setTimeout(() => {
        setStep(4);
        setSchedule(0);
      }, sleepTime * 1000);

      setTimeout(
        () => {
          setSchedule(1);
        },
        (sleepTime * 1000) / 3,
      );
      setTimeout(
        () => {
          setSchedule(2);
        },
        (sleepTime * 2000) / 3,
      );
    }
  }, [currentStep]);

  const percent = [25, 50, 75][schedule] + '%';

  return (
    <div className={classNames(styles.step, styles.step3)}>
      <div className={styles.loadingImg} />
      <div className={styles.loadingPercent}>
        <div className={styles.loadingBar}>
          <div style={{ width: percent }} />
        </div>
        <span>{percent}</span>
      </div>
      <div className={styles.loadingText}>
        {schedule === 0 && 'AI 标引正在根据您历史标引数据进行学习和总结，形成独属于您的 AI 模型'}
        {schedule === 1 && '技术分类、应用领域等基于专利信息的分类字段更适合 AI 进行学习和标引'}
        {schedule === 2 && 'AI 正在进行标引，稍后您可以对 AI 标引结果进行校验。如您需要暂时离开，稍后也可以在任务中心查看标引进度'}
      </div>
    </div>
  );
};
const AiIndexStep4 = (props) => {
  const { setStep, index, setCurrentIndex, currentIndex } = props;

  const tableData = [
    {
      key: '字段名',
      value: '性别',
    },
    {
      key: '可用选项',
      value: '2/2',
    },
    {
      key: '标引策略',
      value: '单值',
    },
    {
      key: '标引基准',
      value: '标准',
    },
    {
      key: '选择专利数量',
      value: '1,629',
    },
    {
      key: '可标引专利数量',
      value: '1608',
    },
  ];

  return (
    <div className={classNames(styles.step, styles.step4)}>
      <div className={styles.step4Wrap}>
        <div className={styles.successImg} />
        <div className={styles.successTitle}>
          成功标引<span>1,601</span>篇专利
        </div>
        <div className={styles.successDesc}>AI 标引已完成，您可以查看标引总结并继续操作</div>
      </div>
      <div className={styles.analyticTable}>
        <ul>
          {tableData.map((item) => (
            <li key={item.key}>
              <div className={styles.key}>{item.key}</div>
              <div className={styles.value}>{item.value}</div>
            </li>
          ))}
        </ul>
      </div>

      <button onClick={() => setStep()} className={styles.btn}>
        {/* 过滤ai标引的内容 */}
        校验 AI 标引
      </button>

      <button onClick={() => setStep(1)} className={styles.backBtn}>
        尝试其他字段
      </button>
    </div>
  );
};

const modalTitle = (step: number) => {
  switch (step) {
    case 1:
      return (
        <div
        // onClick={() => {
        //   console.log(1233333);
        // }}
        >
          AI 标引
        </div>
      );
    case 2:
      return <div>标引设置</div>;
    case 3:
      return <div>标引中</div>;
    case 4:
      return <div>标引结束</div>;

    default:
      break;
  }
};

const AiIndexBase = () => {
  const [aiVisible, setAiVisible] = useState(true);
  const [step, setStep] = useState(4);
  const [index] = useState([
    { key: 'gender', label: '性别' },
    { key: 'nation', label: '国籍' },
  ]);
  const [currentIndex, setCurrentIndex] = useState(index[0]);

  useEffect(() => {}, [aiVisible]);

  return (
    <div className="ai">
      <ToolItem
        id={'AIIndex'}
        showLabel
        disabled={false}
        className={'AIIndex'}
        icon={<FilterOutlined size={16} color={colorVars.primaryColor} className={styles.toolIcon} />}
        text={'AI 标引' + step}
        onClick={() => {
          setAiVisible(true);
        }}
      />

      <Modal
        open={aiVisible}
        width={528}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setAiVisible(false);
          setStep(1);
        }}
        destroyOnClose
        footer={null}
        centered
        title={modalTitle(step)}
      >
        {step === 1 && (
          <AiIndexStep1 setStep={(n) => setStep(n)} index={index} currentIndex={currentIndex} setCurrentIndex={(n) => setCurrentIndex(n)} />
        )}
        {step === 2 && (
          <AiIndexStep2
            setStep={(n) => {
              setStep(n);

              // if (n === 3) {
              //   setTimeout(() => {
              //     setStep(4);
              //   }, 4000);
              // }
            }}
            currentIndex={currentIndex}
          />
        )}
        {step === 3 && <AiIndexStep3 setStep={(n) => setStep(n)} currentStep={step} />}
        {step === 4 && <AiIndexStep4 setStep={(n) => setStep(n)} currentIndex={currentIndex} />}
      </Modal>
    </div>
  );
};

export const AiIndex = memo(AiIndexBase);
