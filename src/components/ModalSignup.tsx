import { PropsWithChildren, useMemo, useRef, useState } from "react";
import Modal from "./Modal";
import { Button } from "@/components/Button";
import { ButtonWithTooltip } from "./ButtonWithTooltip";
import { Tree } from "react-arborist";
import cn from "classnames";

type ModalSignupProps = {
  onClose: () => void;
};

type FactionRegistry = {
  categories: string[];
  leaves: string[];
};

const defaultFactionRegistry: FactionRegistry = {
  categories: ["House", "Division", "Team", "Roster"],
  leaves: ["Coaching staff", "Main", "Subs"],
};

const emptyFactionRegistry: FactionRegistry = {
  categories: [],
  leaves: [],
};

const ModalNavButtons = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex justify-between w-[400px] m-auto">{children}</div>
  );
};

type TreeNode = {
  id: string;
  name: string;
  children?: TreeNode[];
};

type EditableItemProps = {
  value: string;
  onChange: (newValue: string) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isShaking?: boolean;
};

export const EditableItem = ({
  value,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp = false,
  canMoveDown = false,
  isShaking = false,
}: EditableItemProps) => {
  return (
    <div
      className={cn(
        "flex gap-2 items-center transition-all duration-150",
        isShaking && "animate-shake"
      )}
    >
      <div className="flex flex-col">
        {canMoveUp && (
          <button
            onClick={onMoveUp}
            className="text-xs text-zinc-400 hover:text-zinc-200"
            title="Move Up"
          >
            ↑
          </button>
        )}
        {canMoveDown && (
          <button
            onClick={onMoveDown}
            className="text-xs text-zinc-400 hover:text-zinc-200"
            title="Move Down"
          >
            ↓
          </button>
        )}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded bg-zinc-700 text-light px-2 py-1 flex-1"
        placeholder="Enter name..."
      />

      <button
        onClick={onRemove}
        className="text-red-400 hover:text-red-600"
        title="Remove"
      >
        ✕
      </button>
    </div>
  );
};

function generateTreeData(
  factionRegistry: FactionRegistry,
  depth = 1,
  playersPerLeaf = 3
): TreeNode[] {
  function createNodes(level: number, path: string[]): TreeNode[] {
    if (level >= factionRegistry.categories.length) {
      return factionRegistry.leaves.map((leaf) => ({
        id: [...path, leaf].join("/"),
        name: leaf,
        children: Array.from({ length: playersPerLeaf }, (_, i) => ({
          id: [...path, leaf, `player-${i + 1}`].join("/"),
          name: `Player ${i + 1}`,
        })),
      }));
    }

    const categoryName = factionRegistry.categories[level];
    return Array.from({ length: depth }, (_, i) => {
      const name = `${categoryName} ${i + 1}`;
      const nodePath = [...path, `${categoryName}-${i + 1}`];
      return {
        id: nodePath.join("/"),
        name,
        children: createNodes(level + 1, nodePath),
      };
    });
  }

  return createNodes(0, ["root"]);
}

const MAX_CATEGORIES = 4;

