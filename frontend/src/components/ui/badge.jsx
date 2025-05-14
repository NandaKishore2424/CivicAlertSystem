export const Badge = ({ children, className, ...props }) => {
  return <span className={`px-2 py-1 text-xs rounded-full ${className || ''}`} {...props}>{children}</span>;
};