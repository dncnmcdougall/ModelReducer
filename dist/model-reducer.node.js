!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ModelReducer=t():e.ModelReducer=t()}(global,(function(){return e={138:(e,t,n)=>{e.exports.ModelCreator=n(521),e.exports.StateValidator=n(912)},521:(e,t,n)=>{var o=n(924),r=n(350),i=n(167),s=n(310),a=n(756).$1,c=function(e){if(e)throw new Error("The model was already finalised, cannot modify it further.")};e.exports=function(e){var t=new i,n=!1,l={};l.name=e,l.collectionName=e+"s",l.collectionKey="Key",l.properties={},l.actions={},l.requests={},l.children={},l.collections={},l.customActions=[],l.customRequests=[],l.reduce=function(e,t,...n){return o.reduce(l,(e=>e.actions),(e=>e.children),!0,e,t,...n)},l.request=function(e,t,...n){return o.reduce(l,(e=>e.requests),(e=>e.children),!1,e,t,...n)},l.listActions=function(){return o.listActions(l,(e=>e.actions),(e=>e.children),!1)},l.listCustomActions=function(){return o.listActions(l,(e=>e.customActions),(e=>e.children),!1)},l.listRequests=function(){return o.listActions(l,(e=>e.requests),(e=>e.children),!1)},l.listCustomRequests=function(){return o.listActions(l,(e=>e.customRequests),(e=>e.children),!1)},l.hasChild=function(e){return this.children.hasOwnProperty(e)},this.hasChild=function(e){return l.hasChild(e)},l.hasCollection=function(e){return this.children.hasOwnProperty(e)&&this.collections[e]},this.hasCollection=function(e){return l.hasCollection(e)},r.addCreateEmpty(l),this.copyFrom=function(e){c(n),l.properties=Object.assign({},l.properties,e.properties),l.actions=Object.assign({},l.actions,e.actions),l.requests=Object.assign({},l.requests,e.requests),l.children=Object.assign({},l.children,e.children),l.collections=Object.assign({},l.collections,e.collections)},this.setCollectionName=function(e){a(e,"string"),c(n),l.collectionName=e},this.setCollectionKey=function(e){a(e,"string"),c(n),l.collectionKey=e},this.addVersion=function(){var e=t.lastVersionNumber(),n=t.addVersion(e+1);return new s(n,this)},this.getPropertyType=function(e){return l.properties[e]},this.addProperty=function(e,t){a(e,"string"),t?a(t,"string"):t=null,c(n),l.properties[e]=t},this.removeProperty=function(e){if(a(e,"string"),c(n),!l.properties.hasOwnProperty(e))throw'The property "'+e+'" could not be removed because it is not contained.';delete l.properties[e]},this.addChild=function(e){if(a(e,"object"),c(n),l.children.hasOwnProperty(e.name))throw'The child named "'+e.name+'" already exists in this model. Do you have two models with the same name?';l.children[e.name]=e,l.collections[e.name]=!1},this.addChildAsCollection=function(e){if(a(e,"object"),c(n),l.children.hasOwnProperty(e.name))throw'The child named "'+e.name+'" already exists in this model. Do you have two models with the same name?';if(l.children.hasOwnProperty(e.collectionName))throw'The child named "'+e.collectionName+'" already exists in this model. Do you have two models with the same name?';l.children[e.collectionName]=e,l.collections[e.collectionName]=!0},this.removeChild=function(e){if(a(e,"object"),c(n),l.children.hasOwnProperty(e.name))delete l.children[e.name],delete l.collections[e.name];else{if(!l.children.hasOwnProperty(e.collectionName))throw'The child named "'+e.name+'" could not be removed because it is not contained.';delete l.children[e.collectionName],delete l.collections[e.collectionName]}},this.addAction=function(e,t,o){a(e,"string"),a(t,"function"),c(n),l.actions[e]=t.bind(l),o||e in l.customActions||l.customActions.push(e)},this.removeAction=function(e){if(a(e,"string"),c(n),!l.actions.hasOwnProperty(e))throw'The action "'+e+'"+ could not be removed because it is not contained.';delete l.actions[e];var t=l.customActions.indexOf(e);t>=0&&l.customActions.splice(t,1)},this.addRequest=function(e,t,o){a(e,"string"),a(t,"function"),c(n),l.requests[e]=t.bind(l),o||e in l.customRequests||l.customRequests.push(e)},this.removeRequest=function(e){if(a(e,"string"),c(n),!l.requests.hasOwnProperty(e))throw'The request "'+e+'" could not be removed because it is not contained.';delete l.requests[e];var t=l.customRequests.indexOf(e);t>=0&&l.customRequests.splice(t,1)},this.addStateRequest=function(){r.addStateRequest(this)},this.addSetPropertyActionFor=function(e,t){r.addSetPropertyActionFor(this,e,t)},this.addAddActionFor=function(e,t){r.addAddActionFor(this,e,t)},this.addAvailableKeyRequestFor=function(e,t){r.addAvailableKeyRequestFor(this,e,t)},this.finaliseModel=function(){if(c(n),l.properties.hasOwnProperty(l.collectionKey))throw'The property "'+l.collectionKey+'" shadows the collection key.';return l.versioning=t.finalise(),n=!0,l}}},310:(e,t,n)=>{var o=n(756).LS;e.exports=function(e,t){this.addProperty=function(n,r){t.addProperty(n,r),r||(r=null),e.add(n,o(r))},this.removeProperty=function(n){t.removeProperty(n),e.remove(n)},this.renameProperty=function(n,o){t.addProperty(o,t.getPropertyType(n)),t.removeProperty(n),e.rename(n,o)},this.addChild=function(n){t.addChild(n),e.add(n.name,n.createEmpty())},this.addChildAsCollection=function(n){t.addChildAsCollection(n),e.add(n.collectionName,{})},this.removeChild=function(n){t.hasCollection(n.collectionName)?e.remove(n.collectionName):e.remove(n.name),t.removeChild(n)}}},350:(e,t,n)=>{var o=n(756).$1,r=n(756).LS;e.exports=new function(){this.addCreateEmpty=function(e){e.createEmpty=function(){let t={};for(let e in this.properties){let n=r(this.properties[e],e);t[e]=n}for(let n in this.children){let o=this.children[n];e.hasCollection(o.collectionName)?t[o.collectionName]={}:t[o.name]=o.createEmpty()}return t}},this.addStateRequest=function(e){e.addRequest("State",(function(e){return e}),!0)},this.addSetPropertyActionFor=function(e,t,n){o(e,"object"),o(t,"string"),n?o(n,"string"):n="Set"+t,e.addAction(n,(function(e,n){if(!1===this.properties.hasOwnProperty(t))throw new Error('The property "'+t+'" was not defined on the model');if(this.properties[t]&&o(n,this.properties[t]),e[t]===n)return e;var r={};return r[t]=n,Object.assign({},e,r)}),!0)},this.addAddActionFor=function(e,t,n){if(o(e,"object"),o(t,"object"),!e.hasCollection(t.collectionName))throw new Error("Add actions can only be created for children which form a collection");n?o(n,"string"):n="Add"+t.name,e.addAction(n,(function(e,n){var o=t.createEmpty();o[t.collectionKey]=n;var r=t.collectionName,i={};return i[r]={},Object.assign(i[r],e[r]),i[r][n]=o,Object.assign({},e,i)}),!0)},this.addAvailableKeyRequestFor=function(e,t,n){if(o(e,"object"),o(t,"object"),!e.hasCollection(t.collectionName))throw new Error("AvailableKey requests can only be created for children which form a collection");if(n)o(n,"string");else{var r=t.collectionKey;r=r[0].toUpperCase()+r.slice(1),n="Available"+t.name+r}e.addRequest(n,(function(e){var n=[];e&&e[t.collectionName]&&(n=Object.keys(e[t.collectionName]).map((e=>parseInt(e,10)))),n.sort(((e,t)=>e-t));var o=n.length-1;if(o<0)return 0;var r=parseInt(n.length/2,10);r<1&&(r=1);for(var i=0;r>0;){if(n[o]===o){if(o===n.length-1)return n.length;if(n[o+1]>o+1)return o+1;if(n[o+1]!==o+1)throw"This should not happen: ===, <";o+=r,i<0&&(r=parseInt(r/2,10)),i=1}else{if(!(n[o]>o))throw"This should not happen: <";if(0===o)return 0;if(n[o-1]===o-1)return o;if(!(n[o-1]>o-1))throw"This should not happen: >, <";o-=r,i>0&&(r=parseInt(r/2,10)),i=-1}if(r<1&&(r=1),o<0)o=0;else if(o>=n.length)throw"This should not happen: Out of bounds"}throw"This should not happen: delta === 0"}),!0)}}},924:(e,t,n)=>{var o=n(756).hu;e.exports=new function(){this.reduce=function(e,t,n,r,i,s,...a){let c=null;const l=i.split(".");if(o(s,"Expected state not to be undefined"),c=l[0]==e.collectionName?e.collectionName:e.name,o(l[0]==c,"Expected the first part of the command to be "+c+' but found "'+l[0]+'"'),2==l.length){const n=t(e);return o(n.hasOwnProperty(l[1]),"Did not find the action "+l[1]+" in "+c),n[l[1]](s,...a)}{const i=e.hasCollection(l[1]),d=n(e);o(d.hasOwnProperty(l[1]),"Did not find the child "+l[1]+" in "+c);const u=d[l[1]],h=this.reduceState(i,s,u,...a),f=l.slice(1).join("."),p=this.reduce(u,t,n,r,f,h.State,...h.Args);return r?this.expandState(i,s,p,u):p}},this.reduceState=function(e,t,n,...r){if(e){const e=r[0],i="The id given for the "+n.collectionName+" was ";o(null!=e,i+"null"),o(null!=e,i+"undefined");const s=t[n.collectionName][e];return o(null!=s,"The object referred to by the id was null"),o(null!=s,"The object referred to by the id was undefined"),{State:s,Args:r.slice(1)}}return{State:t[n.name],Args:r}},this.expandState=function(e,t,n,o){let r={};if(!1===e){if(t[o.name]===n)return t;r[o.name]=n}else{const e=o.collectionKey;if(t[o.collectionName][n[e]]===n)return t;r[o.collectionName]={},Object.assign(r[o.collectionName],t[o.collectionName]),r[o.collectionName][n[e]]=n}return Object.assign({},t,r)},this.listActions=function(e,t,n,o){let r=[],i=t(e);if(Array.isArray(i))r=i.map((e=>e));else for(const e in i)r.push(e);const s=n(e);for(const o in s){const i=s[o];r.push(...this.listActions(i,t,n,e.hasCollection(o)))}let a=o?e.collectionName:e.name;return r.map((e=>a+"."+e))}}},912:(e,t,n)=>{var o=n(756).$1,r=n(756).kI;e.exports=new function(){this.validateStateCollection=(e,t,n,o)=>{var i=null;return n&&!o&&(t=Object.assign({},t),o=!0),Object.keys(t).forEach((r=>{if(!i){var s=t[r][e.collectionKey];if(s!=r)i="Expected "+e.collectionName+"["+r+'] to have "'+e.collectionKey+'" of '+r+" but found "+s+".";else{let s=this.validateState(e,t[r],n,o);s.error?i=s.error:n&&(t[r]=s.value)}}})),r(i,t)},this.validateState=(e,t,n,i)=>{var s=e.children,a=e.properties,c={},l={},d={},u={found:!1,name:e.collectionKey,type:null};if(Object.keys(s).forEach((t=>{e.hasCollection(t)?l[t]={found:!1,name:t}:c[t]={found:!1,name:t}})),Object.keys(a).forEach((e=>{d[e]={found:!1,type:a[e]}})),n){var h=e.versioning.update(t);if(h.error)return h;t=h.value}var f=null,p=e.name;if(t.hasOwnProperty(e.collectionKey)){let n=t[e.collectionKey];p=e.collectionName+"["+n+"]"}return Object.keys(t).forEach((e=>{var r;if(!f&&"version"!=e)if(d.hasOwnProperty(e)){var i=d[e].type;if(null!=i)try{o(t[e],i),d[e].found=!0}catch(n){f="Expected property "+p+"."+e+' to have type "'+i+'", but found type "'+typeof t[e]+'".'}else d[e].found=!0}else if(c.hasOwnProperty(e)){r=c[e].name;var a=this.validateState(s[r],t[e],n);a.error?f=a.error:(c[e].found=!0,n&&(t[e]=a.value))}else if(l.hasOwnProperty(e)){r=l[e].name;var h=this.validateStateCollection(s[r],t[e],n);h.error?f=h.error:(n&&(t[e]=h.value),l[e].found=!0)}else u.name==e?u.found=!0:f="Did not expect to find a property named "+p+"."+e+", but did."})),Object.keys(l).forEach((e=>{f||l[e].found||(f="Expected to find a collection named "+p+"."+e+", but did not.")})),Object.keys(c).forEach((e=>{f||c[e].found||(f="Expected to find a child named "+p+"."+e+", but did not.")})),Object.keys(d).forEach((e=>{f||d[e].found||(f="Expected to find a property named "+p+"."+e+", but did not.")})),r(f,t)}}},756:e=>{e.exports.$1=function(e,t){if("array"===t){if(!0!==Array.isArray(e))throw new Error('Expected parameter to be of type "array" but received "'+typeof e+'".')}else{if("object"===t&&!0===Array.isArray(e))throw new Error('Expected parameter to be of type "object" but received "array".');if(typeof e!==t)throw new Error('Expected parameter to be of type "'+t+'" but received "'+typeof e+'".')}},e.exports.kI=function(e,t){return e?{error:e,value:null}:{error:null,value:t}},e.exports.LS=function(e,t){switch(e){case"string":return"";case"boolean":return!1;case"object":return{};case"number":return 0;case"array":return[];case null:return null;default:throw t?new Error("Type ("+e+") of property "+t+" not recognised"):new Error("Type "+e+" not recognised")}},e.exports.hu=function(e,t){if(!e)throw new Error(t)}},167:(e,t,n)=>{var o=n(756).kI,r=function(e){if(e)throw new Error("The versioning was already finalised, cannot modify it further.")};function i(e){this.add=function(t,n){e.additions.push({name:t,value:n})},this.rename=function(t,n){e.renames.push({name:t,newName:n})},this.remove=function(t,n){e.removals.push({name:t})}}e.exports=function(){var e=!1,t={versions:{}};this.lastVersionNumber=function(){return Object.keys(t.versions).reduce(((e,t)=>Math.max(e,Number.parseInt(t,10))),0)},this.addVersion=function(n){r(e);var o=Number.parseInt(n,10);if(n!=o)throw new Error("Expected the version number to be an integer");return n=o,t.versions.hasOwnProperty(n)||(t.versions[n]={additions:[],renames:[],removals:[]}),new i(t.versions[n])},t.update=function(e){let n=Object.assign({},e);n.hasOwnProperty("version")||(n.version=0);let r=null;return Object.keys(t.versions).sort().forEach((e=>{if(null!=r||!t.versions.hasOwnProperty(e))return;if(e<=n.version)return;n.version=Number.parseInt(e,10);let o=t.versions[e];o.removals.forEach((t=>{null==r&&(n.hasOwnProperty(t.name)?delete n[t.name]:r='Expected to find property "'+t.name+'" to remove in version '+e+", but did not.")})),null==r&&(o.renames.forEach((t=>{null==r&&(n.hasOwnProperty(t.name)?n.hasOwnProperty(t.newName)?r='Could not rename "'+t.name+'" to "'+t.newName+'" because it already exists, in version 1.':(n[t.newName]=n[t.name],delete n[t.name]):r='Expected to find property "'+t.name+'" to rename to "'+t.newName+'" in version '+e+", but did not.")})),null==r&&o.additions.forEach((e=>{null==r&&(n.hasOwnProperty(e.name)?r='Could not add "'+e.name+'" because it already exists, in version 1.':n[e.name]=e.value)})))})),o(r,n)},this.finalise=function(){return r(e),e=!0,t}}}},t={},function n(o){var r=t[o];if(void 0!==r)return r.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,n),i.exports}(138);var e,t}));