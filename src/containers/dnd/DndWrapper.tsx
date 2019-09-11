import React, {
  useState,
  useRef,
  useContext,
  useCallback,
  useEffect
  // useMemo
} from "react";
import { SchemasContext, GlobalContext, IDEEditorContext } from "../Context";
import _ from "lodash";
import { Icon } from "antd";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { XYCoord } from "dnd-core";
import classNames from "classnames";

import {
  DndNodeManager,
  RegionDetector,
  DND_IDE_NODE_TYPE,
  DND_IDE_SCHEMA_TYPE
} from "../../helpers";
import ActionMenu from "./ActionMenu";
import "./styles/index.less";
import { IDE_ID, getDataSource, droppable, IDERegister } from "../../helpers";

// import { UINode } from "uiengine";
// import { IDEEditor } from "../editor";

const dndNodeManager = DndNodeManager.getInstance();
const regionDetector = RegionDetector.getInstance();

export const UIEngineDndWrapper = (props: any) => {
  const { preview, togglePropsCollapsed } = useContext(GlobalContext);
  const {
    editNode,
    chooseEditNode,
    collapsedNodes,
    setCollapsedNode
  } = useContext(IDEEditorContext);
  const { schema, updateSchema } = useContext(SchemasContext);

  const { children, uinode } = props;
  let componentInfo = IDERegister.getComponentInfo(
    _.get(uinode, "schema.component")
  );
  //
  // add a wrapper ID
  if (!uinode.schema[IDE_ID]) uinode.schema[IDE_ID] = _.uniqueId(`${IDE_ID}-`);
  // if (preview) return children;

  // is it a template
  const isDroppable = droppable(uinode);

  const ref = useRef<HTMLDivElement>(null);

  // active style
  const [border, setBorder] = useState({});
  const [dropNode, setDropNode] = useState();
  const [overClass, setOverClass] = useState();

  // id isCollapsed
  const isCollapsed =
    collapsedNodes.indexOf(_.get(uinode, `schema.${IDE_ID}`, "**any-id")) > -1;

  // define drop
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: [DND_IDE_NODE_TYPE, DND_IDE_SCHEMA_TYPE],
    hover: async (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return;
      }
      const draggingNode = item.uinode;
      const hoverNode = uinode;

      // Don't replace items with themselves
      if (draggingNode === hoverNode || !isOverCurrent) {
        return;
      }

      let regionStyles;
      switch (item.type) {
        case DND_IDE_NODE_TYPE:
          if (!dndNodeManager.canDrop(draggingNode, hoverNode)) return;
          // Determine rectangle on screen
          const hoverBoundingRect = ref.current!.getBoundingClientRect();

          // Determine mouse position
          const clientOffset = monitor.getClientOffset();

          // detect update region style
          const regionName = regionDetector.detectCurrentRegion(
            clientOffset as XYCoord,
            hoverBoundingRect
          );

          // if center, and collapsed, don't go on insert
          if (regionName === "center" && isCollapsed) return;

          // judge center
          // it's not a container
          if (
            regionName === "center" &&
            !dndNodeManager.canDropInCenter(hoverNode)
          ) {
            return false;
          }

          if (regionName) {
            if (regionName === "center") {
              regionStyles = {
                border: "3px solid #f00"
              };
            } else {
              const mapBorder = {
                up: "top",
                down: "bottom",
                left: "left",
                right: "right"
              };
              const borderName = `border${_.upperFirst(mapBorder[regionName])}`;
              regionStyles = {
                [borderName]: "3px solid #f00"
              };
            }
            setOverClass("node");
            setBorder(regionStyles);
          }
          break;
        case DND_IDE_SCHEMA_TYPE:
          regionStyles = {
            border: "3px solid #80c35f",
            backgroundColor: "#def9d1"
          };
          setOverClass("schema");
          setBorder(regionStyles);
          break;
      }
    },
    drop: async (item: DragItem, monitor: DropTargetMonitor) => {
      if (!ref.current) {
        return;
      }
      const draggingNode = item.uinode;
      const hoverNode = uinode;
      // Don't replace items with themselves
      if (draggingNode === hoverNode || !isOverCurrent) {
        return;
      }

      switch (item.type) {
        case DND_IDE_NODE_TYPE:
          // Determine rectangle on screen
          const hoverBoundingRect = ref.current!.getBoundingClientRect();

          // Determine mouse position
          const clientOffset = monitor.getClientOffset();

          // detect update region style
          const regionName = regionDetector.detectCurrentRegion(
            clientOffset as XYCoord,
            hoverBoundingRect
          );

          // if center, and collapsed, don't go on insert
          if (regionName === "center" && isCollapsed) return;

          const insertMethodName = `insert${_.upperFirst(regionName)}`;
          if (dndNodeManager[insertMethodName]) {
            dndNodeManager[insertMethodName](draggingNode, hoverNode);
          }
          break;
        case DND_IDE_SCHEMA_TYPE:
          if (_.isObject(item.schema)) {
            dndNodeManager.useSchema(hoverNode, item.schema);
          }
          break;
      }
      setDropNode(draggingNode);
      updateSchema(hoverNode.schema);
    },

    collect: monitor => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true })
    })
  });

  // change over background
  // let backgroundColor = "rgba(255, 255, 255)";
  let borderStyle = {};

  if (isOverCurrent) {
    borderStyle = border;
  }

  // define drag source
  const [, drag] = useDrag({ item: { type: DND_IDE_NODE_TYPE, uinode } });
  drag(drop(ref));

  // callbacks to add hoverstyle
  const [hoverClassNames, setHoverClassNames] = useState("");
  const mouseOver = useCallback((e: any) => {
    e.stopPropagation();
    setHoverClassNames("over");
  }, []);

  const mouseOut = useCallback((e: any) => {
    e.stopPropagation();
    setHoverClassNames("out");
  }, []);

  // let singleClicked: any;
  const wrapperClick = useCallback((e: any) => {
    e.stopPropagation();
    chooseEditNode(uinode);
  }, []);

  const dataSource = getDataSource(uinode.schema.datasource);

  // double click
  useEffect(() => {
    if (ref.current) {
      ref.current.ondblclick = (e: any) => {
        e.stopPropagation();
        setCollapsedNode(uinode);
      };
    }
  }, [uinode, ref]);

  const cls = classNames({
    wrapper: true,
    "with-datasource": _.get(uinode, "schema.datasource[0]") !== "$",
    "schema-wrapper-over": isOverCurrent && overClass === "schema",
    "node-wrapper-over": isOverCurrent && overClass === "node",
    "wrapper-hover": hoverClassNames === "over",
    // "wrapper-out": hoverClassNames === "out",
    "wrapper-edit":
      editNode &&
      uinode &&
      editNode.schema[IDE_ID] !== undefined &&
      editNode.schema[IDE_ID] === uinode.schema[IDE_ID],
    // "wrapper-edit-animation": editing,
    "wrapper-dropped": dropNode === uinode,
    "wrapper-collapsed": isCollapsed,
    "wrapper-drop-disabled": !isDroppable,
    "wrapper-container": _.get(componentInfo, "isContainer", false)
  });

  const onClickMenuBar = (e: any) => {
    e.stopPropagation();
    togglePropsCollapsed(false);
    chooseEditNode(uinode);
  };

  // get uinode layout to keep same layout with preview
  const display = _.get(uinode, "schema.layout.display");
  const flex = _.get(uinode, "schema.layout.flex");
  return (
    <div
      ref={isDroppable ? ref : null}
      onClick={wrapperClick}
      onMouseOver={mouseOver}
      onMouseOut={mouseOut}
      style={{ ...borderStyle, display, flex }}
      className={cls}
    >
      <ActionMenu uinode={uinode}>
        <div
          className="component-action"
          title={dataSource}
          onClick={onClickMenuBar}
        >
          {uinode.schema.component}
          {dataSource ? `(${dataSource})` : ""}
          <Icon type="more" />
        </div>
      </ActionMenu>
      {children}
    </div>
  );
};
