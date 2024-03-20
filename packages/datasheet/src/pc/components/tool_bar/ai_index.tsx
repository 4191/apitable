// import { Vika } from '@vikadata/vika';
import { useMount, useSize, useThrottleFn } from 'ahooks';
import { Input, Select } from 'antd';
import type { SelectProps } from 'antd';
import classNames from 'classnames';
import { get } from 'lodash';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import { useRouter } from 'next/router';
import * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { colorVars, useThemeColors } from '@apitable/components';
import { CollaCommandName } from '@apitable/core';
import { FilterOutlined, ArrowDownFilled, ArrowRightFilled } from '@apitable/icons';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { useAppSelector } from 'pc/store/react-redux';
import { ToolHandleType } from './interface';
// import { promptHeader, promptTargetPre, promptEnd } from './prompt';
import { ToolItem } from './tool_item';
import styles from './style.module.less';

const Col1 = '标题';
const Col2 = '专利PN号';
const Col3 = '专利摘要';
const Col4 = '解决问题';
const Col5 = '技术功效';
const Col6 = '申请日';

const AiIndexBase = () => {
  const router = useRouter();
  const queryAll = router?.query?.all ?? [];
  const dataSheetId = queryAll[0];
  const viewId = queryAll[1];

  const token = useAppSelector((state) => state.user.info!.apiKey);
  const apiToken = `Bearer ${token}`;

  const [aiVisible, setAiVisible] = useState(false);
  const [customField, setCustomField] = useState('');
  const [options, setOptions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [records, setRecords] = useState([]);
  const [cSearch, setCSearch] = useState('');
  const [groupByTableData, setGroupByTableData] = useState([]);

  const onSearch = (value: string) => {
    if (value) {
      // console.log('onSelect:', value);

      setCSearch(value);
    }
  };
  const onInputKeyDown = (e: any, idx: number) => {
    if (e.code === 'Enter') {
      setCSearch('');
      const o = options.find((item) => item.value === cSearch);
      if (!o) {
        // options.push({ value: cSearch, label: cSearch });
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
        if (i === idx) {
          return { ...item, custmoFieldValue: cSearch + '' };
        }
        return item;
      });
      setTableData(updatedTableData);

      console.log('onInputKeyDown:', e.code, options);
    }
  };

  const onSelect = (value: string, idx: number) => {
    const updatedTableData = tableData.map((item, i) => {
      if (i === idx) {
        return { ...item, custmoFieldValue: cSearch + '' };
      }
      return item;
    });
    setTableData(updatedTableData);
    console.log('onSelect no search:', value);
  };

  const promptHeader =
    '你是一个专利分类专家，你的任务是对专利进行分类。--- 符号内是一些专家已经分类过的专利数据。请学习后对后续给到你的专利进行分类。\n样例数据\n---\n';

  const promptTargetPre = '\n---\n需要被分类的数据如下\n公开号 ^ 标题 ^ 应用领域分类 ^ 技术效果改写总结 ^ 关键技术效果\n';

  const promptEnd =
    '\n返回数据格式\n|公开号 | 专利标题 | 分类 | 分类的推理逻辑 |\n返回的内容为 Markdown,不需要其他任何内容，我需要使用程序解析返回结果。如果不能确定分类就写"暂无分类"。';

  const promptFactory = ({ fewShotHeader, fewShotContent }) => {
    return (promptTarget) => {
      return promptHeader + fewShotHeader + fewShotContent + promptTargetPre + promptTarget + promptEnd;
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

    const fewShotHeader = `公开号 ^ 标题 ^ 应用领域分类 ^ ${customField} ^ 技术效果改写总结 ^ 关键技术效果\n`;
    const fewShotContent = indexedRecords.map((item, idx) => {
      return `${item['公开(公告)号']} ^ ${item['标题']}  ^ ${item['应用领域分类']} ^ ${item['custmoFieldValue']} ^ ${item['技术主题分类']} ^ ${item['[标]技术功效短语']}\n`;
    });

    const createPromptByTarget = promptFactory({ fewShotHeader, fewShotContent });

    console.log('---👍🏻 👍🏻 👍🏻 : updateData -> uploadObj', uploadObj);

    // todo: 循环调用接口，将prompt传递给后端，由后端调用aitable update接口更新table
    handleAiIndex(createPromptByTarget);

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

      const item = noIndexRecords[0];

      const promptTarget = `${item['公开(公告)号']} ^ ${item['标题']}  ^ ${item['应用领域分类']} ^ ${item['技术主题分类']} ^ ${item['[标]技术功效短语']}\n`;
      const prompt = createPromptByTarget(promptTarget);

      const requestOptions = {
        method: 'POST',
        headers: {
          Authorization: apiToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          datasheet: dataSheetId,
          record_id: '',
          field_name: 'ai标引',
        }),
      };
      console.log('---👍🏻 👍🏻 👍🏻 : handleAiIndex -> requestOptions', prompt, requestOptions);

      const url = 'http://192.168.5.24:8080/patent_classfication_v2';
      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log('---👍🏻 👍🏻 👍🏻 : updateData -> data', data);
        })
        .catch((error) => console.error('Error:', error));
    } catch (error) {
      console.error('Error update data:', error);
    }
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
      // console.log('---👍🏻 👍🏻 👍🏻 : fetchData -> data', recordData, data);

      setTableData(data);
      setGroupByTableData(groupByTable(data));

      // setTableData(Array.from(new Set(data.map((item) => item['应用领域分类']?.split('|')?.[0]))));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSelected = (option, idx) => {
    console.log('---👍🏻 👍🏻 👍🏻 : handleSelected -> option,idx', option, idx);
  };

  const groupByTable = (tableData = []) => {
    return tableData?.splice(0, 5);
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
        width={828}
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
                  <span>{item['应用领域分类']?.split('|')?.[0] ?? item['应用领域分类']}</span>
                  {/* <span>{item['战略新兴产业分类']}</span> */}

                  <Select
                    value={item?.custmoFieldValue}
                    className={classNames(styles.select)}
                    showSearch
                    style={{ width: '200px' }}
                    placeholder="请选择或输入回车创建"
                    // onChange={}
                    onSearch={onSearch}
                    onSelect={(e) => onSelect(e, idx)}
                    onInputKeyDown={(e) => onInputKeyDown(e, idx)}
                    onBlur={() => setCSearch('')}
                    options={options}
                  />
                </div>

                {!item.hiddenContent && (
                  <div key={idx} className={classNames(styles.pWrap)}>
                    <div className={classNames(styles.pHeader)}>
                      <div className={classNames(styles.pNumber)}>{item['公开(公告)号']}</div>

                      <div className={classNames(styles.pTitle)}>{item['标题']}</div>
                    </div>
                    <div className={classNames(styles.pConctent)}>
                      {item['技术主题分类']} {item['技术主题分类']} {item['技术主题分类']}
                      {item['技术主题分类']} {item['技术主题分类']} {item['技术主题分类']}
                      {item['技术主题分类']} {item['技术主题分类']} {item['技术主题分类']}
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

const valueUpload = {
  custom_field_name: '国籍',
  folder_id: 'aa8123d309cd4ae59be36fdd2ac8d1de',
  space_id: 'e28f4428b1a24ca9a3e2316f266e8ec9',
  item_model: [
    {
      key: '1000013783',
      name: '含有效成分的医用配制品',
      value: '台湾',
      ai_desc: '',
      field_id: '1000013783',
      field_name: '含有效成分的医用配制品',
      title: 'Smart CAR devices and DE CAR polypeptides for treating disease and methods for enhancing immune responses',
      patent_id: '9f8a002d-917c-4643-b81b-8c4d3aabd01d',
      pn_no: 'US11052111B2',
      tech_message: [],
      total_patent_ids: [
        '9f8a002d-917c-4643-b81b-8c4d3aabd01d',
        '13f11ea9-9e4a-406f-a35a-9038083756db',
        '55aaa01a-f75f-40d8-82f7-0ecd9dbe3fb5',
        'bdc35e3f-0827-42ca-9bae-29c56a57b853',
        'f6050d07-9d1a-43b0-9480-fdd2d8caacae',
        '55404538-562b-49ff-95fa-dc58dacf06c4',
        'd2169971-2c6c-434f-922d-c62418266e97',
        '3597be1f-95f9-4ba1-baa2-2f2d2ee84186',
        '3625c7fe-0ee3-4163-8b9e-fd791f59caeb',
        '2aaa65f8-881d-4432-a4a8-ef3bb4da4dbd',
      ],
      option_text: '台湾',
    },
  ],
};
