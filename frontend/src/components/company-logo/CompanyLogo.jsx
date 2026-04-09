import React, { memo, useMemo } from "react";
import { useGetLogoConfigQuery } from "../../features/api/interactiveApiSlice";

const CompanyLogo = memo(({ companyName, size = 48 }) => {
  // 🔌 Use RTK Query instead of Axios
  // It will only hit the server once for all 50 components on the page!
  const { data: config, isLoading, isError } = useGetLogoConfigQuery();

  // 🧠 Memoized Domain Logic
  const domain = useMemo(() => {
    if (!companyName) return "generic.com";
    const firstWord = companyName
      .split(/[\s,\.]/)[0]
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    const domainMap = {
      apple: "apple.com",
      microsoft: "microsoft.com",
      google: "google.com",
      amazon: "amazon.com",
      meta: "meta.com",
      netflix: "netflix.com",
      alphabet: "abc.xyz",
      samsung: "samsung.com",
    };

    return domainMap[firstWord] || `${firstWord}.com`;
  }, [companyName]);

  // 🟠 Fallback UI (Patsero Orange Theme)
  const renderFallback = () => (
    <div
      className="flex items-center justify-center text-white font-black shrink-0 rounded-xl"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, #ff6b00 0%, #ff9e00 100%)",
        fontSize: size * 0.4,
      }}
    >
      {companyName?.charAt(0).toUpperCase() || "?"}
    </div>
  );

  // If loading, error, or Brandfetch not configured, show initial circle
  if (isLoading || isError || !config?.success) {
    return renderFallback();
  }

  const logoUrl = `https://cdn.brandfetch.io/${domain}?c=${config.clientId}`;

  return (
    <div
      className="bg-white border border-gray-100 p-1 rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-sm"
      style={{ width: size, height: size }}
    >
      <img
        src={logoUrl}
        alt={companyName}
        className="w-full h-full object-contain"
        // If image not found in Brandfetch database, show fallback
        onError={(e) => {
          e.target.style.display = "none";
          e.target.parentNode.innerHTML = "F";
        }}
      />
    </div>
  );
});

export default CompanyLogo;
