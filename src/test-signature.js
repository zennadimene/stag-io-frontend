// frontend/src/test-signature.js
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const TestSignature = () => {
  const sigCanvas = useRef(null);
  const [signature, setSignature] = useState(null);

  const clear = () => {
    sigCanvas.current.clear();
    setSignature(null);
  };

  const save = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const signatureData = sigCanvas.current.toDataURL();
      setSignature(signatureData);
      console.log('Signature saved:', signatureData.substring(0, 100) + '...');
      alert('Signature saved successfully!');
    } else {
      alert('Please draw your signature first');
    }
  };

  const download = () => {
    if (signature) {
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = signature;
      link.click();
    } else {
      alert('No signature to download');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Signature Test</h2>
      
      <div style={{ border: '2px solid #ccc', borderRadius: '8px', padding: '10px', background: 'white' }}>
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: 500,
            height: 200,
            className: 'signature-canvas',
            style: { border: '1px solid #ddd', borderRadius: '4px', width: '100%', height: 'auto' }
          }}
          backgroundColor="white"
          penColor="black"
          velocityFilterWeight={0.7}
          minWidth={0.5}
          maxWidth={2.5}
        />
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={clear} style={buttonStyle('gray')}>Clear</button>
        <button onClick={save} style={buttonStyle('green')}>Save Signature</button>
        <button onClick={download} style={buttonStyle('blue')}>Download PNG</button>
      </div>
      
      {signature && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Signature Preview:</h3>
          <img src={signature} alt="Signature" style={{ maxWidth: '100%', border: '1px solid #ccc' }} />
        </div>
      )}
    </div>
  );
};

const buttonStyle = (color) => ({
  padding: '10px 20px',
  backgroundColor: color === 'green' ? '#4CAF50' : color === 'blue' ? '#2196F3' : '#9E9E9E',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
});

export default TestSignature;