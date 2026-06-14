
import React from 'react';
import { Alert } from 'react-bootstrap';

const RateLimitWarning: React.FC = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '65vh' }}>
      <Alert variant="warning" className="text-center shadow bg-white p-4 rounded" style={{ maxWidth: '500px' }}>
        <h4 className="mb-3" style={{color:"red"}}>⏱ Too Many Requests</h4>
        <p>
          You've made too many attempts in a short period. Please wait a moment before trying again.
        </p>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          Error Code: <strong>429</strong> — Rate Limit Exceeded
        </p>
      </Alert>
    </div>
  );
};

export default RateLimitWarning;
