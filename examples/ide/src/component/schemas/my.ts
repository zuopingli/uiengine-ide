import _ from "lodash";
export default [
  {
    id: "My", // prefix
    title: "My Project Components",
    children: [
      {
        component: "my:Section",
        title: "My Section",
        isContainer: true,
        schema: {
          active: "boolean",
          title: "string"
        },
        defaultProps: {
          active: true,
          title: "Section 1"
        }
      },
      {
        component: "my:DataSelect",
        title: "My DataSelect",
        isContainer: false,
        schema: {
          datasource: "datasource",
          optionmap: [{ title: "string" }, { value: "string" }],
          open: "boolean",
          events: [
            "onChange",
            "onBlur",
            "onDeselect",
            "onFocus",
            "onInputKeyDown",
            "onMouseEnter",
            "onMouseLeave",
            "onSearch",
            "onSelect",
            "onDropdownVisibleChange"
          ]
        },
        defaultProps: {
          active: true,
          title: "DataSelect 1"
        }
      },
      {
        component: "my:FormItem",
        title: "My FormItem",
        isContainer: false,
        schema: {
          type: "string",
          label: "string",
          extra: {
            help: "string"
          },
          labelCol: {
            sm: {
              span: "number",
              offset: "number"
            }
          },
          required: "boolean",
          htmlFor: "string",
          hasFeedback: "boolean"
        },
        defaultProps: {
          // label: `My Item ${_.uniqueId()}`
        }
      }
    ]
  }
];
