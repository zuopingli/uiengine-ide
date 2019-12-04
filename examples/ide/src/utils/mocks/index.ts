import * as types from "./types";

export const mocks = {
  "string-rlx": types.stringGen,
  "ipv6-address": types.ipv6Gen,
  "ipv6-address-plen": types.ipv6PlenGen,
  "ipv4-address": types.ipv4Gen,
  string: types.stringGen,
  flag: types.booleanGen,
  number: types.numberGen,
  "long-string-rlx": types.stringGen,
  "line": types.stringGen,
  "password": types.stringGen,
  "encrypted": types.stringGen,
  "name": types.stringGen,
  "fields": types.stringGen,
  "dummy": types.stringGen,
  "dummy-object": types.stringGen,
  "long-string": types.stringGen,
  "host": types.stringGen,
  "hostname": types.stringGen,
  "comp-string":  types.stringGen,
  "mac-address": types.macAddrGen,
  "url": types.urlGen,
  "interface": types.numberGen,
  "domain": types.domainGen,
  "email-address": types.emailGen,
  "ipv4-netmask": types.ipv4PlenGen,
  "ipv4-netmask-brief": types.ipv4PlenGen,
  "ipv4-rev-netmask": types.ipv4PlenGen,
  "ipv4-cidr": types.ipv4PlenGen,
  "enum": types.enumGen,
};
