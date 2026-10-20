type Props = {
  message: string;
};

export function ErrorMessage({ message }: Props) {
  return (
    <div 
      role="alert" 
      className="error-banner" 
      style={{ 
        color: "red", 
        padding: "1rem", 
        border: "1px solid red", 
        borderRadius: "4px", 
        marginTop: "1rem",
        marginBottom: "1rem",
        backgroundColor: "#fee2e2" 
      }}
    >
      {message}
    </div>
  );
}