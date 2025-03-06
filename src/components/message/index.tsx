'use client';

import { AutoAwesome } from '@mui/icons-material';
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import { teal, yellow } from '@mui/material/colors';

const config = {
  user: {
    avatar: <Avatar sx={{ bgcolor: yellow[700] }}>YOU</Avatar>,
    name: 'You',
  },
  assistant: {
    avatar: (
      <Avatar sx={{ bgcolor: teal[400] }}>
        <AutoAwesome />
      </Avatar>
    ),
    name: 'AI Bot',
  },
};

export default function Message({
  role,
  content,
}: Readonly<{
  role: 'user' | 'assistant';
  content?: string;
}>) {
  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>{config[role].avatar}</ListItemAvatar>
      <ListItemText
        primary={<Typography variant="h6">{config[role].name}</Typography>}
        secondary={
          <Typography variant="subtitle1" whiteSpace="break-spaces">
            {content}
          </Typography>
        }
      />
    </ListItem>
  );
}
