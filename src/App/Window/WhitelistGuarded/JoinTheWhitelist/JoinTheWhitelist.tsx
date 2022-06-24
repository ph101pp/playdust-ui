import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import axios, { AxiosError } from 'axios';
import React, { KeyboardEvent, useRef, useState } from 'react';
import frontendApi from '../../_helpers/frontendApi';
import PlaydustLogo from '../../_sharedComponents/PlaydustLogo';
import HubspotErrorResponseType from './_types/HubspotErrorResponseType';
import HubspotSuccessResponseType from './_types/HubspotSuccessResponseType';

function InlineForm() {
  const [processing, setProcessing] = useState<boolean>(false);
  const [message, setMessage] = useState<{ color: string; text: string }>();

  const inputRef = useRef<HTMLInputElement>();

  const submitForm = async () => {
    if (!inputRef.current) {
      return;
    }

    const email = inputRef.current.value;

    if (!email.length) {
      return;
    }

    setProcessing(true);
    setMessage({ color: 'default', text: 'Submitting...' });

    try {
      const res = await frontendApi.post<HubspotSuccessResponseType>(
        '/join-waitlist',
        {
          email,
        }
      );

      setMessage({
        color: 'success',
        text: 'You have successfully joined our whitelist.',
      });

      if (res?.data?.redirectUri) {
        window.location.href = res.data.redirectUri;
        return;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<HubspotErrorResponseType>;

        if (serverError.response) {
          if (
            serverError.response.status === 400 &&
            serverError.response.data.errors &&
            serverError.response.data.errors[0].errorType === 'INVALID_EMAIL'
          ) {
            setMessage({ color: 'error', text: 'Please enter a valid email.' });
            return;
          }
        }
      }

      setMessage({ color: 'error', text: 'An unknown error occurred.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      await submitForm();
    }
  };

  const handleClickButton = async () => {
    await submitForm();
  };

  return (
    <Box sx={{ padding: '12px' }}>
      <Grid
        container={true}
        spacing={1.2}
        alignItems="stretch"
        justifyContent="center"
      >
        <Grid item={true}>
          <TextField
            inputRef={inputRef}
            placeholder="Enter your email..."
            variant="outlined"
            size="small"
            inputProps={{ size: 32 }}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onKeyPress={handleKeyPress}
            disabled={processing}
          />
        </Grid>
        <Grid item={true}>
          <Button
            variant="contained"
            sx={{ height: '100%', fontSize: '16px', fontWeight: 500 }}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={handleClickButton}
            disabled={processing}
          >
            Join The Waitlist
          </Button>
        </Grid>
      </Grid>
      <Typography
        color={message?.color || 'default'}
        sx={{ visibility: message ? 'visible' : 'hidden', padding: '4px' }}
      >
        {message?.text || '-'}
      </Typography>
    </Box>
  );
}

function Section({
  header,
  body,
}: {
  header: string;
  body: JSX.Element | string;
}) {
  return (
    <Box sx={{ marginBottom: '32px' }}>
      <Typography variant="h6" gutterBottom={true} fontWeight={600}>
        {header}
      </Typography>
      <Typography variant="body1" gutterBottom={true}>
        {body}
      </Typography>
    </Box>
  );
}

function JoinTheWhitelist() {
  return (
    <Box
      sx={{
        marginTop: '3rem',
        textAlign: 'center',
        overflow: 'scroll',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box>
          <PlaydustLogo width="15%" />
        </Box>
        <Typography variant="h6" sx={{ marginBottom: '40px' }}>
          Everything to know about NFTs on Solana
        </Typography>
        <InlineForm />
        <Typography
          variant="subtitle2"
          gutterBottom={true}
          sx={{ padding: '6px', marginBottom: '40px' }}
        >
          By providing your email address, you are agreeing to our{' '}
          <a
            href="https://info.playdust.com/terms-of-service?hsLang=en"
            target="_blank"
            style={{ color: 'revert' }}
            rel="noreferrer"
          >
            terms of use
          </a>{' '}
          and{' '}
          <a
            href="https://info.playdust.com/privacy-policy?hsLang=en"
            target="_blank"
            style={{ color: 'revert' }}
            rel="noreferrer"
          >
            privacy policy
          </a>
          .
        </Typography>
        <Box>
          <Section
            header="Reimagining NFTs"
            body={
              <>
                We’re building the most intuitive and powerful
                <br /> platform for digital assets on Solana.
              </>
            }
          />
          <Section
            header="Playdust is for you"
            body={
              <>
                Whether you’re a collector, trader, creator, or just jpg-
                <br />
                curious, we’ve got you covered.
              </>
            }
          />
          <Section
            header="Sign up for access"
            body={
              <>
                Our closed beta will launch soon. We’ll whitelist you
                <br /> for our Playdust NFT drop as a thank you.
              </>
            }
          />
        </Box>
      </Box>
    </Box>
  );
}

export default JoinTheWhitelist;