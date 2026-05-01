// import React, {
//   memo,
//   useState,
//   lazy,
//   Suspense,
//   useMemo,
//   useEffect,
// } from "react";
// import { useParams, useNavigate } from "react-router-dom"; // 🟢 Added for routing functionality
// import {
//   useGetProjectStatusQuery,
//   useGetProjectDetailsQuery,
// } from "../features/api/projectApiSlice";
// import { Loader2 } from "lucide-react";
// import Stepper from "./Stepper";

// // Lazy loaded views (Imports kept exactly as provided)
// const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
// const MappingView = lazy(() => import("./interactive/MappingView"));
// const TargetSelectionStep = lazy(
//   () => import("./interactive/TargetSelectionStep"),
// );
// const ProcessingState = lazy(() => import("../pages/ProcessingState"));
// const SuccessState = lazy(() => import("./interactive/SuccessState"));
// const FailureState = lazy(() => import("./interactive/FailureState"));

// const ProcessingWizard = memo(({ projectId: propId, onReset }) => {
//   const navigate = useNavigate();
//   const { projectId: paramId } = useParams();

//   // 🟢 1. ROBUST ID DETECTION: Works both as a Prop (New Analysis) and a URL Param (Resume from Vault)
//   const projectId = propId || paramId;

//   const [showTargetGrid, setShowTargetGrid] = useState(false);

//   // 🔌 2. API SYNC
//   const {
//     data: status,
//     isError,
//     error: apiError,
//   } = useGetProjectStatusQuery(projectId, {
//     skip: !projectId,
//     pollingInterval: 3000,
//   });

//   const { data: details } = useGetProjectDetailsQuery(projectId, {
//     skip:
//       !projectId ||
//       !["claimSelection", "targetSelection", "completed"].includes(
//         status?.currentStep || status?.status,
//       ),
//   });

//   // 🟢 3. AUTO-REDIRECT LOGIC: If the project finishes, take user to the report automatically
//   useEffect(() => {
//     if (status?.status === "completed") {
//       // Small delay so user sees "Complete" state before redirect
//       const timer = setTimeout(() => {
//         if (onReset) onReset(); // Clear parent state if applicable
//         navigate(`/dashboard/report-view/${projectId}`, { replace: true });
//       }, 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [status?.status, navigate, projectId, onReset]);

//   // Handle errors (Project not found or Auth expiry)
//   if (isError || status?.status === "failed") {
//     return (
//       <FailureState
//         reason={status?.failureReason || apiError?.data?.message}
//         onClose={onReset || (() => navigate("/dashboard/projects"))}
//       />
//     );
//   }

//   if (!status)
//     return (
//       <div className="p-20 flex flex-col items-center justify-center animate-pulse">
//         <Loader2 className="animate-spin text-[#ff6b00] mb-4" size={48} />
//         <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
//           Connecting to Engine...
//         </p>
//       </div>
//     );

//   const renderContent = () => {
//     // 🟢 Terminal Success State
//     if (status.status === "completed") {
//       return (
//         <SuccessState
//           projectId={projectId}
//           data={details?.project || status} // Use status if details not yet loaded
//           onClose={onReset || (() => navigate("/dashboard/projects"))}
//         />
//       );
//     }

//     // 🟠 Interactive Mode Step Logic
//     switch (status.currentStep) {
//       case "claimSelection":
//         return (
//           <div className="flex flex-col items-center w-full gap-6">
//             <Stepper activeStep={2} />
//             <ClaimsStep
//               projectId={projectId}
//               data={details?.project}
//               onProceed={() => {}} // Polling handles the transition automatically
//             />
//           </div>
//         );

//       case "targetSelection":
//         return !showTargetGrid ? (
//           <MappingView
//             projectId={projectId}
//             data={details?.project}
//             onProceed={() => setShowTargetGrid(true)}
//           />
//         ) : (
//           <TargetSelectionStep
//             projectId={projectId}
//             data={details?.project}
//             onBack={() => setShowTargetGrid(false)}
//           />
//         );

//       default:
//         // 🔵 Processing Loader (Quick, Bulk, or Intermediate steps)
//         return <ProcessingState status={status} />;
//     }
//   };

//   return (
//     <div className="w-full flex flex-col items-center animate-scale-up">
//       <div className="w-full">
//         <Suspense
//           fallback={
//             <div className="p-20 flex flex-col items-center justify-center">
//               <Loader2 className="animate-spin text-[#ff6b00] mb-4" size={48} />
//               <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
//                 Assembling View...
//               </span>
//             </div>
//           }
//         >
//           {renderContent()}
//         </Suspense>
//       </div>
//     </div>
//   );
// });