const FactionRegistry = ({
  factionRegistry,
  setFactionRegistry,
  prevStep,
  nextStep,
}: {
  factionRegistry: FactionRegistry;
  setFactionRegistry: React.Dispatch<React.SetStateAction<FactionRegistry>>;
  prevStep: () => void;
  nextStep: () => void;
}) => {
  const [shakingIndex, setShakingIndex] = useState<{
    type: "category" | "leaf";
    index: number;
  } | null>(null);

  const treeData = useMemo(
    () => generateTreeData(factionRegistry),
    [factionRegistry]
  );

  const updateItem = (
    type: "category" | "leaf",
    index: number,
    newValue: string
  ) => {
    setFactionRegistry((prev) => {
      const updated = [...prev[type === "category" ? "categories" : "leaves"]];
      updated[index] = newValue;
      return {
        ...prev,
        [type === "category" ? "categories" : "leaves"]: updated,
      };
    });
  };

  const moveItem = (
    type: "category" | "leaf",
    index: number,
    direction: "up" | "down"
  ) => {
    setFactionRegistry((prev) => {
      const key = type === "category" ? "categories" : "leaves";
      const items = [...prev[key]];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= items.length) return prev;
      [items[index], items[target]] = [items[target], items[index]];
      return { ...prev, [key]: items };
    });
  };

  const removeItem = (type: "category" | "leaf", index: number) => {
    setFactionRegistry((prev) => {
      const key = type === "category" ? "categories" : "leaves";
      const updated = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: updated };
    });
  };

  const addItem = (type: "category" | "leaf") => {
    const key = type === "category" ? "categories" : "leaves";
    const max = MAX_CATEGORIES;

    if (shakeFirstEmpty(type)) return;

    setFactionRegistry((prev) => {
      const updated = [...prev[key]];
      if (updated.length < max) {
        updated.push("");
        return { ...prev, [key]: updated };
      }
      return prev;
    });
  };

  const shakeFirstEmpty = (type: "category" | "leaf"): boolean => {
    const key = type === "category" ? "categories" : "leaves";
    const list = factionRegistry[key];
    const firstEmptyIndex = list.findIndex((item) => item.trim() === "");

    if (firstEmptyIndex !== -1) {
      setShakingIndex({ type, index: firstEmptyIndex });
      setTimeout(() => setShakingIndex(null), 500);
      return true;
    }

    return false;
  };

  const isShaking = (type: "category" | "leaf", index: number) =>
    shakingIndex?.type === type && shakingIndex.index === index;

  return (
    <div className="flex flex-col gap-[10px]">
      <h3 className="text-xl text-light">Faction Registry</h3>
      <p className="text-light">
        Set up how you want players to join and be organized in your faction.
      </p>

      <div className="flex flex-wrap gap-4">
        <div className="w-full md:w-[48%]">
          <h4 className="text-light text-sm mb-1">Categories</h4>
          <div className="flex flex-col gap-2">
            {factionRegistry.categories.map((cat, i) => (
              <EditableItem
                key={`category-${i}`}
                value={cat}
                onChange={(val) => updateItem("category", i, val)}
                onRemove={() => removeItem("category", i)}
                onMoveUp={() => moveItem("category", i, "up")}
                onMoveDown={() => moveItem("category", i, "down")}
                canMoveUp={i > 0}
                canMoveDown={i < factionRegistry.categories.length - 1}
                isShaking={isShaking("category", i)}
              />
            ))}
            {factionRegistry.categories.length < MAX_CATEGORIES && (
              <button
                onClick={() => addItem("category")}
                className="text-blue-400 hover:underline text-sm"
              >
                + Add Category
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-[48%]">
          <h4 className="text-light text-sm mb-1">Leaves</h4>
          <div className="flex flex-col gap-2">
            {factionRegistry.leaves.map((leaf, i) => (
              <EditableItem
                key={`leaf-${i}`}
                value={leaf}
                onChange={(val) => updateItem("leaf", i, val)}
                onRemove={() => removeItem("leaf", i)}
                onMoveUp={() => moveItem("leaf", i, "up")}
                onMoveDown={() => moveItem("leaf", i, "down")}
                canMoveUp={i > 0}
                canMoveDown={i < factionRegistry.leaves.length - 1}
                isShaking={isShaking("leaf", i)}
              />
            ))}
            {factionRegistry.leaves.length < MAX_CATEGORIES && (
              <button
                onClick={() => addItem("leaf")}
                className="text-blue-400 hover:underline text-sm"
              >
                + Add Leaf
              </button>
            )}
          </div>
        </div>
      </div>

      <Tree disableDrag={true} disableDrop={true} data={treeData}>
        {({ node, style }) => (
          <div
            style={style}
            className="flex items-center gap-2 rounded text-light shadow"
          >
            <span
              className="cursor-pointer"
              onClick={() => !node.isLeaf && node.toggle()}
            >
              {node.isLeaf ? "🧍" : node.isOpen ? "📂" : "📁"}
            </span>
            <span>{node.data.name}</span>
          </div>
        )}
      </Tree>

      <p className="text-light mt-4">
        Continue to see a preview of your faction registry page!
      </p>

      <ModalNavButtons>
        <Button onClick={prevStep}>Back</Button>
        <Button
          onClick={() =>
            shakeFirstEmpty("category") || shakeFirstEmpty("leaf")
              ? null
              : nextStep()
          }
        >
          Continue
        </Button>
      </ModalNavButtons>
    </div>
  );
};

export const ModalSignup = ({ onClose }: ModalSignupProps) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const [orgName, setOrgName] = useState("");
  const [factionRegistry, setFactionRegistry] = useState<FactionRegistry>(
    defaultFactionRegistry
  );

  const Intro = () => {
    return (
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-xl mb-2 text-light">
          To begin, choose what best describes your setup.
        </h3>
        <h4 className="text-l mb-2 text-light">
          No stress—you'll be able to tweak everything later. This is just to
          help us point you in the right direction.
        </h4>
        <div className="flex flex-col justify-between h-50 items-center">
          <ButtonWithTooltip
            onClick={nextStep}
            className="w-[250px]"
            label="Small team"
            tooltip="Great for close groups of friends or small teams who just want an easy way to stay organized."
          />
          <ButtonWithTooltip
            onClick={nextStep}
            className="w-[250px]"
            label="Bigger Organization"
            tooltip="Perfect if you’ve got lots of teams or play multiple games—this helps keep everything under control."
          />
          <ButtonWithTooltip
            onClick={nextStep}
            className="w-[250px]"
            label="Gaming Network"
            tooltip="Awesome for big gaming communities where anyone can join, team up, and explore freely."
          />
        </div>
      </div>
    );
  };

  const PickName = () => {
    return (
      <div className="flex flex-col gap-[30px]">
        <h3 className="text-xl text-light">Name Your Organization</h3>
        <input
          type="text"
          placeholder="Organization Name"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          className="w-[300px] p-2 m-auto text-black rounded-md input"
        />
        <h4 className="text-light">This is part of the branding </h4>
        <ModalNavButtons>
          <Button onClick={prevStep}>Back</Button>
          <Button onClick={nextStep}>Next</Button>
        </ModalNavButtons>
      </div>
    );
  };

  return (
    <Modal
      onClose={() => {
        onClose();
        setStep(1);
      }}
      title="Let's get started!"
    >
      <div>
        {step === 1 && <Intro />}

        {step === 2 && (
          <FactionRegistry
            factionRegistry={factionRegistry}
            nextStep={nextStep}
            prevStep={prevStep}
            setFactionRegistry={setFactionRegistry}
          />
        )}

        {step === 10 && (
          <div>
            <h3 className="text-xl mb-2 text-light">Create Your Account</h3>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 mb-4 text-black rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 text-black rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 text-black rounded-md"
            />
            <Button onClick={nextStep}>Next</Button>
          </div>
        )}
        {/* branding */}
        {step === 5 && (
          <div>
            <h3 className="text-xl mb-2 text-light">Congratulations!</h3>
            <p>You've completed the setup. Click below to proceed.</p>
            <Button onClick={onClose}>Go to Dashboard</Button>
          </div>
        )}
        {step === 7 && <PickName />}
        {step === 6 && (
          <div>
            <h3 className="text-xl mb-2 text-light">
              Upload a Picture (Optional)
            </h3>
            <input type="file" className="w-full mb-4" />
            <Button onClick={nextStep}>Next</Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
