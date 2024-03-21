// import { Vika } from '@vikadata/vika';
import { useMount, useSize, useThrottleFn } from 'ahooks';
import { Input, Select } from 'antd';
import type { SelectProps } from 'antd';
import classNames from 'classnames';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { useRouter } from 'next/router';
import * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { colorVars, useThemeColors } from '@apitable/components';
import { FilterOutlined, ArrowDownFilled, ArrowRightFilled } from '@apitable/icons';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useAppSelector } from 'pc/store/react-redux';
import { ConcurrencyController } from './ConcurrencyController';
import { ToolItem } from './tool_item';
import styles from './style.module.less';

const Col1 = '标题';
const Col2 = '专利PN号';
const Col3 = '专利摘要';
const Col4 = '解决问题';
const Col5 = '技术功效';
// const Col1 = '标题';
// const Col2 = '专利PN号';
// const Col3 = '专利摘要';
// const Col4 = '解决问题';
// const Col5 = '技术功效';

const AiIndexBase = () => {
  const router = useRouter();
  const queryAll = router?.query?.all ?? [];
  const dataSheetId = queryAll[0];
  const viewId = queryAll[1];

  const token = useAppSelector((state) => state.user.info!.apiKey);
  const apiToken = `Bearer ${token}`;

  const jzList = [
    {
      key: 0,
      label: 'Tech Topic',
    },
    {
      key: 1,
      label: 'Application Domain',
    },
    {
      key: 2,
      label: 'Others...',
    },
  ];
  const [jz, setJz] = useState(1);
  const [aiVisible, setAiVisible] = useState(false);
  const [customField, setCustomField] = useState('');
  const [options, setOptions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [records, setRecords] = useState([]);
  const [cSearch, setCSearch] = useState('');
  const [groupByTableData, setGroupByTableData] = useState([]);

  const onSearch = (value: string) => {
    if (value) {
      setCSearch(value);
    }
  };
  const onInputKeyDown = (e: any, record) => {
    if (e.code === 'Enter') {
      setCSearch('');
      const o = options.find((item) => item.value === cSearch);
      if (!o) {
        setOptions([
          ...options,
          {
            value: cSearch,
            label: cSearch,
          },
        ]);
      }

      // 赋值
      const updatedTableData = tableData.map((item, i) => {
        const keyId = '专利PN号';

        if (item[keyId] === record[keyId]) {
          item.custmoFieldValue = cSearch + '';
          return item;
        }
        return item;
      });
      setTableData(updatedTableData);
    }
  };

  const onSelect = (value: string, record) => {
    const keyId = '专利PN号';
    const updatedTableData = tableData.map((item, i) => {
      if (item[keyId] === record[keyId]) {
        item.custmoFieldValue = value + '';
        return item;
      }
      return item;
    });
    setTableData(updatedTableData);
  };

  const promptFactory = (promptHeader, fewShotContent) => {
    const promptTargetPre = '\n需要被分类的数据如下\n';
    const promptEnd =
      '\n返回分类结果，需要严格限制输出的内容，只能返回分类结果值，不需要任何其他的描述信息或其他内容。如果不能确定分类就写"暂无标引"。';

    return (promptTarget) => {
      return promptHeader + fewShotContent + promptTargetPre + promptTarget + promptEnd;
    };
  };

  const updateData = async () => {
    // 整理传递给后端的内容
    const uploadObj = {
      customField,
      indexedRecords: tableData.filter((item) => {
        return item.custmoFieldValue;
      }),
    };

    const indexedRecords = tableData.filter((item) => {
      return item.custmoFieldValue;
    });

    const indexValues = indexedRecords.map((item) => item.custmoFieldValue);

    const promptHeader = `你是一个专利分类专家，你的任务是对专利进行分类。提供了${[...new Set(indexValues)].join(
      ',',
    )}几种分类\n我现在提供一些已经分类好的专利数据，内容如下：\n`;

    const fewShotContent = indexedRecords
      .map((item, idx) => {
        // return `${item['公开(公告)号']} ^ ${item['标题']}  ^ ${item['应用领域分类']} ^ ${item['custmoFieldValue']} ^ ${item['技术主题分类']} ^ ${item['[标]技术功效短语']}\n`;
        return `专利${idx + 1}:\n${Col1}: ${item[Col1]}\n${Col2}: ${item[Col2]}\n${Col3}: ${item[Col3]}\n${Col4}: ${item[Col4]}\n${Col5}: ${
          item[Col5]
        }\n分类结果：${item['custmoFieldValue']}\n`;
      })
      ?.join('\n');

    const createPromptByTarget = promptFactory(promptHeader, fewShotContent);
    // todo: 循环调用接口，将prompt传递给后端，由后端调用aitable update接口更新table
    handleAiIndex(createPromptByTarget);
    // todo: 新增一列

    // todo: 自动增加一列，调update接口，遍历records
  };

  const handleAiIndex = (createPromptByTarget) => {
    // todo: 调用接口，更新table
    try {
      const noIndexRecords = tableData.filter((item) => {
        return !item?.custmoFieldValue;
      });

      if (noIndexRecords.length < 1) {
        alert('index done!');
      }

      const controller = new ConcurrencyController(3); // 创建并发控制器，最大并发数为4

      records.forEach((record, idx) => {
        const item = record.fields;

        // 将更新操作包装为并发控制器的任务
        controller.addTask(
          () =>
            new Promise((resolve) => {
              const promptTarget = `${Col1}: ${item[Col1]}\n${Col2}: ${item[Col2]}\n${Col3}: ${item[Col3]}\n${Col4}: ${item[Col4]}\n${Col5}: ${item[Col5]}\n`;
              const prompt = createPromptByTarget(promptTarget);

              fetchUpdateData(prompt, record.recordId, idx).then(() => {
                resolve(); // 任务完成
              });
            }),
        );
      });
    } catch (error) {
      console.error('Error update data:', error);
    }
  };

  const fetchUpdateData = (prompt, recordId: string, idx) => {
    const requestOptions = {
      method: 'POST',
      headers: {
        Authorization: apiToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        datasheet: dataSheetId,
        record_id: recordId,
        field_name: customField,
      }),
    };
    console.log('---👍🏻 👍🏻 👍🏻 : handleAiIndex -> requestOptions \n', idx + 1, requestOptions);

    const url = 'http://192.168.5.24:8080/patent_classfication_v2';
    return fetch(url, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.error('fetchUpdateData Error:', error));
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/fusion/v1/datasheets/${dataSheetId}/records?viewId=${viewId}&fieldKey=name`, {
        headers: {
          Authorization: apiToken,
        },
      });
      const res = await response.json();
      const recordData = res?.data?.records ?? [];

      setRecords(recordData);
      const data = recordData?.map?.((item) => item.fields) ?? [];

      setTableData(data);
      setGroupByTableData(groupByTable(data));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const groupByTable = (tableData = []) => {
    const data = [];
    tableData.forEach((item) => {
      const id = item[Col5]?.slice(0, 6);

      const isIn = data?.find((d) => {
        return d[Col5]?.slice(0, 6) === id;
      });

      if (!isIn) {
        data.push(item);
      }
    });

    return data;
  };

  return (
    <div className="ai">
      <ToolItem
        id={'AIIndex'}
        showLabel
        disabled={false}
        className={'AIIndex'}
        icon={<FilterOutlined size={16} color={colorVars.primaryColor} className={styles.toolIcon} />}
        text={'AI 标引'}
        onClick={() => {
          setAiVisible(true);
        }}
      />

      <Modal
        open={aiVisible}
        className="aiIndexModal"
        wrapClassName="aiIndexModalWrap"
        width={'85%'}
        bodyStyle={{ padding: 0 }}
        onCancel={() => {
          setAiVisible(false);
        }}
        onOk={() => {
          setAiVisible(false);
          updateData();
        }}
        destroyOnClose
        closeIcon={<></>}
        centered
        okText={'确定'}
        cancelText={'取消'}
      >
        <div className={classNames(styles.radio, styles.radio3, styles.radio4)}>
          {jzList.map((item, idx) => (
            <div
              key={idx}
              className={classNames({ [styles.activeItem]: jz === item.key })}
              onClick={() => {
                setJz(item.key);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>

        <div className={classNames(styles.aiIndex)}>
          <div className={classNames(styles.header)}>
            <div className={classNames(styles.aiIndex)}>应用领域分类</div>
            <div className={classNames(styles.input)}>
              <Input
                className={classNames(styles.inputComp)}
                value={customField}
                onChange={(e) => {
                  setCustomField(e.target.value);
                }}
                placeholder={'输入字段名'}
                bordered={false}
              />
            </div>
          </div>

          <div className={classNames(styles.list)}>
            {groupByTableData?.map?.((item, idx) => (
              <>
                <div key={idx + 'hidden'} className={classNames(styles.pBar)}>
                  {!item?.hiddenContent ? (
                    <ArrowDownFilled
                      size={16}
                      color={colorVars.primaryColor}
                      className={styles.toolIcon}
                      onClick={() => {
                        const updatedTableData = tableData.map((item, i) => {
                          if (i === idx) {
                            return { ...item, hiddenContent: !item.hiddenContent };
                          }
                          return item;
                        });
                        setTableData(updatedTableData);
                      }}
                    />
                  ) : (
                    <ArrowRightFilled
                      size={16}
                      color={colorVars.primaryColor}
                      className={styles.toolIcon}
                      onClick={() => {
                        const updatedTableData = tableData.map((item, i) => {
                          if (i === idx) {
                            return { ...item, hiddenContent: !item.hiddenContent };
                          }
                          return item;
                        });
                        setTableData(updatedTableData);
                      }}
                    />
                  )}
                  {/* <span>{item['应用领域分类']?.split('|')?.[0] ?? item['应用领域分类']}</span> */}
                  <span>{item[Col5]?.slice(0, 6)}</span>

                  <Select
                    value={item?.custmoFieldValue}
                    className={classNames(styles.select)}
                    showSearch
                    style={{ width: '200px' }}
                    placeholder="请选择或输入回车创建"
                    // onChange={}
                    onSearch={onSearch}
                    onSelect={(e) => onSelect(e, item)}
                    onInputKeyDown={(e) => onInputKeyDown(e, item)}
                    onBlur={() => setCSearch('')}
                    options={options}
                  />
                </div>

                {!item.hiddenContent && (
                  <div key={idx} className={classNames(styles.pWrap)}>
                    <div className={classNames(styles.pHeader)}>
                      <div className={classNames(styles.pNumber)}>{item['专利PN号']}</div>

                      <div className={classNames(styles.pTitle)}>{item['标题']}</div>
                    </div>
                    <div className={classNames(styles.pConctent)}>
                      {item['专利摘要']} {item['技术功效']}
                    </div>
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export const AiIndex = memo(AiIndexBase);
