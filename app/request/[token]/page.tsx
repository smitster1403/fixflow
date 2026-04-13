import { getUnitByToken, getRequestsForUnit } from "./actions";
import { TenantPortal } from "./portal";

export default async function TenantRequestPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const unitData = await getUnitByToken(token);

  if (!unitData) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-secondary">
            <svg className="h-8 w-8 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Invalid Link</h1>
          <p className="mt-2 text-muted text-sm max-w-sm">
            This maintenance request link is invalid or has expired. Please contact your landlord for a new link.
          </p>
        </div>
      </div>
    );
  }

  const requests = await getRequestsForUnit(unitData.unit.id);

  return <TenantPortal unitData={unitData} requests={requests} token={token} />;
}
