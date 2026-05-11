import { ScriptViewPage } from "@/components/dashboard/ScriptViewPage";

export default async function ScriptPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <ScriptViewPage scriptId={id} />;
}
