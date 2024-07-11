import Flash from "@/components/flash/Flash";

const FlashPage = ({ params }: { params: { id: number } }) => {
  return <Flash id={params.id} />;
};

export default FlashPage;
