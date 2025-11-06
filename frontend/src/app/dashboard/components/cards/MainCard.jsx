import PropTypes from 'prop-types';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';

const headerSX = {
  '& .MuiCardHeader-action': { mt: 0, mr: 0 }
};

export default function MainCard({
  children,
  content = true,
  contentSX = {},
  darkTitle,
  divider = true,
  secondary,
  sx,
  title,
  ...others
}) {
  return (
    <Card sx={{ ...sx }}>
      {!darkTitle && title && (
        <CardHeader title={title} action={secondary} sx={headerSX} />
      )}
      {title && divider && <Divider />}
      {content && <CardContent sx={contentSX}>{children}</CardContent>}
      {!content && children}
    </Card>
  );
}

MainCard.propTypes = {
  children: PropTypes.node,
  content: PropTypes.bool,
  contentSX: PropTypes.object,
  darkTitle: PropTypes.bool,
  divider: PropTypes.bool,
  secondary: PropTypes.any,
  sx: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
};