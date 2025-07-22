'use client';

import type { Placement } from '@floating-ui/react';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react';
import * as React from 'react';

interface TooltipOptions {
  initialOpen?: boolean;
  placement?: Placement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const floating = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const context = floating.context;

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  });
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return {
    open,
    setOpen,
    ...interactions,
    ...floating,
  };
}

type TooltipContextType = ReturnType<typeof useTooltip> | null;
const TooltipContext = React.createContext<TooltipContextType>(null);

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);
  if (!context)
    throw new Error('Tooltip components must be wrapped in <Tooltip>');
  return context;
};

export function Tooltip({
  children,
  ...options
}: React.PropsWithChildren<TooltipOptions>) {
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean;
    children: React.ReactNode;
  }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext();

  const childRef =
    React.isValidElement(children) && 'ref' in children
      ? (children as React.ReactElement & { ref?: React.Ref<unknown> }).ref
      : null;

  const ref = useMergeRefs([context.refs.setReference, propRef, childRef]);

  if (asChild && React.isValidElement(children)) {
    const propsWithDataState = {
      ref,
      ...props,
      'data-state': context.open ? 'open' : 'closed',
    } as React.HTMLAttributes<HTMLElement> & {
      'data-state'?: string;
    };

    return React.cloneElement(
      children,
      context.getReferenceProps(propsWithDataState)
    );
  }

  return null;
});

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(function TooltipContent({ className, style, children, ...props }, propRef) {
  const context = useTooltipContext();
  const ref = useMergeRefs([context.refs.setFloating, propRef]);

  if (!context.open) return null;

  return (
    <FloatingPortal>
      <div
        ref={ref}
        style={{ ...context.floatingStyles, ...style }}
        {...context.getFloatingProps(props)}
        className={`z-50 max-w-xs p-2 text-xs text-zinc-900 bg-zinc-100 rounded-sm transition-opacity duration-200 ${
          className ?? ''
        }`}
      >
        {children}
      </div>
    </FloatingPortal>
  );
});
