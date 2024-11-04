import { Button, styled, ButtonProps } from "@mui/material";

const StyledButton = styled(Button)(() => ({
  color: "rgba(255, 255, 255, 1)",
  backgroundColor: "#0095F6",
  borderRadius: "8px",
  padding: "7px 113px",
  textTransform: "none",
  // maxWidth: 'max-content',
  "&:hover": {
    backgroundColor: "#EFEFEF",
    color: "black",
  },
  "&:active": {
    transform: "translateY(2px)",
  },
}));

interface MainButtonProps extends ButtonProps {
  buttonText: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

const MainButton: React.FC<MainButtonProps> = ({
  buttonText,
  onClick,
  type = "button",
  ...props
}) => {
  return (
    <StyledButton variant="contained" onClick={onClick} type={type} {...props}>
      {buttonText}
    </StyledButton>
  );
};

export default MainButton;
