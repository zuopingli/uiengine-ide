import React, { useState, useCallback, useEffect, useContext } from 'react'
import { Collapse, Icon, Switch } from 'antd'
import { MyContext } from '../Context/Provider'

const { Panel } = Collapse

const SectionComponent = (props: any) => {
  const {
    children,
    title,
    active,
    style,
    value,
    onChangeWithValue,
    advanceToggle = false,
    tabSwitch = false
  } = props
  const [activeKey, setActiveKey] = useState(active ? title : '')
  const { data, dispatch } = useContext(MyContext)

  const onCollapse = useCallback(
    (key: any) => {
      setActiveKey(key)
    },
    [activeKey]
  )

  const onShowAdvance = useCallback((value: any, event: any) => {
    event.stopPropagation()
    dispatch({ name: 'set', params: { advanceOption: { [title]: value } } })
  }, [])

  const onSwitchTabs = useCallback(
    (value: any, event: any) => {
      event.stopPropagation()
      onChangeWithValue(value, event)
    },
    [onChangeWithValue, value]
  )

  const genExtra = useCallback(
    () => (
      <>
        {advanceToggle ? (
          <Switch
            defaultChecked={false}
            onChange={onShowAdvance}
            checkedChildren="Basic"
            unCheckedChildren="Advanced"
          />
        ) : null}
        {tabSwitch ? (
          <Switch
            defaultChecked={value}
            onClick={onSwitchTabs}
            checkedChildren="Tab"
            unCheckedChildren="Table"
          />
        ) : null}
      </>
    ),
    [advanceToggle]
  )

  useEffect(() => {
    setActiveKey(active ? title : '')
  }, [active])

  return (
    <div className="a10-collapse-frame">
      <Collapse
        bordered={false}
        defaultActiveKey={'----'}
        activeKey={activeKey}
        onChange={onCollapse}
        expandIcon={({ isActive }) => (
          <Icon type="caret-right" rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel
          header={<span className="section-title">{title}</span>}
          key={title}
          extra={genExtra()}
          style={style}
          className="a10-form-item"
        >
          {children &&
            children.map((child: any) => {
              return React.cloneElement(child, { group: title })
            })}
        </Panel>
      </Collapse>
    </div>
  )
}

export default SectionComponent
