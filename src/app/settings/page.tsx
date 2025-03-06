'use client';

import { Input, InputProps, List, ListItem, ListItemText } from '@mui/material';

import useApiKey from '@/hooks/use-api-key';

export default function Page() {
  const [apiKey, setApiKey] = useApiKey();

  const handleChange: InputProps['onChange'] = (event) => {
    setApiKey(event.target.value);
  };

  return (
    <List sx={{ flexGrow: 1 }}>
      <ListItem>
        <ListItemText
          primary="API Key"
          secondary={
            <>
              填入 OpenRouter API Key 以使用 AI 聊天功能
              <Input
                value={apiKey}
                onChange={handleChange}
                sx={{ width: '100%' }}
              />
            </>
          }
        />
      </ListItem>
    </List>
  );
}