// export default ProcessingWizard;
import React, {
  memo,
  useState,
  lazy,
  Suspense,
  useMemo,
  useEffect,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProjectStatusQuery,
  useGetProjectDetailsQuery,
} from "../features/api/projectApiSlice";
import { Loader2 } from "lucide-react";
import Stepper from "./Stepper";
import InteractiveMappingLoader from "./interactive/InteractiveMappingLoader";
import FinalizingLoader from "./interactive/FinalizingLoader";

// Views
const ClaimsStep = lazy(() => import("./interactive/ClaimsStep"));
const MappingView = lazy(() => import("./interactive/MappingView"));
const TargetSelectionStep = lazy(
  () => import("./interactive/TargetSelectionStep"),
);
const ProcessingState = lazy(() => import("../pages/ProcessingState"));
const SuccessState = lazy(() => import("./interactive/SuccessState"));
const FailureState = lazy(() => import("./interactive/FailureState"));

const ProcessingWizard = memo(({ projectId: propId, onReset }) => {
  const navigate = useNavigate();
  const { projectId: paramId } = useParams();
  const projectId = propId || paramId;

  const [showTargetGrid, setShowTargetGrid] = useState(false);
  const [isSkeletonBufferDone, setIsSkeletonBufferDone] = useState(false);

  const {
    data: status,
    isError,
    error: apiError,
  } = useGetProjectStatusQuery(projectId, {
    skip: !projectId,
    pollingInterval: 2500,
  });

  const { data: details, isFetching: isDetailsLoading } =
    useGetProjectDetailsQuery(projectId, {
      skip: !projectId,
      refetchOnMountOrArgChange: true,
    });

  // 2-Second Buffer timer (Created for Interactive Polish)
  useEffect(() => {
    const timer = setTimeout(() => setIsSkeletonBufferDone(true), 2000);
    return () => clearTimeout(timer);
  }, [projectId]);

  const activeStepNumber = useMemo(() => {
    if (!status || status.mode !== "interactive") return 1;
    const stepMap = {
      initializing: 1,
      claimSelection: 2,
      generatingMapping: 3,
      targetSelection: 4,
      productProcessing: 5,
      finalizing: 5,
    };
    return stepMap[status.currentStep] || 2;
  }, [status]);

  if (isError || status?.status === "failed") {
    return (
      <FailureState
        reason={status?.failureReason || apiError?.data?.message}
        onClose={onReset || (() => navigate("/dashboard/projects"))}
      />
    );
  }

  if (!status)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-[#ff6b00]" size={40} />
      </div>
    );

  const renderContent = () => {
    // 🛑 1. Completion check (Always first)
    if (status.status === "completed") {
      return (
        <SuccessState
          projectId={projectId}
          data={status}
          onClose={onReset || (() => navigate("/dashboard/projects"))}
        />
      );
    }

    // 🟢 2. QUICK & BULK BRANCH (NO SKELETON ALLOWED HERE)
    // If mode is quick or bulk, go DIRECTLY to ProcessingState
    if (status.mode === "quick" || status.mode === "bulk") {
      return <ProcessingState status={status} />;
    }

    // 🟠 3. INTERACTIVE BRANCH (Skeleton & Mapping Loaders live here only)
    if (status.mode === "interactive") {
      const claimsReady = !!details?.project?.allClaims?.length;
      const mappingReady = !!details?.project?.results?.pcrAnalysis?.length;

      // Show Initial Skeleton (Image 1)
      if (
        !isSkeletonBufferDone ||
        status.currentStep === "initializing" ||
        (status.currentStep === "claimSelection" && !claimsReady)
      ) {
        return (
          <InteractiveMappingLoader
            step="initializing"
            patentId={status.patentId}
            status={status}
          />
        );
      }

      // Show Progress Loader (Image 2)
      if (
        status.currentStep === "generatingMapping" ||
        (status.currentStep === "targetSelection" && !mappingReady)
      ) {
        return (
          <InteractiveMappingLoader
            step="mapping"
            patentId={status.patentId}
            claimNumber={status.selectedClaim?.number}
            status={status}
          />
        );
      }

      // Actual interactive views
      switch (status.currentStep) {
        case "claimSelection":
          return (
            <ClaimsStep
              projectId={projectId}
              data={details?.project}
              onProceed={() => {}}
            />
          );
        case "targetSelection":
          return !showTargetGrid ? (
            <MappingView
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
        case "finalizing":
          return <FinalizingLoader status={status} />;
        default:
          return <ProcessingState status={status} />;
      }
    }

    // Fallback
    return <ProcessingState status={status} />;
  };

  return (
    <div className="w-full flex flex-col items-center animate-scale-up max-w-[1400px] mx-auto px-4 pb-20">
      {status.mode === "interactive" && status.status !== "completed" && (
        <div className="w-full animate-fade-in mb-8">
          <Stepper activeStep={activeStepNumber} />
        </div>
      )}
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
