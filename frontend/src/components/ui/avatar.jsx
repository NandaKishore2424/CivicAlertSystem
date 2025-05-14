export const Avatar = ({ children, className, ...props }) => {
  return <div className={`relative w-10 h-10 rounded-full overflow-hidden ${className || ''}`} {...props}>{children}</div>;
};

export const AvatarImage = ({ src, alt = "", className, ...props }) => {
  return <img src={src} alt={alt} className={`w-full h-full object-cover ${className || ''}`} {...props} />;
};

export const AvatarFallback = ({ children, className, ...props }) => {
  return <div className={`flex items-center justify-center w-full h-full bg-gray-200 ${className || ''}`} {...props}>{children}</div>;
};