import { useState } from "react";
import Navbar from "../components/Navbar";
import NoteCard from "../components/NoteCard";
import AddNote from "../components/AddNote";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  return (
    <>
      <Navbar searchValue={searchQuery} onSearchChange={handleSearchChange} />
      <NoteCard searchQuery={searchQuery} />
      <AddNote />
    </>
  );
};

export default Dashboard;