export enum RequestStatus {
  Open = "open",
  InProgress = "in_progress",
  Resolved = "resolved",
}

export interface Landlord {
  id: string;
  clerkUserId: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Property {
  id: string;
  landlordId: string;
  name: string;
  address: string;
  createdAt: string;
}

export interface Unit {
  id: string;
  propertyId: string;
  label: string; // e.g. "Apt 2B"
  tenantName?: string;
  tenantEmail?: string;
  tenantPhone?: string;
  token: string; // unique link token for the public request portal
  createdAt: string;
}

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  category: "plumbing" | "electrical" | "hvac" | "appliance" | "other";
  description: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface StatusHistory {
  id: string;
  requestId: string;
  previousStatus: RequestStatus | null;
  newStatus: RequestStatus;
  note?: string;
  createdAt: string;
}
