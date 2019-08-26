import * as _ from 'lodash'
import { getSchema } from './request'

export const getDataSourceJson = async (searchText: string) => {
  const dataSource = (await getSchema('schema/data/dataSource.json')) || {
    'uijson-list': []
  }
  const { 'uijson-list': list = [] } = dataSource
  const uiJsonList: string[] = []
  const search = searchText
  const map = list.reduce((result: any, item: any) => {
    const { path } = item
    if (!search || path.includes(search)) {
      _.set(result, path.replace(/\//g, '.'), item)
    }
    uiJsonList.push(path)
    return result
  }, {})

  const process = (obj: any, parentPath: string = '') => {
    return Object.keys(obj).map(key => {
      const nodePath = parentPath ? `${parentPath}/${key}` : key
      const item = obj[key]
      const { path, multiDataSource } = item
      const node: any = {
        name: key,
        // active: false,
        // toggled: true,
        children: !item.hasOwnProperty('multiDataSource')
          ? process(item, nodePath)
          : null,
        // status: multiDataSource ? 'warning' : 'success',
        // statusTitle: key,
        // uiJsonPath: path
        type: 'file',
        datasource: {
          source: path
        }
      }
      if (uiJsonList.includes(nodePath) && node.children) {
        node.children = [
          {
            name: key,
            // active: false,
            // toggled: true,
            children: null,
            // status: 'success',
            // statusTitle: key,
            // uiJsonPath: nodePath
            type: 'file',
            datasource: {
              source: path
            }
          },
          ...(node.children || [])
        ]
      }
      return node
    })
  }
  return process(map)
}