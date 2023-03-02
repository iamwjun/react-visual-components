import React, { useCallback, useEffect, useRef, useState } from "react";

import * as styles from "./index.module.less";

interface ContextmenuProps {
  targetId: string;
  menus: Array<{ label: string; key: string[]; command?: () => void }>;
}

const Contextmenu: React.FC<ContextmenuProps> = ({ targetId, menus = [] }) => {
  const contextRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState<
    Pick<React.CSSProperties, "top" | "left" | "visibility">
  >({
    top: 0,
    left: 0,
    visibility: "hidden",
  });

  const handleKeyDown = useCallback(
    (event: any) => {
      // 获取键盘的keyCode值
      const keyCode = event.keyCode || event.which || event.charCode;
      // 获取ctrl 键对应的事件属性
      const ctrlKeyCode = event.ctrlKey || event.metaKey;
      // 获取shift 键对应的事件属性
      const shiftKeyCode = event.shiftKey;
      if (keyCode === 83 && ctrlKeyCode && shiftKeyCode) {
        const com = menus.filter(({ label }) => label === "Setting");
        if (com.length && com[0].command) {
          com[0].command();
        }
      }
    },
    [menus]
  );

  const handleKeyUp = useCallback((event: { key: any }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key } = event;
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  useEffect(() => {
    const contextMenuEventHandler = (event: {
      target: Node | null;
      preventDefault: () => void;
      offsetX?: number;
      offsetY?: number;
      clientX?: number;
      clientY?: number;
    }) => {
      const targetElement = document.getElementById(targetId);
      if (targetElement && targetElement.contains(event.target)) {
        event?.preventDefault();
        const { offsetX = 0, offsetY = 0, clientX, clientY } = event;
        console.log(clientX, clientY, event);
        setOffset({
          top: offsetY + 15,
          left: offsetX + 25,
          visibility: "visible",
        });
      } else if (
        contextRef.current &&
        !contextRef.current.contains(event.target)
      ) {
        setOffset({ top: 0, left: 0, visibility: "hidden" });
      }
    };

    const offClickHandler = (event: { target: Node | null }) => {
      if (contextRef.current && !contextRef.current.contains(event.target)) {
        setOffset({ top: 0, left: 0, visibility: "hidden" });
      }
    };

    document.addEventListener(
      "contextmenu",
      contextMenuEventHandler as EventListener
    );
    document.addEventListener("click", offClickHandler as EventListener);
    return () => {
      document.removeEventListener(
        "contextmenu",
        contextMenuEventHandler as EventListener
      );
      document.removeEventListener("click", offClickHandler as EventListener);
    };
  }, [targetId]);

  return (
    <div ref={contextRef} className={styles.menu} style={offset}>
      {menus.map(({ label, key, command }) => (
        <div
          key={label}
          className={styles.item}
          onClick={() => {
            setOffset({ top: 0, left: 0, visibility: "hidden" });
            if (command) command();
          }}
        >
          <span>{label}</span>
          <span>{key.join(" ")}</span>
        </div>
      ))}
    </div>
  );
};

export default Contextmenu;
