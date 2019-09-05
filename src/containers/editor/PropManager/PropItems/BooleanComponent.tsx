import React, { useState, useCallback } from "react";
import _ from "lodash";
import { Switch } from "antd";
import { Form } from "antd";
import { formatTitle } from "../../../../helpers";

export const BooleanComponent = (props: any) => {
  const { value, onChange, disabled } = props;
  return (
    <Form.Item label={formatTitle(props.name)}>
      <Switch checked={value} onChange={onChange} disabled={disabled} />
    </Form.Item>
  );
};
