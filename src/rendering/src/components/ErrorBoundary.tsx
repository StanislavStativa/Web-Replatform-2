import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

type Props = {
  children: React.ReactNode;
};

function FallbackComponent({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
      <a href="/">Go Home</a>
    </div>
  );
}

export default function CustomErrorBoundary({ children }: Props) {
  return <ErrorBoundary FallbackComponent={FallbackComponent}>{children}</ErrorBoundary>;
}
