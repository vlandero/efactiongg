import { useEffect, useState, ElementType, HTMLAttributes } from "react";
import cn from 'classnames'

type AnimatedTextProps = {
  text: string;
  as?: ElementType;
} & HTMLAttributes<HTMLElement>;

export const AnimatedText = ({
  text,
  as: Tag = "span", // default to <span>
  className,
  ...props
}: AnimatedTextProps) => {
  const [animatedIndexes, setAnimatedIndexes] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedIndexes([...Array(text.length).keys()]);
      setTimeout(() => setAnimatedIndexes([]), 700); // reset after animation
    }, 20000); // every 10 seconds

    return () => clearInterval(interval);
  }, [text]);

  return (
    <Tag className={cn("flex", className)} {...props}>
      {text.split("").map((char, idx) => (
        <span
          key={idx}
          className={cn("inline-block", {
            "animate-bounceOnce": animatedIndexes.includes(idx),
          })}
          style={{
            animationDelay: `${idx * 50}ms`,
            animationFillMode: "forwards",
          }}
        >
          {char}
        </span>
      ))}
    </Tag>
  );
};
