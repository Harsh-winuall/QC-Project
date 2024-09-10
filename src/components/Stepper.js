import React from 'react'

function Stepper({currentQCIndex, qcList}) {
  return (
    <div style={{ margin: '100px', overflowX: 'auto', whiteSpace: 'nowrap', overflowX:"auto", scrollbarWidth: "none", msOverflowStyle: "none" }}>
      <Steps current={currentQCIndex} style={{ display: 'inline-block', width: '100%' }}> {/* Allow horizontal scrolling */}
        {qcList.map((qc, index) => (
          <Step key={index}/>))} {/* Display step numbers */}
      </Steps>
    </div>
  )
}

export default Stepper
