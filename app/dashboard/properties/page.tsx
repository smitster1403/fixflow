import { getProperties, getPropertyWithUnits } from "../actions";
import { PropertiesContent } from "./properties-content";

export default async function PropertiesPage() {
  let properties: Array<Record<string, unknown>>;
  try {
    properties = await getProperties();
  } catch {
    properties = [];
  }

  // For each property, also fetch its units (with tenant data)
  const propertiesWithUnits = await Promise.all(
    properties.map(async (p) => {
      try {
        const data = await getPropertyWithUnits(p.id as string);
        return { ...p, units: data?.units ?? [] };
      } catch {
        return { ...p, units: [] };
      }
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <PropertiesContent properties={propertiesWithUnits as any} />;
}
