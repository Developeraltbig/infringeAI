import React, { memo, useState, lazy, Suspense } from "react";
import { useGetProjectStatusQuery, useGetProjectDetailsQuery } from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import Stepper from "../components/Stepper";
import InteractiveProcessing from "./interactive/InteractiveProcessing";

const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
const MappingView = lazy(() => import("./interactive/MappingView"));
const TargetSelectionStep = lazy(() => import("./interactive/TargetSelectionStep"));
const ProcessingState = lazy(() => import("../pages/ProcessingState"));
const SuccessState = lazy(() => import("./interactive/SuccessState"));
const FailureState = lazy(() => import("./interactive/FailureState"));

const ProcessingModal = memo(({ projectId, onClose }) => {
  const [showTargetGrid, setShowTargetGrid] = useState(false);

  const { data: status, isError } = useGetProjectStatusQuery(projectId, { pollingInterval: 3000 });
  const { data: details, isFetching: isDetailsLoading } = useGetProjectDetailsQuery(projectId, {
    skip: !projectId || !["claimSelection", "targetSelection", "completed", "generatingMapping", "finalizing"].includes(status?.currentStep || status?.status),
  });

  if (!status) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-[#ff6b00]" size={48} />
      <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing AI Engine...</p>
    </div>
  );

  const renderContent = () => {
    if (status.status === "failed" || isError)
      return <FailureState reason={status?.failureReason} onClose={onClose} />;

    if (status.status === "completed")
      return <SuccessState projectId={projectId} data={status} onClose={onClose} />;

    // 🟢 DATA GUARD: If status moved forward but details aren't fetched yet, stay on loader
    const needsDetails = ["claimSelection", "targetSelection", "generatingMapping", "finalizing"].includes(status.currentStep);
    if (needsDetails && (!details?.project || isDetailsLoading)) {
        return (
            <div className="w-full flex flex-col items-center">
                <Stepper activeStep={status.currentStep === "claimSelection" ? 2 : 3} />
                <InteractiveProcessing step="initializing" patentId={status.patentId} status={status} />
            </div>
        );
    }

    switch (status.currentStep) {
      case "initializing":
        return <InteractiveProcessing step="initializing" patentId={status.patentId} status={status} />;
      
      case "claimSelection":
        return (
          <div className="w-full flex flex-col items-center">
            <Stepper activeStep={2} />
            <ClaimsStep projectId={projectId} data={details?.project} onProceed={() => {}} />
          </div>
        );

      case "generatingMapping":
        return (
          <div className="w-full flex flex-col items-center">
            <Stepper activeStep={3} />
            <InteractiveProcessing step="mapping" patentId={status.patentId} claimNumber={status.selectedClaim?.number} status={status} />
          </div>
        );

      case "targetSelection":
        return (
          <div className="w-full flex flex-col items-center">
            {!showTargetGrid ? (
              <MappingView data={details?.project} onProceed={() => setShowTargetGrid(true)} />
            ) : (
              <TargetSelectionStep projectId={projectId} data={details?.project} onBack={() => setShowTargetGrid(false)} />
            )}
          </div>
        );

      case "finalizing":
        return (
          <div className="w-full flex flex-col items-center">
            <Stepper activeStep={5} />
            <InteractiveProcessing step="finalizing" patentId={status.patentId} claimNumber={status.selectedClaim?.number} status={status} />
          </div>
        );

      default:
        return <ProcessingState status={status} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center max-w-[1400px] mx-auto px-4">
      <Suspense fallback={<div className="p-20 flex justify-center"><Loader2 className="animate-spin text-[#ff6b00]" size={48} /></div>}>
        {renderContent()}
      </Suspense>
    </div>
  );
});

export default ProcessingModal;