// Copyright 2026 The ThunderID Authors
// SPDX-License-Identifier: Apache-2.0

import {Box, Typography} from '@wso2/oxygen-ui';
import {ArrowRight, CircleCheck} from '@wso2/oxygen-ui-icons-react';
import React from 'react';
import LoginBox from './LoginBox';

function Arrow(): React.ReactElement {
  return (
    <Box
      aria-hidden="true"
      sx={{
        color: 'text.secondary',
        display: 'flex',
        transform: 'rotate(90deg)',
        '@container (min-width: 480px)': {transform: 'none'},
      }}
    >
      <ArrowRight size={24} />
    </Box>
  );
}

interface AuthenticationPreviewProps {
  withMfa?: boolean;
}

export default function AuthenticationPreview({withMfa = false}: AuthenticationPreviewProps): React.ReactElement {
  return (
    <Box
      component="figure"
      aria-label={
        withMfa
          ? 'Sign in with ThunderID, verify a second factor, then return authenticated'
          : 'Sign in with ThunderID, then return authenticated'
      }
      sx={{m: 0, my: 3, containerType: 'inline-size'}}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          '@container (min-width: 480px)': {flexDirection: 'row'},
        }}
      >
        <LoginBox variant="social" sx={{width: '100%', maxWidth: 280, p: 2.5}} />
        <Arrow />
        {withMfa && (
          <>
            <LoginBox variant="mfa" sx={{width: '100%', maxWidth: 280, p: 2.5}} />
            <Arrow />
          </>
        )}
        <Box sx={{textAlign: 'center', flexShrink: 0, color: 'success.main'}}>
          <CircleCheck size={32} aria-hidden="true" />
          <Typography sx={{mt: 1, fontWeight: 600, color: 'text.primary'}}>Sign-in done</Typography>
          <Typography variant="body2" sx={{color: 'text.secondary'}}>Identity confirmed</Typography>
        </Box>
      </Box>
      <Typography component="figcaption" variant="body2" sx={{mt: 2, textAlign: 'center', color: 'text.secondary'}}>
        {withMfa ? 'Example hosted sign-in experience with a second factor' : 'Example hosted sign-in experience'}
      </Typography>
    </Box>
  );
}
