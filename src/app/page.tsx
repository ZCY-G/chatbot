'use client';

import { useEffect, useRef, useState } from 'react';

import { ArrowUpward } from '@mui/icons-material';
import {
  Box,
  Button,
  Container,
  InputAdornment,
  List,
  OutlinedInput,
  Stack,
} from '@mui/material';

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';

import Message from '@/components/message';
import useApiKey from '@/hooks/use-api-key';

const getOpenRouter = (apiKey: string) => createOpenRouter({ apiKey });

interface MessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Page() {
  const [apiKey] = useApiKey();
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const end = endRef.current;

    if (container && end) {
      const observer = new MutationObserver(() => {
        end.scrollIntoView({ behavior: 'instant', block: 'end' });
      });

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      return () => observer.disconnect();
    }
  }, []);

  const handleSend = async () => {
    if (apiKey === undefined || userInput.length === 0) {
      return;
    }
    setLoading(true);
    const newMessages = messages.concat({
      id: new Date().getTime().toString(),
      role: 'user',
      content: userInput,
    });
    setMessages(newMessages);
    const openRouter = getOpenRouter(apiKey);
    const { textStream } = streamText({
      model: openRouter('openai/gpt-3.5-turbo-1106'),
      messages: newMessages,
    });
    setUserInput('');
    const newId = new Date().getTime().toString();
    setMessages((prevState) =>
      prevState.concat({
        id: newId,
        role: 'assistant',
        content: '',
      }),
    );
    for await (const textPart of textStream) {
      setMessages((prevState) => {
        const lastHistory = prevState.find(
          ({ id }) => id === newId,
        ) as MessageProps;
        return prevState
          .filter(({ id }) => id !== newId)
          .concat({
            ...lastHistory,
            content: lastHistory?.content + textPart,
          });
      });
    }
    setLoading(false);
  };

  return (
    <Container
      ref={containerRef}
      sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
    >
      <Stack sx={{ flexGrow: 1 }}>
        <List sx={{ flexGrow: 1 }}>
          {messages.map(({ id, role, content }) => (
            <Message key={id} role={role} content={content} />
          ))}
        </List>
        <Box
          sx={{
            pt: 2,
            pb: 2,
            position: 'sticky',
            bottom: 56,
            left: 0,
            right: 0,
            bgcolor: 'white',
          }}
        >
          <OutlinedInput
            endAdornment={
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  disabled={apiKey === undefined}
                  loading={loading}
                  onClick={handleSend}
                >
                  <ArrowUpward />
                </Button>
              </InputAdornment>
            }
            disabled={apiKey === undefined}
            value={userInput}
            fullWidth
            onChange={(event) => setUserInput(event.target.value)}
          />
        </Box>
      </Stack>
      <div ref={endRef} />
    </Container>
  );
}
