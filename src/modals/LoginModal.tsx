import React, { useState } from "react";
import { Modal } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/contexts/AuthenticationContext";
import * as Styled from "./LoginModal.styles";

interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { login, isLoggingIn } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { username, password } = data;
    try {
      await login(username, password);
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Invalid username or password. Please try again.");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Styled.ModalContainer>
        {errorMessage && (
          <Styled.Alert severity="error">{errorMessage}</Styled.Alert>
        )}
        <Styled.ModalTitle variant="h6">Login</Styled.ModalTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Styled.TextField
            label="Username"
            fullWidth
            variant="outlined"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <Styled.TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Styled.SubmitButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoggingIn}
          >
            {isLoggingIn ? <Styled.LoadingIndicator size={24} /> : "Login"}
          </Styled.SubmitButton>
        </form>
      </Styled.ModalContainer>
    </Modal>
  );
};

export default LoginModal;
