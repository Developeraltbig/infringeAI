import React, { memo, useState, lazy, Suspense } from "react";
import {
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import Stepper from "../components/Stepper";
import InteractiveProcessing from "./interactive/InteractiveProcessing";

const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
const MappingView = lazy(() => import("./interactive/MappingView"));
const TargetSelectionStep = lazy(
  () => import("./interactive/TargetSelectionStep"),
);
const ProcessingState = lazy(() => import("../pages/ProcessingState"));
const SuccessState = lazy(() => import("./interactive/SuccessState"));
const FailureState = lazy(() => import("./interactive/FailureState"));

const ProcessingModal = memo(({ projectId, onClose }) => {
  const [showTargetGrid, setShowTargetGrid] = useState(false);

  const { data: status, isError } = useGetProjectStatusQuery(projectId, {
    pollingInterval: 3000,
  });
  const { data: details } = useGetProjectDetailsQuery(projectId, {
    skip:
      !projectId ||
      ![
        "claimSelection",
        "targetSelection",
        "completed",
        "generatingMapping",
        "finalizing",
      ].includes(status?.currentStep || status?.status),
  });

  if (!status)
    return (
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-[#ff6b00]" size={40} />
        <p className="font-bold text-slate-400">Syncing with AI Engines...</p>
      </div>
    );

  const renderContent = () => {
    if (status.status === "failed" || isError)
      return <FailureState reason={status?.failureReason} onClose={onClose} />;

    if (status.status === "completed")
      return (
        <SuccessState projectId={projectId} data={status} onClose={onClose} />
      );

    // --- INTERACTIVE MODE LOGIC ---
    switch (status.currentStep) {
      case "initializing":
        return (
          <InteractiveProcessing
            step="initializing"
            patentId={status.patentId}
          />
        );

      case "claimSelection":
        return (
          <div className="w-full flex flex-col items-center">
            <Stepper activeStep={2} />
            <ClaimsStep
              projectId={projectId}
              data={details?.project}
              onProceed={() => {}}
            />
          </div>
        );

      case "generatingMapping":
        return (
          <div className="w-full flex flex-col items-center">
            <Stepper activeStep={3} />
            <InteractiveProcessing
              step="mapping"
              patentId={status.patentId}
              claimNumber={status.selectedClaim?.number}
            />
          </div>
        );

      case "targetSelection":
        return (
          <div className="w-full flex flex-col items-center">
            <Stepper activeStep={4} />
            {!showTargetGrid ? (
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
            )}
          </div>
        );

      case "finalizing":
        return (
          <div className="w-full flex flex-col items-center">
            <Stepper activeStep={5} />
            <InteractiveProcessing
              step="finalizing"
              patentId={status.patentId}
              claimNumber={status.selectedClaim?.number}
            />
          </div>
        );

      default:
        return <ProcessingState status={status} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto px-4">
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
