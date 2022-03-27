(()=>{var t={370:(t,e,r)=>{t.exports=r(436)},436:t=>{t.exports=class{constructor(t,e){this.channelName=t,this.onMessage=e,this._installListener(),this._requests=new Map,this._nextId=0,this._defaultTimeout=4e3}_installListener(){const t=this;this._listener=function(e){if(!e.data||"string"!=typeof e.data)return;let r;try{if(r=JSON.parse(e.data),!r.channel||r.channel!==t.channelName)return;if("object"!=typeof r.message)return}catch(t){return}if(void 0!==r.replyId){if("number"!=typeof r.replyId||r.replyId%1!=0)return;const e=t._requests.get(r.replyId);e&&(clearTimeout(e.timeout),t._requests.delete(r.replyId),e.resolve(r.message))}else{if("number"!=typeof r.id||r.id%1!=0||!t.onMessage)return;const o=t.channelName,s=r.id,n=e.origin,i=function(t){const r={channel:o,replyId:s,message:t};e.source.postMessage(JSON.stringify(r),n)};t.onMessage(r.message,e.origin,e.source,i,t)}},window.addEventListener("message",this._listener)}sendMessage(t,e,r,o){const s={channel:this.channelName,id:this.getNextId(),message:e};if(o&&o.waitForReply){const e=this;return new Promise((function(n,i){const a=setTimeout((function(){e._requests.get(s.id)&&(e._requests.delete(s.id),i(new Error("Timeout expired for the message response")))}),o&&o.timeout?o.timeout:e._defaultTimeout);e._requests.set(s.id,{timeout:a,resolve:n}),t.postMessage(JSON.stringify(s),r)}))}t.postMessage(JSON.stringify(s),r)}close(){window.removeEventListener("message",this._listener),this._listener=null,delete this._requests}getNextId(){return this._nextId+=1,this._nextId}}},385:(t,e,r)=>{t.exports=r(312)},312:(t,e,r)=>{const{openPopup:o}=r(847),{sleep:s,prepareTxn:n}=r(104),i=r(783),a=new(r(831));t.exports=class{constructor(t){this.bridge=a,this.timeout=t&&t.timeout?t.timeout:16e5,this.url=t&&t.bridgeUrl?t.bridgeUrl:"https://wallet.myalgo.com/bridge",this.url.endsWith("/")&&(this.url=this.url.slice(0,-1)),this.currentConnectPopup=null,this.currentSigntxPopup=null,this.currentSignLogicSigPopup=null,this.options={waitForReply:!0,timeout:this.timeout},this.disableLedgerNano=!(!t||!t.disableLedgerNano)&&t.disableLedgerNano}async connect(t={shouldSelectOneAccount:!1,openManager:!1}){this.currentConnectPopup&&(this.currentConnectPopup.closed?this.currentConnectPopup=null:this.focusWindow(this.currentConnectPopup));try{this.currentConnectPopup=o(this.url+"/connect.html"),await this.waitForWindowToLoad(this.currentConnectPopup);const e=await this.bridge.sendMessage(this.currentConnectPopup,{method:"unlock",params:Object.assign(t,{disableLedgerNano:this.disableLedgerNano})},this.url,this.options);if(this.closeWindow(this.currentConnectPopup),this.currentConnectPopup=null,"error"===e.status)throw new Error(e.message);return e.data.accounts}catch(t){throw this.closeWindow(this.currentConnectPopup),this.currentConnectPopup=null,t}}async signTransaction(t){let e;this.currentSigntxPopup&&(this.currentSigntxPopup.closed?this.currentSigntxPopup=null:this.focusWindow(this.currentSigntxPopup)),e=Array.isArray(t)?Array.from(t).map((t=>n(t))):n(t);try{this.currentSigntxPopup=o(this.url+"/signtx.html"),await this.waitForWindowToLoad(this.currentSigntxPopup);const t=await this.bridge.sendMessage(this.currentSigntxPopup,{method:"transaction",params:{txn:e,settings:{disableLedgerNano:this.disableLedgerNano}}},this.url,this.options);if(this.closeWindow(this.currentSigntxPopup),this.currentSigntxPopup=null,"error"===t.status)throw new Error(t.message);if(Array.isArray(t.data)){const e=[];for(const r of t.data)r.blob=new Uint8Array(Buffer.from(r.blob,"hex")),e.push(r);return e}return t.data.blob=new Uint8Array(Buffer.from(t.data.blob,"hex")),t.data}catch(t){throw this.closeWindow(this.currentSigntxPopup),this.currentSigntxPopup=null,t}}async signLogicSig(t,e){this.currentSignLogicSigPopup&&(this.currentSignLogicSigPopup.closed?this.currentSignLogicSigPopup=null:this.focusWindow(this.currentSignLogicSigPopup));try{this.currentSignLogicSigPopup=o(this.url+"/logicsigtx.html"),await this.waitForWindowToLoad(this.currentSignLogicSigPopup);let r=t;t.constructor===Uint8Array&&(r=Buffer.from(t).toString("base64"));const s=await this.bridge.sendMessage(this.currentSignLogicSigPopup,{method:"logicsig",params:{logic:r,address:e}},this.url,this.options);if(this.closeWindow(this.currentSignLogicSigPopup),this.currentSignLogicSigPopup=null,"error"===s.status)throw new Error(s.message);return new Uint8Array(Buffer.from(s.data.signedTeal,"base64"))}catch(t){throw this.closeWindow(this.currentSignLogicSigPopup),this.currentSignLogicSigPopup=null,t}}async waitForWindowToLoad(t,e=30){for(let r=0;r<e&&(await s(300),t);r++)try{if("success"==(await a.sendMessage(t,{method:"status"},this.url)).status)return}catch(t){}throw new Error(i.WINDOW_NOT_LOADED)}closeWindow(t){t&&!t.closed&&t.close&&t.close()}focusWindow(t){throw t&&t.focus?(t.focus(),new Error(i.WINDOW_IS_OPENED)):new Error(i.INVALID_WINDOW)}}},831:(t,e,r)=>{const o=r(370);t.exports=class{constructor(t){const e=this;this.options={waitForReply:!0,timeout:250},this.listenerCallback=t,this.bridge=new o("wallet-bridge-communication-channel",(function(t,r,o,s){e.listenerCallback&&e.listenerCallback(t,o)}))}sendMessage(t,e,r,o){return this.bridge.sendMessage(t,e,r,o||this.options)}setNewListener(t){this.listenerCallback=t}close(){this.bridge.close()}}},847:(t,e,r)=>{const{WINDOW_NOT_OPENED:o}=r(783),s={width:400,height:600};t.exports={openPopup:function(t,e=s){let{name:r="",width:n,height:i,top:a=0,left:u=0}=e;n&&(window.outerWidth?u=Math.round((window.outerWidth-n)/2)+window.screenX:window.screen.width&&(u=Math.round((window.screen.width-n)/2))),i&&(window.outerHeight?a=Math.round((window.outerHeight-i)/2)+window.screenY:window.screen.height&&(a=Math.round((window.screen.height-i)/2))),n&&i&&(e={top:a,left:u,width:n,height:i,status:1,toolbar:0,menubar:0,resizable:1,scrollbars:1});const c=Object.keys(e).map((t=>{const r=e[t];if(null!=r&&"function"==typeof r.toString)return`${t}=${r.toString()}`})).filter(Boolean).join(",");let p;try{p=window.open(t,r,c)}catch(t){throw new Error(`${o} - ${t.stack||t.message}`)}if(!p||window.closed)throw new Error(`${o} - blocked`);return p}}},783:t=>{t.exports={WINDOW_NOT_LOADED:"Window not loaded",WINDOW_IS_OPENED:"Windows is opened",WINDOW_NOT_OPENED:"Can not open popup window",INVALID_WINDOW:"Invalid window"}},104:t=>{t.exports={sleep:function(t=200){return new Promise((e=>setTimeout(e,t)))},prepareTxn:function(t){if(t.constructor===Uint8Array)return Buffer.from(t).toString("base64");if("string"==typeof t)return t;const e=Object.assign({},t);if(e.note&&e.note.constructor===Uint8Array&&(e.note=Buffer.from(e.note).toString("base64")),e.assetMetadataHash&&e.assetMetadataHash.constructor===Uint8Array&&(e.assetMetadataHash=Buffer.from(e.assetMetadataHash).toString("base64")),e.group&&e.group.constructor===Uint8Array&&(e.group=Buffer.from(e.group).toString("base64")),"appl"===e.type&&e.appApprovalProgram&&e.appApprovalProgram.constructor===Uint8Array&&(e.appApprovalProgram=Buffer.from(e.appApprovalProgram).toString("base64")),"appl"===e.type&&e.appClearProgram&&e.appClearProgram.constructor===Uint8Array&&(e.appClearProgram=Buffer.from(e.appClearProgram).toString("base64")),"appl"===e.type&&e.appArgs&&e.appArgs.length>0)for(let t=0;t<e.appArgs.length;t++)e.appArgs[t].constructor===Uint8Array&&(e.appArgs[t]=Buffer.from(e.appArgs[t]).toString("base64"));return e}}}},e={};function r(o){var s=e[o];if(void 0!==s)return s.exports;var n=e[o]={exports:{}};return t[o](n,n.exports,r),n.exports}(()=>{"use strict";new(r(385)),console.log("ok")})()})();