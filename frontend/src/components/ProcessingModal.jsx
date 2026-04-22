import React, { memo, useState, lazy, Suspense, useMemo } from "react";
import {
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import Stepper from "../components/Stepper";

const ClaimsStep = lazy(() => import("../components/interactive/ClaimsStep"));
const MappingView = lazy(() => import("../components/interactive/MappingView"));
const TargetSelectionStep = lazy(
  () => import("../components/interactive/TargetSelectionStep"),
);
const ProcessingState = lazy(() => import("../pages/ProcessingState"));
const SuccessState = lazy(
  () => import("../components/interactive/SuccessState"),
);
const FailureState = lazy(
  () => import("../components/interactive/FailureState"),
);

const ProcessingModal = memo(({ projectId, onClose }) => {
  const [showTargetGrid, setShowTargetGrid] = useState(false);

  const { data: status, isError } = useGetProjectStatusQuery(projectId, {
    pollingInterval: 3000,
  });
  const { data: details } = useGetProjectDetailsQuery(projectId, {
    skip:
      !projectId ||
      !["claimSelection", "targetSelection", "completed"].includes(
        status?.currentStep || status?.status,
      ),
  });

  if (!status)
    return (
      <div className="p-20 text-center text-gray-400">Loading state...</div>
    );

  const renderContent = () => {
    if (status.status === "failed" || isError)
      return <FailureState reason={status?.failureReason} onClose={onClose} />;

    if (status.status === "completed")
      return (
        <SuccessState
          projectId={projectId}
          // 🟢 THE FIX: Pass 'status' instead of 'details?.project'
          // 'status' has the 'groupProjects' array required for the grid UI
          data={status}
          onClose={onClose}
        />
      );

    switch (status.currentStep) {
      case "claimSelection":
        return (
          <div className="flex flex-col gap-6">
            <Stepper activeStep={2} />
            <ClaimsStep
              projectId={projectId}
              data={details?.project}
              onProceed={() => {}}
            />
          </div>
        );
      case "targetSelection":
        return !showTargetGrid ? (
          <MappingView
            projectId={projectId}
            data={details?.project}
            onProceed={() => setShowTargetGrid(true)}
          />
        ) : (
          <TargetSelectionStep
            projectId={projectId}
            data={details?.project}
            onBack={() => setShowTargetGrid(false)}
          />
        );
      default:
        return <ProcessingState status={status} />;
    }
  };

  return (
    /* 🟢 THE FIX: Standard width, no fixed overlay. Respects Dashboard padding. */
    <div className="w-full flex flex-col items-center">
      <Suspense
        fallback={
          <div className="p-20 flex justify-center">
            <Loader2 className="animate-spin text-[#ff6b00]" size={48} />
          </div>
        }
      >
        {renderContent()}
      </Suspense>
    </div>
  );
});

export default ProcessingModal;
