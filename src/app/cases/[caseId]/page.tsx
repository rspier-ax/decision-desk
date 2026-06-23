import { CaseReviewPage } from "@/features/cases/components/case-review-page";

export default async function CasePage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = await params;
  return <CaseReviewPage caseId={caseId} />;
}
