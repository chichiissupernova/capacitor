import{p as n,j as e,B as c,K as i,aq as x}from"./index-Caw7KGCA.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=n("UserMinus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=n("UserPlus",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"19",x2:"19",y1:"8",y2:"14",key:"1bvyxn"}],["line",{x1:"22",x2:"16",y1:"11",y2:"11",key:"1shjgl"}]]);function u({isFollowing:r,isPending:s=!1,isProcessing:a,onFollow:t,onMessage:l}){return e.jsxs("div",{className:"flex space-x-2",children:[e.jsx(c,{onClick:t,disabled:a||s,variant:r?"outline":"default",className:`flex-1 ${r?"text-red-600 border-red-200 hover:bg-red-50":s?"text-orange-600 border-orange-200 bg-orange-50":"bg-chichi-purple hover:bg-chichi-purple-dark text-white"}`,children:a?e.jsx("div",{className:"animate-spin rounded-full h-4 w-4 border-b-2 border-current"}):s?e.jsxs(e.Fragment,{children:[e.jsx(i,{className:"h-4 w-4 mr-1"}),"Connection Pending"]}):r?e.jsxs(e.Fragment,{children:[e.jsx(h,{className:"h-4 w-4 mr-1"}),"Disconnect"]}):e.jsxs(e.Fragment,{children:[e.jsx(o,{className:"h-4 w-4 mr-1"}),"Connect"]})}),e.jsxs(c,{onClick:l,variant:"outline",className:"flex-1 border-chichi-purple text-chichi-purple hover:bg-chichi-purple hover:text-white",children:[e.jsx(x,{className:"h-4 w-4 mr-1"}),"Message"]})]})}export{u as U,o as a,h as b};
