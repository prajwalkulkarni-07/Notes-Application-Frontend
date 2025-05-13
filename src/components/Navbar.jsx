import * as React from "react";
import PropTypes from "prop-types";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "8px",
  backgroundColor: '#f1f3f4',
  '&:hover': {
    backgroundColor: '#e8eaed',
  },
  width: "100%",
  maxWidth: 720,
  margin: "0 auto",
  transition: "background-color 0.2s",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  height: "100%",
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 2),
  pointerEvents: "none",
  color: '#5f6368',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  "& .MuiInputBase-input": {
    padding: "12px 12px 12px 48px",
    fontSize: "1rem",
    color: '#202124',
    '&::placeholder': {
      color: '#5f6368',
      opacity: 1,
    },
  },
}));

const Navbar = ({ searchValue, onSearchChange }) => (
  <Box 
    sx={{ 
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backgroundColor: '#fff',
      borderBottom: '1px solid #e0e0e0',
      py: 1,
      px: 2,
    }}
  >
    <Box 
      sx={{ 
        maxWidth: 1200,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 500,
          color: '#5f6368',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontSize: '1.25rem',
        }}
      >
        Notes App
      </Typography>
      
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </Search>
    </Box>
  </Box>
);

Navbar.propTypes = {
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  searchValue: "",
};

export default Navbar;