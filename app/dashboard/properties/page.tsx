import { getPropertiesWithUnits } from "../actions";
import { PropertiesContent } from "./properties-content";

export default async function PropertiesPage() {
  let properties;
  try {
    properties = await getPropertiesWithUnits();
  } catch {
    properties = [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PropertiesContent properties={properties as any} />;
}
