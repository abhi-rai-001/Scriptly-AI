import ScriptDetails from "@/features/scripts/components/ScriptDetails";

export default async function ScriptPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <ScriptDetails scriptId={id} />;
}
