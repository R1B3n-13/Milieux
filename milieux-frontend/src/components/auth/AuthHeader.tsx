import Image from "next/image";

interface AuthHeaderProps {
  label: string;
  title: string;
}

const AuthHeader = ({ label, title }: AuthHeaderProps) => {
  return (
    <div className="flex">
      <Image src={"/logo.png"} alt="Logo" width={50} height={50} className="h-10 w-10"/>
      <div className="w-full flex flex-col gap-y-4 items-center justify-center">
        <h1 className="text-3xl font-semibold -ml-10">{title}</h1>
        <p className="text-muted-foreground text-sm -ml-10">{label}</p>
      </div>
    </div>
  );
};

export default AuthHeader;
