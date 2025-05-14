export const Sheet = ({ children, ...props }) => {
  return <div {...props}>{children}</div>;
};

export const SheetTrigger = ({ children, asChild, ...props }) => {
  if (asChild) {
    return children;
  }
  return <button {...props}>{children}</button>;
};

export const SheetContent = ({ children, className, ...props }) => {
  return (
    <div className={`fixed top-0 right-0 h-full bg-white shadow-lg p-4 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};