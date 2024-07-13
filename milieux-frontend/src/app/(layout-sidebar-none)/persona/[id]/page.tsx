import Persona from "@/components/persona/Persona";

const OtherUsersPersonaPage = ({ params }: { params: { id: number } }) => {
  return (
    <div className="flex flex-col items-center justify-start pb-5">
      <Persona id={params.id} />
    </div>
  );
};

export default OtherUsersPersonaPage;
