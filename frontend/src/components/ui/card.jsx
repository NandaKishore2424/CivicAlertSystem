export const Card = ({ children, className, ...props }) => {
  return <div className={`border rounded-lg shadow-sm ${className || ''}`} {...props}>{children}</div>;
};

export const CardHeader = ({ children, className, ...props }) => {
  return <div className={`p-4 border-b ${className || ''}`} {...props}>{children}</div>;
};

export const CardTitle = ({ children, className, ...props }) => {
  return <h3 className={`text-lg font-bold ${className || ''}`} {...props}>{children}</h3>;
};

export const CardContent = ({ children, className, ...props }) => {
  return <div className={`p-4 ${className || ''}`} {...props}>{children}</div>;
};

export const CardDescription = ({ children, className, ...props }) => {
  return <p className={`text-sm text-muted-foreground ${className || ''}`} {...props}>{children}</p>;
};

export const CardFooter = ({ children, className, ...props }) => {
  return <div className={`p-4 pt-0 ${className || ''}`} {...props}>{children}</div>;
};