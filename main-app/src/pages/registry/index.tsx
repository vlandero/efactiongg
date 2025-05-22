import { Registry } from "@/components/Registry";
import { FactionRegistryFull } from "@/models/DB/FactionRegistry.model";

type Props = {
  data?: FactionRegistryFull;
};

const RegistryPage: React.FC<Props> = () => {
  
  return (
    <div className="min-h-screen p-6 bg-neutral-900 text-white">
      <Registry />
    </div>
  );
};

export default RegistryPage;
