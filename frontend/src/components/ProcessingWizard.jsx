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

import React, { memo, useState, lazy, Suspense } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const ProcessingWizard = memo(({ projectId: propId, onReset }) => {
  const navigate = useNavigate();
  const { projectId: paramId } = useParams();

  // 1. ID DETECTION: Works for new analysis and resuming from vault
  const projectId = propId || paramId;

  const [showTargetGrid, setShowTargetGrid] = useState(false);

  // 2. API SYNC: Poll for status every 3 seconds
  const {
    data: status,
    isError,
    error: apiError,
  } = useGetProjectStatusQuery(projectId, {
    skip: !projectId,
    pollingInterval: 3000,
  });

  const { data: details } = useGetProjectDetailsQuery(projectId, {
    skip:
      !projectId ||
      !["claimSelection", "targetSelection", "completed"].includes(
        status?.currentStep || status?.status,
      ),
  });

  // 🟢 NOTE: The auto-redirect useEffect has been removed to allow
  // manual navigation via the "View Chart" buttons on the Success screen.

  // Handle errors
  if (isError || status?.status === "failed") {
    return (
      <FailureState
        reason={status?.failureReason || apiError?.data?.message}
        onClose={onReset || (() => navigate("/dashboard/projects"))}
      />
    );
  }

  // Initial loading state
  if (!status)
    return (
      <div className="p-20 flex flex-col items-center justify-center animate-pulse">
        <Loader2 className="animate-spin text-[#ff6b00] mb-4" size={48} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          Connecting to Engine...
        </p>
      </div>
    );

  const renderContent = () => {
    // 🟢 TERMINAL SUCCESS STATE:
    // This will now stay visible until the user clicks a button inside SuccessState.jsx
    if (status.status === "completed") {
      return (
        <SuccessState
          projectId={projectId}
          // We pass 'status' here because it contains the 'groupProjects' array needed for Bulk Mode
          data={status}
          onClose={onReset || (() => navigate("/dashboard/projects"))}
        />
      );
    }

    // 🟠 INTERACTIVE MODE LOGIC
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
        // 🔵 PROCESSING LOADER: Used for Quick and Bulk background phases
        return <ProcessingState status={status} />;
    }
  };

  return (
    <div className="w-full flex flex-col items-center animate-scale-up">
      <div className="w-full">
        <Suspense
          fallback={
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-[#ff6b00] mb-4" size={48} />
              <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                Assembling View...
              </span>
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
