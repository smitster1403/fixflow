import { getAllRequests } from "../actions";
import { RequestsContent } from "./requests-content";

export default async function RequestsPage() {
  let requests;
  try {
    requests = await getAllRequests();
  } catch {
    requests = [];
  }

  return <RequestsContent requests={requests} />;
}
