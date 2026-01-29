import React from 'react';
import StrokeBasicsWorkflowV2 from './StrokeBasicsWorkflowV2';
import { ErrorBoundary } from '../../components/ErrorBoundary';

export default function StrokeBasics() {
  // Use new Wikipedia-style layout workflow
  return (
    <ErrorBoundary>
      <StrokeBasicsWorkflowV2 />
    </ErrorBoundary>
  );
}
