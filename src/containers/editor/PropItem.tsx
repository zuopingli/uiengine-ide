import React, { useState } from "react";
import _ from "lodash";
import { Input, Form, Slider, Switch, Select, TreeSelect } from "antd";
import { formatTitle } from "../../helpers";

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
/**
 * Format arbitary schema to stardard one
 *
 * @param fieldSchema
 * @return
 */
const schemaTidy = (fieldSchema: any): IComponentSchema => {
  let standardSchema: any = { type: "string" };
  if (_.isArray(fieldSchema)) {
    if (_.isNumber(fieldSchema[0])) {
      standardSchema["range"] = fieldSchema;
      standardSchema["type"] = "range";
    } else {
      standardSchema["options"] = fieldSchema;
      standardSchema["type"] = "enum";
    }
  } else if (_.isString(fieldSchema)) {
    standardSchema["type"] = fieldSchema;
  } else if (_.isObject(fieldSchema)) {
    standardSchema = fieldSchema;
    if (!_.has(fieldSchema, "type")) {
      if (_.has(fieldSchema, "options")) {
        standardSchema["type"] = "enum";
      } else if (_.has(fieldSchema, "range")) {
        standardSchema["type"] = "range";
      }
    }
  }
  return standardSchema;
};

const FieldComponent = (props: any) => {
  const { fieldSchema } = props;
  const standardSchema = schemaTidy(fieldSchema);
  let { type = "string", ...schema } = standardSchema;

  const elementTypes = {
    range: (props: any) => {
      const { range, ...rest } = props;
      return <Slider range defaultValue={range} {...rest} />;
    },
    string: (props: any) => {
      return <Input {...props} />;
    },
    boolean: (props: any) => {
      const { value, ...rest } = props;
      return <Switch checked={value} {...rest} />;
    },
    enum: (props: any) => {
      const { options, ...rest } = props;
      return (
        <Select {...rest}>
          {options.map((option: any, index: number) => (
            <Option value={option} key={index}>
              {option}
            </Option>
          ))}
        </Select>
      );
    },
    datasource: (props: any) => {
      // const { value, ...rest } = props;
      return (
        <TreeSelect
          showSearch
          style={{ width: 300 }}
          dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
          placeholder="Please select"
          allowClear
          treeDefaultExpandAll
          {...props}
        >
          <TreeNode value="parent 1" title="parent 1" key="0-1">
            <TreeNode value="parent 1-0" title="parent 1-0" key="0-1-1">
              <TreeNode value="leaf1" title="my leaf" key="random" />
              <TreeNode value="leaf2" title="your leaf" key="random1" />
            </TreeNode>
            <TreeNode value="parent 1-1" title="parent 1-1" key="random2">
              <TreeNode
                value="sss"
                title={<b style={{ color: "#08c" }}>sss</b>}
                key="random3"
              />
            </TreeNode>
          </TreeNode>
        </TreeSelect>
      );
    }
  };
  let componentType = props.type;
  if (!componentType) {
    componentType = type || "string";
  }
  const Com = elementTypes[componentType];
  // schema.onChange = onChange;
  // schema.value = value;

  const [value, setValue] = useState(schema.default);
  const onChange = (v: any) => {
    console.log(v);
    setValue(v);
  };

  if (Com) {
    return <Com onChange={onChange} value={value} {...schema} />;
  } else {
    return null;
  }
};

export const PropItem: React.FC<any> = (props: any) => {
  const { name, schema, type } = props;
  // type : event| prop
  return (
    <Form.Item label={formatTitle(name)}>
      <FieldComponent fieldSchema={schema} />
    </Form.Item>
  );
};
