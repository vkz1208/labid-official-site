"use client";

import { useEffect } from "react";

export function AdminUnsavedGuard() {
  useEffect(() => {
    let dirty = false;
    const markDirty = (event: Event) => {
      if ((event.target as HTMLElement).closest("form")) dirty = true;
    };
    const clearDirty = () => { dirty = false; };
    const warn = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    document.addEventListener("input", markDirty);
    document.addEventListener("change", markDirty);
    document.addEventListener("submit", clearDirty);
    window.addEventListener("beforeunload", warn);
    return () => {
      document.removeEventListener("input", markDirty);
      document.removeEventListener("change", markDirty);
      document.removeEventListener("submit", clearDirty);
      window.removeEventListener("beforeunload", warn);
    };
  }, []);
  return null;
}

export function DeleteCaseButton({ action, id }: { action: (form: FormData) => void | Promise<void>; id: number }) {
  return (
    <button
      className="danger-button"
      formAction={action}
      name="id"
      value={id}
      onClick={(event) => {
        if (!window.confirm("确认永久删除这个案例？如只想暂时隐藏，请取消并关闭“在官网展示”。")) event.preventDefault();
      }}
    >
      删除
    </button>
  );
}
