import React, { useState } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { addNoteAPICall } from "../utils/apiCalls.js";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
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

const AddNote = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setTitle('');
    setContent('');
    setColor(COLORS[0].value);
    setError('');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please fill in both the title and content.');
      return;
    }

    try {
      setLoading(true);
      await addNoteAPICall(title, content, color);
      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error adding note:", error);
      setError('Failed to add note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          backgroundColor: '#fff',
          color: '#5f6368',
          boxShadow: '0 1px 2px 0 rgba(60,64,67,0.302), 0 1px 3px 1px rgba(60,64,67,0.149)',
          '&:hover': {
            backgroundColor: '#f1f3f4',
          }
        }}
      >
        <AddIcon />
      </Fab>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#202124' }}>Create Note</Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            placeholder="Title"
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            variant="standard"
            sx={{ mb: 2 }}
            InputProps={{
              disableUnderline: true,
              style: { fontSize: '1.2rem', fontWeight: 500 }
            }}
          />

          <TextField
            placeholder="Take a note..."
            fullWidth
            multiline
            minRows={4}
            value={content}
            onChange={e => setContent(e.target.value)}
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
              onClick={handleClose}
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
              onClick={handleSubmit}
              disabled={loading}
              sx={{ 
                color: '#5f6368',
                '&:hover': {
                  backgroundColor: '#f1f3f4'
                }
              }}
            >
              {loading ? 'Creating...' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AddNote;