import { AppBar, Toolbar, Typography, Container } from "@mui/material";

export default function Header() {
  return (
    <>
      <AppBar position="relative">
        <Toolbar>
          <Container>
            <Typography variant="h5" color="inherit" align="center" noWrap>
              Digital DJ
            </Typography>
          </Container>
        </Toolbar>
      </AppBar>
    </>
  );
}
