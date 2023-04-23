import { Button, Form, Input, Menu, Modal, Select, Table, message } from "antd";
import { ColumnsType } from "antd/es/table";
import useQuestionList from "hooks/useQuestionList";
import { request } from "http";
import { NextPage } from "next";
import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import useSWR, { SWRConfig } from "swr";
import { Question } from "typings/index";

const items = [
  {
    text: "前端",
    value: "front_end",
  },
  {
    text: "后端",
    value: "back_end",
  },
  {
    text: "运维",
    value: "ops",
  },
];

const Detail = () => {
  const { data, mutate } = useQuestionList();
  const [question, setQuestion] = useState<Question>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [type, setType] = useState<"add" | "edit" | "detail">("add");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const columns = useMemo<ColumnsType<any>>(() => {
    return [
      {
        title: "题目名称",
        dataIndex: "question",
        key: "id",
        width: 300,
        ellipsis: true,
      },
      {
        title: "类别",
        dataIndex: "tag_type",
        render(val, record) {
          if (val === "front_end") {
            return "前端";
          } else if (val === "back_end") {
            return "后端";
          } else {
            return "运维";
          }
        },
        width: 80,
        ellipsis: true,
        filterMode: "menu",
        filters: items,
        onFilter: (value, record) => record["tag_type"] === value,
      },
      {
        title: "选项A",
        dataIndex: ["answer", "A"],
        width: 200,
        ellipsis: true,
      },
      {
        title: "选项B",
        dataIndex: ["answer", "B"],
        width: 200,
        ellipsis: true,
      },
      {
        title: "选项C",
        dataIndex: ["answer", "C"],
        width: 200,
        ellipsis: true,
      },
      {
        title: "选项D",
        dataIndex: ["answer", "D"],
        width: 200,
        ellipsis: true,
      },
      {
        title: "操作",
        dataIndex: "operator",
        fixed: "right",
        width: 100,
        render(val, record) {
          return (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                onClick={() => {
                  setQuestion(record);
                  setIsOpen(true);
                  setType("edit");
                }}
                style={{ color: "#1890ff", cursor: "pointer" }}
              >
                编辑
              </span>
              <span
                onClick={() => {
                  setQuestion(record);
                  setIsOpen(true);
                  setType("detail");
                }}
                style={{ color: "#1890ff", cursor: "pointer" }}
              >
                查看
              </span>
            </div>
          );
        },
      },
    ];
  }, []);

  const addQuestion = useCallback(async () => {
    const res = await fetch(`https://www.coder-home.top:8080/crud/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(question),
    });
    const data = await res.json();
    if (data.flag) {
      message.success("新增成功");
    } else {
      message.error("新增失败，" + data.message);
    }
    mutate();
  }, [mutate, question]);

  const editQuestion = useCallback(async () => {
    const res = await fetch(
      `https://www.coder-home.top:8080/crud/update?id=${question!.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
      }
    );
    const data = await res.json();
    if (data.flag) {
      message.success("更新成功");
    } else {
      message.error("更新失败，" + data.message);
    }
    mutate();
  }, [mutate, question]);

  const deleteQuestions = useCallback(async () => {
    const res = await fetch(`https://www.coder-home.top:8080/crud/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify(selectedIds.map((id) => ({ id }))),
    });
    const data = await res.json();
    if (data.flag) {
      message.success("删除成功");
    } else {
      message.error("删除失败" + data.message);
    }
    mutate();
  }, [mutate, selectedIds]);

  return (
    <ListContainer>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
      >
        <Button
          type="primary"
          style={{ marginRight: "8px" }}
          onClick={() => {
            const uuid = self.crypto.randomUUID();
            setIsOpen(true);
            setType("add");
            setQuestion({
              question: "",
              tag_type: "front_end",
              id: uuid,
              answer: {
                A: "",
                B: "",
                C: "",
                D: "",
              },
              correctAnswer: "A",
            });
          }}
        >
          新 增
        </Button>
        <Button
          type="primary"
          danger
          onClick={() => {
            Modal.error({
              content: "删除数据将不能恢复，是否确定删除？",
              okText: "确认",
              cancelText: "取消",
              okCancel: true,
              closable: true,
              onOk() {
                deleteQuestions();
              },
            });
          }}
        >
          删 除
        </Button>
      </div>
      <Table
        bordered
        rowKey={(record) => record.id}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange(selectedRowKeys, selectedRows, info) {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedIds(selectedRows.map((row) => row.id));
          },
        }}
        dataSource={data}
        columns={columns}
        scroll={{ x: 1250 }}
        pagination={{
          showPrevNextJumpers: true,
          showQuickJumper: true,
          showSizeChanger: true,
        }}
      />
      <Modal
        title={"问题查看"}
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
      >
        <Form
          style={{ marginTop: "8px" }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item label={"问题详情"} key={"question"}>
            {type === "detail" ? (
              question?.question
            ) : (
              <Input
                value={question?.question}
                placeholder="请输入内容"
                onChange={(e) =>
                  setQuestion({ ...question!, question: e.target.value })
                }
              />
            )}
          </Form.Item>
          <Form.Item label={"类型"} key={"type"}>
            {type === "detail" ? (
              <>
                {question?.tag_type === "front_end" && "前端"}
                {question?.tag_type === "back_end" && "后端"}
                {question?.tag_type === "ops" && "运维"}
              </>
            ) : (
              <Select
                value={question?.tag_type}
                options={items.map((item) => ({
                  value: item.value,
                  label: item.text,
                }))}
                onSelect={(value: any) => {
                  setQuestion({
                    ...question!,
                    tag_type: value,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item label={"正确答案"} key={"correctAnswer"}>
            {type === "detail" ? (
              <>{question?.correctAnswer}</>
            ) : (
              <Select
                value={question?.correctAnswer || "A"}
                labelInValue
                options={[
                  {
                    value: "A",
                  },
                  {
                    value: "B",
                  },
                  {
                    value: "C",
                  },
                  {
                    value: "D",
                  },
                ]}
                onSelect={(value: any) => {
                  setQuestion({
                    ...question!,
                    correctAnswer: value.value,
                  });
                }}
              />
            )}
          </Form.Item>
          <Form.Item label={"答案A"} key={"A"}>
            {type === "detail" ? (
              question?.answer.A
            ) : (
              <Input
                value={question?.answer.A}
                placeholder="请输入内容"
                onChange={(e) =>
                  setQuestion({
                    ...question!,
                    answer: {
                      ...question!.answer,
                      A: e.target.value,
                    },
                  })
                }
              />
            )}
          </Form.Item>
          <Form.Item label={"答案B"} key={"B"}>
            {type === "detail" ? (
              question?.answer.B
            ) : (
              <Input
                value={question?.answer.B}
                placeholder="请输入内容"
                onChange={(e) =>
                  setQuestion({
                    ...question!,
                    answer: {
                      ...question!.answer,
                      B: e.target.value,
                    },
                  })
                }
              />
            )}
          </Form.Item>
          <Form.Item label={"答案C"} key={"C"}>
            {type === "detail" ? (
              question?.answer.C
            ) : (
              <Input
                value={question?.answer.C}
                placeholder="请输入内容"
                onChange={(e) =>
                  setQuestion({
                    ...question!,
                    answer: {
                      ...question!.answer,
                      C: e.target.value,
                    },
                  })
                }
              />
            )}
          </Form.Item>
          <Form.Item label={"答案D"} key={"D"}>
            {type === "detail" ? (
              question?.answer.D
            ) : (
              <Input
                value={question?.answer.D}
                placeholder="请输入内容"
                onChange={(e) =>
                  setQuestion({
                    ...question!,
                    answer: {
                      ...question!.answer,
                      D: e.target.value,
                    },
                  })
                }
              />
            )}
          </Form.Item>
          {type !== "detail" && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                onClick={() => {
                  if (type === "add") {
                    addQuestion();
                  } else {
                    editQuestion();
                  }
                }}
              >
                {type === "add" ? "新增" : "更新"}
              </Button>
            </div>
          )}
        </Form>
      </Modal>
    </ListContainer>
  );
};

const ListPage: NextPage<any> = (props) => {
  return (
    <SWRConfig
      value={{
        fallback: {
          questionList: props.list,
        },
      }}
    >
      <Detail />
    </SWRConfig>
  );
};

ListPage.getInitialProps = async () => {
  const res = await fetch(`https://www.coder-home.top:8080/crud/all`);
  const data = await res.json();
  return {
    props: {
      list: data as Question[],
    },
  };
};

const ListContainer = styled.div`
  margin: 16px 15vw;
  border: 1px solid #dfdfdf;
  padding: 8px;
  background-color: #f9f9f9;
`;

export default ListPage;
