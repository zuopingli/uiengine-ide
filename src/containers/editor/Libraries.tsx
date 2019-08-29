import React, { useState } from "react";
import { Input, Collapse, Row, Col, Button } from "antd";
import _ from "lodash";
const Search = Input.Search;
const Panel = Collapse.Panel;

import { Widgets } from "./";

export const Libraries: React.FC<IComponents> = props => {
  const { list } = props;

  function callback() {}

  const originComs = list;
  let components = _.cloneDeep(originComs);
  const [coms, setComs] = useState(components);
  const [date, setDate] = useState(new Date().getTime());

  const search = (value: any) => {
    if (_.trim(value) === "") {
      setComs(originComs);
      setDate(new Date().getTime());
    } else {
      _.forEach(components, (item: any, index: number) => {
        if (item.children) {
          _.remove(item.children, (o: any, i: number) => {
            return o.title.toLowerCase().indexOf(value.toLowerCase()) === -1;
          });
        }
        if (item.children.length === 0) {
          delete components[index];
        }
      });
      setComs(components);
      setDate(new Date().getTime());
    }
  };

  return (
    <div className="ide-libraries">
      <div className="search-bar">
        <Row>
          <Col span={20}>
            <Input.Search onSearch={search} />
          </Col>
          <Col>
            <Button type="primary" icon="plus" shape="circle" />
          </Col>
        </Row>
      </div>
      <div className="library-panel">
        <Collapse onChange={callback} accordion defaultActiveKey={"1"}>
          {coms.map((item: any, key: any) => {
            return (
              <Panel header={item.title} key={key}>
                <Widgets widgets={item.children} />
              </Panel>
            );
          })}
        </Collapse>
      </div>
    </div>
  );
};
