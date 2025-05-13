import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PushPinIcon from "@mui/icons-material/PushPin";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Toaster } from 'react-hot-toast';
import { getNotesAPICall, editNoteAPICall, deleteNoteAPICall, pinNoteAPICall } from "../utils/apiCalls.js";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  borderRadius: 2,
  p: 3,
};

const COLORS = [
  { value: '#ffffff', label: 'Default' },
  { value: '#f28b82', label: 'Red' },
  { value: '#fbbc04', label: 'Orange' },
  { value: '#fff475', label: 'Yellow' },
  { value: '#ccff90', label: 'Green' },
  { value: '#a7ffeb', label: 'Teal' },
  { value: '#cbf0f8', label: 'Blue' },
  { value: '#aecbfa', label: 'Dark Blue' },
  { value: '#d7aefb', label: 'Purple' },
  { value: '#fdcfe8', label: 'Pink' },
  { value: '#e6c9a8', label: 'Brown' },
  { value: '#e8eaed', label: 'Gray' },
];

const NoteCard = ({ searchQuery }) => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [color, setColor] = useState(COLORS[0].value);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const result = await getNotesAPICall();
      if (result) {
        const sortedNotes = result.sort((a, b) => {
          if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
        setNotes(sortedNotes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const q = (searchQuery || "").toLowerCase();
    setFilteredNotes(
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(q) ||
          note.content.toLowerCase().includes(q)
      )
    );
  }, [notes, searchQuery]);

  const handleEditClick = (note) => {
    setSelectedNoteId(note._id);
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color || COLORS[0].value);
    setError("");
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setColor(COLORS[0].value);
    setError("");
  };

  const handleEditSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    try {
      await editNoteAPICall(selectedNoteId, title, content, color);
      await fetchNotes();
      handleEditClose();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteNoteAPICall(noteToDelete._id);
      await fetchNotes();
      setDeleteOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteOpen(false);
    setNoteToDelete(null);
  };

  const handlePinClick = async (note) => {
    try {
      await pinNoteAPICall(note._id);
      await fetchNotes();
    } catch (error) {
      console.error("Error pinning note:", error);
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4, color: '#5f6368' }}>
        Loading notes...
      </Typography>
    );
  }

  const pinnedNotes = filteredNotes.filter(note => note.pinned);
  const unpinnedNotes = filteredNotes.filter(note => !note.pinned);

  const renderNoteSection = (notes, title) => (
    notes.length > 0 && (
      <div className="mb-8">
        {title && (
          <Typography variant="body1" sx={{ mb: 2, ml: 2, color: '#5f6368', fontSize: '0.875rem', fontWeight: 500 }}>
            {title}
          </Typography>
        )}
        <div className="note-grid">
          {notes.map((note) => (
            <Card
              key={note._id}
              sx={{
                backgroundColor: note.color || "#FFFFFF",
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                boxShadow: 'none',
                transition: "box-shadow 0.2s ease-in-out",
                "&:hover": {
                  boxShadow: '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)',
                },
              }}
            >
              <CardContent>
                <Typography 
                  variant="subtitle1" 
                  component="div"
                  sx={{ 
                    fontWeight: 500,
                    color: '#202124',
                    mb: 1
                  }}
                >
                  {note.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#5f6368',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {note.content}
                </Typography>
              </CardContent>
              <CardActions 
                sx={{ 
                  justifyContent: "flex-end",
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '&:hover': {
                    opacity: 1
                  }
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handlePinClick(note)}
                  sx={{ color: note.pinned ? '#5f6368' : 'inherit' }}
                >
                  <PushPinIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleEditClick(note)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteClick(note)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </div>
      </div>
    )
  );

  return (
    <>
      <Toaster position="top-center" />
      <div className="px-4 py-6">
        {renderNoteSection(pinnedNotes, pinnedNotes.length > 0 ? 'PINNED' : null)}
        {renderNoteSection(unpinnedNotes, pinnedNotes.length > 0 && unpinnedNotes.length > 0 ? 'OTHERS' : null)}

        {filteredNotes.length === 0 && (
          <Box 
            sx={{ 
              mt: 8,
              textAlign: 'center',
              color: '#5f6368'
            }}
          >
            <Typography variant="h6">
              {searchQuery ? '🔍 No matching notes found' : '📝 Notes you add appear here'}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {searchQuery ? 'Try a different search term' : 'Click the + button to create a note'}
            </Typography>
          </Box>
        )}

        <Modal open={editOpen} onClose={handleEditClose}>
          <Box sx={modalStyle}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ color: '#202124' }}>Edit Note</Typography>
              <IconButton onClick={handleEditClose} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            <TextField
              placeholder="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { fontSize: '1.2rem', fontWeight: 500 }
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              placeholder="Take a note..."
              fullWidth
              multiline
              minRows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              variant="standard"
              InputProps={{
                disableUnderline: true
              }}
              sx={{ mb: 3 }}
            />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#5f6368' }}>Background color:</Typography>
              <ToggleButtonGroup
                value={color}
                exclusive
                onChange={(e, v) => v && setColor(v)}
                sx={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 1,
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    p: 0,
                    minWidth: 'unset',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    m: 0.5,
                    '&.Mui-selected': {
                      border: '2px solid #000',
                    },
                  }
                }}
              >
                {COLORS.map(c => (
                  <ToggleButton
                    key={c.value}
                    value={c.value}
                    sx={{
                      backgroundColor: c.value,
                      '&:hover': {
                        backgroundColor: c.value,
                        opacity: 0.8
                      },
                      '&.Mui-selected': {
                        backgroundColor: c.value,
                        '&:hover': {
                          backgroundColor: c.value,
                          opacity: 0.8
                        }
                      }
                    }}
                  />
                ))}
              </ToggleButtonGroup>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button 
                onClick={handleEditClose}
                sx={{ 
                  color: '#5f6368',
                  '&:hover': {
                    backgroundColor: '#f1f3f4'
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleEditSubmit}
                sx={{ 
                  color: '#5f6368',
                  '&:hover': {
                    backgroundColor: '#f1f3f4'
                  }
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        <Dialog
          open={deleteOpen}
          onClose={handleDeleteCancel}
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ color: '#202124' }}>Delete note</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ color: '#5f6368' }}>
              This note will be permanently deleted
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={handleDeleteCancel}
              sx={{ 
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: '#f1f3f4'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              sx={{ 
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: '#f1f3f4'
                }
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default NoteCard;