import React from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/contexts/AuthenticationContext";

// Define the input types
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
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { username, password } = data;
    try {
      await login(username, password);
      alert("Login successful!");
      onClose();
    } catch (error) {
      alert("Login failed. Please check your username and password.");
      console.error("Login error:", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="login-modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="login-modal-title" variant="h6" component="h2" mb={2}>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            margin="normal"
            {...register("username", { required: "Username is required" })}
            error={!!errors.username}
            helperText={errors.username?.message}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            margin="normal"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default LoginModal;
