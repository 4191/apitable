// import { Vika } from '@vikadata/vika';
import { useMount, useSize, useThrottleFn } from 'ahooks';
import { Input, Select } from 'antd';
import type { SelectProps } from 'antd';
import classNames from 'classnames';

import { get } from 'lodash';
import { ShortcutActionManager, ShortcutActionName } from 'modules/shared/shortcut_key';
import * as React from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { colorVars, useThemeColors } from '@apitable/components';
import { CollaCommandName } from '@apitable/core';

import { FilterOutlined, ArrowDownFilled, ArrowRightFilled } from '@apitable/icons';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { ToolHandleType } from './interface';
import { ToolItem } from './tool_item';
import styles from './style.module.less';

const AiIndexBase = () => {
  const [aiVisible, setAiVisible] = useState(false);
  const [customField, setCustomField] = useState('');

  // const options: SelectProps['options'] = [];
  const [options, setOptions] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [records, setRecords] = useState([]);
  const [cSearch, setCSearch] = useState('');

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

  const updateData = async () => {
    // 整理传递给后端的内容
    const uploadObj = {
      customField,
      indexedRecords: tableData.filter((item) => {
        return item.custmoFieldValue;
      }),
    };
    console.log('---👍🏻 👍🏻 👍🏻 : updateData -> uploadObj', uploadObj);

    return;

    // todo: 调用接口，更新table
    try {
      const apiToken = 'uskNCnGTXxPVuWJIF9XRSSD';
      const url = 'http://localhost:3000/fusion/v1/datasheets/dst3bqzbsn0535qb7G/records?viewId=viwhKm8cSFr2N&fieldKey=name';
      const requestOptions = {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          records: records.slice(0, 8),
        }),
      };

      fetch(url, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log('---👍🏻 👍🏻 👍🏻 : updateData -> data', data);
        })
        .catch((error) => console.error('Error:', error));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/fusion/v1/datasheets/dst3bqzbsn0535qb7G/records?viewId=viwhKm8cSFr2N&fieldKey=name', {
        headers: {
          Authorization: 'Bearer uskNCnGTXxPVuWJIF9XRSSD',
        },
      });
      const res = await response.json();
      const recordData = res?.data?.records ?? [];

      setRecords(recordData);
      const data = recordData?.map?.((item) => item.fields) ?? [];
      console.log('---👍🏻 👍🏻 👍🏻 : fetchData -> data', recordData, data);

      setTableData(data);
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

  return (
    <div className="ai">
      <ToolItem
        id={'AIIndex'}
        showLabel
        disabled={false}
        className={'AIIndex'}
        icon={<FilterOutlined size={16} color={colorVars.primaryColor} className={styles.toolIcon} />}
        text={'AI 标引 demo'}
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
            {tableData?.map?.((item, idx) => (
              <>
                <div key={idx} className={classNames(styles.pBar)}>
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
