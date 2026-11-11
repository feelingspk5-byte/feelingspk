import { newId } from "@/lib/store/ids";
import type { AuditEntry, StoreState } from "@/lib/store/types";

export function pushAudit(
  draft: StoreState,
  actor: string,
  action: string,
  detail?: string,
) {
  const entry: AuditEntry = {
    id: newId("audit"),
    at: new Date().toISOString(),
    actor,
    action,
    detail,
  };
  draft.auditLog = [entry, ...draft.auditLog].slice(0, 200);
}
