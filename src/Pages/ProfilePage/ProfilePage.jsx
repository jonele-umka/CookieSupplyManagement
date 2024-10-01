import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Личный кабинет
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate("/signIn")}
      >
        Выйти
      </Button>
    </Box>
  );
}

export default ProfilePage;
