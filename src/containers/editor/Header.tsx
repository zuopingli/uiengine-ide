import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useContext
} from "react";

import { Switch, Icon } from "antd";
import { UINode } from "uiengine";
import { GlobalContext, SchemasContext } from "../Context";
import { getActiveUINode } from "../../helpers";

export const Header = (props: any) => {
  // header collpase state
  const [headerCollapsed, setHeaderCollapse] = useState(
    localStorage.ideHeaderCollapse === "true"
  );
  const toggleHeaderCollapse = useCallback((status: boolean) => {
    setHeaderCollapse(status);
    localStorage.ideHeaderCollapse = status;
  }, []);

  // component collapse state
  const [componentsCollapsed, setComponentCollapse] = useState(
    localStorage.ideComponentCollapse === "true"
  );

  const toggleComponentCollapse = useCallback((status: boolean) => {
    setComponentCollapse(status);
    localStorage.ideComponentCollapse = status;
  }, []);

  // props collapse state
  const [propsCollapsed, setPropsCollapse] = useState(
    localStorage.idePropsCollapse === "true"
  );
  const togglePropsCollapse = useCallback((status: boolean) => {
    setPropsCollapse(status);
    localStorage.idePropsCollapse = status;
  }, []);

  // preview collaspse state
  const [preview, setPreview] = useState(false);
  const switchPreview = async (status: boolean) => {
    const rootNode = getActiveUINode() as UINode;
    await rootNode.updateLayout();
    rootNode.sendMessage(true);
    setPreview(status);
  };

  const contextValue = useMemo<IGlobalContext>(
    () => ({
      preview: false,
      togglePreview: (preview: boolean) => {
        switchPreview(preview);
      },
      saved: false,
      theme: "",
      toggleTheme: (theme: string) => {},
      propsCollapsed: false,
      togglePropsCollapsed: (collapsed: boolean) => {
        togglePropsCollapse(collapsed);
      },
      headerCollapsed: false,
      toggleHeaderCollapsed: (collapsed: boolean) => {
        toggleHeaderCollapse(collapsed);
      },
      componentCollapsed: false,
      toggleComponentCollapsed: (collapsed: boolean) => {
        toggleComponentCollapse(collapsed);
      }
    }),
    [headerCollapsed]
  );

  const hideAll = useCallback(() => {
    toggleComponentCollapse(true);
    togglePropsCollapse(true);
    toggleHeaderCollapse(true);
  }, []);

  const showAll = useCallback(() => {
    toggleComponentCollapse(false);
    togglePropsCollapse(false);
    toggleHeaderCollapse(false);
  }, []);

  return (
    <GlobalContext.Provider value={contextValue}>
      {headerCollapsed ? (
        <a className="ide-show" onClick={showAll}>
          <Icon type="caret-right" />
        </a>
      ) : null}
      <div className={headerCollapsed ? "ide-header hide" : "ide-header"}>
        <div className="left">
          <div className="button-close">
            <Icon type="close" onClick={hideAll} />
          </div>
          <SchemasContext.Consumer>
            {({ current, savedTime }) => (
              <>
                <a
                  className="button-menu"
                  onClick={() => toggleComponentCollapse(!componentsCollapsed)}
                >
                  <Icon type="menu" /> Editing {current}
                </a>
                {savedTime ? (
                  <div className="page-name">
                    <em>(Last Saved: {savedTime})</em>
                  </div>
                ) : null}
              </>
            )}
          </SchemasContext.Consumer>
        </div>
        <div className="right">
          <div className="props">
            <Switch
              checked={preview}
              checkedChildren="Preview"
              unCheckedChildren="Edit"
              onChange={() => switchPreview(!preview)}
            />
            <a
              className="settings"
              onClick={() => togglePropsCollapse(!propsCollapsed)}
            >
              <Icon type="setting" />
            </a>
            <a className="save">
              <Icon type="save" />
            </a>
          </div>

          <div className="brand">GUI IDE</div>
        </div>
      </div>
    </GlobalContext.Provider>
  );
};
