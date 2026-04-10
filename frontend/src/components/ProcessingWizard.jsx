import React, {
  memo,
  useState,
  lazy,
  Suspense,
  useMemo,
  useEffect,
} from "react";
import {
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import Stepper from "./Stepper";

// Lazy loaded views
const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
const MappingView = lazy(() => import("./interactive/MappingView"));
const TargetSelectionStep = lazy(
  () => import("./interactive/TargetSelectionStep"),
);
const ProcessingState = lazy(() => import("../pages/ProcessingState"));
const SuccessState = lazy(() => import("./interactive/SuccessState"));
const FailureState = lazy(() => import("./interactive/FailureState"));

const ProcessingWizard = memo(({ projectId, onReset }) => {
  const [showTargetGrid, setShowTargetGrid] = useState(false);

  // 🔌 Polling
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

  if (!status) return null;

  const renderContent = () => {
    if (status.status === "failed" || isError)
      return <FailureState reason={status?.failureReason} onClose={onReset} />;
    if (status.status === "completed")
      return (
        <SuccessState
          projectId={projectId}
          data={details?.project}
          onClose={onReset}
        />
      );

    switch (status.currentStep) {
      case "claimSelection":
        return (
          <div className="flex flex-col items-center w-full gap-6">
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
    <div className="w-full flex flex-col items-center animate-scale-up">
      <div className="w-full">
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
    </div>
  );
});

export default ProcessingWizard;
