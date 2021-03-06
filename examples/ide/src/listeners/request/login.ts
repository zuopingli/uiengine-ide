import _ from "lodash";

import { submitToAPI } from "uiengine";

import {
  IListenerConfig,
  IListener,
  IListenerParam,
  IUINode
} from "uiengine/typings";

const listener: IListener = async (directParam: IListenerParam) => {
  // const event: Event = _.get(directParam, 'event')
  const uiNode: IUINode = _.get(directParam, "uiNode");
  // const props = _.get(directParam, 'props')
  const headers: any = uiNode.request.getConfig().headers;

  // const uiNode = controller.getUINode(loginLayout);
  const result = submitToAPI([{ source: "credentials" }]);
  result.then((res: any) => {
    const token = _.get(res[0], "authresponse.signature");
    if (token) {
      localStorage.setItem("token", token);
      headers["Authorization"] = `A10 ${token}`;
    }

    console.log(localStorage.getItem("token"), " token fetched");
  });
};

export const login: IListenerConfig = {
  name: "login",
  paramKeys: ["event", "props", "uiNode"],
  // debugList: ["options.recirect"],
  debugList: [],
  listener,
  weight: 0,
  describe: {
    // options: [
    //   {
    //     redirect: 'string'
    //   }
    // ]
  }
};
