import React from 'react'

import Form from '@marvintau/well-formed';

import './index.css';

const specs = {

  space : {
    markedResend: {type: 'label', color: 'warning', desc:'已标记为重发函'},
    sendID: {type: 'input', desc: '寄件运单号'},
    recvID: {type: 'input', desc: '收件运单号'},
    received: {type:'label', color:'info', desc:'已确认收到回函'},
    alternative: {type: 'label', color: 'info', desc:'已进入替代程序'},
    confirmed: {type:'label', color:'success', desc:'已确认金额相符'},
    confirmedNE: {type: 'label', color:'danger', desc:'已确认金额不符'}
  },

  states : {
    init: {vec: {sendID: true}, enterDesc: '确认发函'},
    sent: {vec: {sendID: true, recvID: true}, enterDesc:'确认发函'},
    received: {vec: {received: true}, enterDesc: '收到回函', color:'success'},
    requestedResend: {vec: {markedResend: true, sendID: true}, enterDesc:'重新发函', color:'warning'},
    alternative: {vec: {alternative: true}, enterDesc:'进入替代程序'},
    confirmed: {vec: {confirmed:true}, enterDesc:'确认金额相符'},
    confirmedNE: {vec:{confirmedNE: true}, enterDesc:'确认金额不符'},
  },

  rules : {
    requestedResend: 'sent',
    init: 'sent',
    sent: [ 'received', 'requestedResend'],
    received: [
      'requestedResend',
      'alternative',
      'confirmed',
      'confirmedNE',
    ],
    confirmed: {name:'init', enterDesc: '重置', color:'danger'},
    confirmedNE: {name: 'init', enterDesc: '重置', color:'danger'},
    alternative: {name: 'init', enterDesc: '重置', color:'danger'},
  }
}

export default () => {

  return <Form {...specs} />
}