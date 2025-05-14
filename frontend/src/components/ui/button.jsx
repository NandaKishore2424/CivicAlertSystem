export const Button = ({ children, className, asChild, ...props }) => {
  if (asChild) {
    return children;
  }
  return <button className={`px-4 py-2 rounded ${className || ''}`} {...props}>{children}</button>;
};