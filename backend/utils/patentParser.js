export function stripHtmlAndClean(htmlContent) {
  if (!htmlContent) return "";

  let cleanedHtml = htmlContent
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, " ")
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, " ")
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, " ");

  cleanedHtml = cleanedHtml.replace(/<img[^>]*>/gi, " ");
  cleanedHtml = cleanedHtml.replace(/<a[^>]*>([^<]+)<\/a>/gi, "$1");
  cleanedHtml = cleanedHtml.replace(/<[^>]+>/g, " ");

  cleanedHtml = cleanedHtml
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  return cleanedHtml;
}

export function extractFirstClaim(claims) {
  if (!claims || claims.length === 0) {
    return null;
  }

  const firstClaimText = claims[0];
  const numberMatch = firstClaimText.match(/^(\d+)\.\s*/);
  const claimNumber = numberMatch ? parseInt(numberMatch[1]) : 1;

  return {
    number: claimNumber,
    text: firstClaimText,
  };
}

export function extractAssignees(patentData) {
  if (patentData.assignees && Array.isArray(patentData.assignees)) {
    return patentData.assignees;
  } else if (patentData.assignee) {
    return [patentData.assignee];
  }
  return [];
}

export function extractInventors(patentData) {
  if (patentData.inventors && Array.isArray(patentData.inventors)) {
    return patentData.inventors.map((inv) => ({
      name: inv.name || "Unknown",
      link: inv.link || null,
    }));
  }
  return [];
}
