import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
} from "@mui/material";
import theme from "../theme";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Home() {
  return (
    <>
      <section>
        <Box
          sx={{
            pt: 4,
            pb: 4,
            borderLeft: 0.5,
            borderRight: 0.5,
            borderColor: theme.palette.tertiary.main,
            borderRadius: 10,
          }}
        >
          <Container maxWidth="md">
            <Typography component="h1" variant="h2" align="center" gutterBottom>
              <i>Welcome</i>
            </Typography>
            <Typography variant="h5" align="center" paragraph>
              Digital DJ is a simple system to allow you and friends to play and
              listen to music together. By hosting or joining a session, you can
              view the currently playing track, which tracks are coming next,
              and submit a track to be added to the playlist. Think of it a live
              playlist you and others can enjoy together.
            </Typography>
            <Typography variant="h6" align="center" sx={{ pt: 4 }} paragraph>
              you can join a session by code, or create your own.
            </Typography>
            <Stack
              sx={{ pb: 2 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button variant="outlined">Join a Session</Button>
              <Button variant="outlined">Create your own</Button>
            </Stack>
          </Container>
        </Box>
        <Divider component="div" role="presentation">
          <Typography>current public sessions</Typography>
        </Divider>
        <Container
          sx={{
            paddingTop: 2,
            paddingBottom: 4,
            borderLeft: 0.5,
            borderRight: 0.5,
            borderBottom: 0.5,
            borderColor: theme.palette.tertiary.main,
            borderRadius: 10,
          }}
          maxWidth="md"
        >
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: 0.5,
                    borderRadius: 10,
                    borderColor: theme.palette.tertiary.main,
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      // 16:9
                      pt: "56.25%",
                      backgroundImage: `url('/assets/images/controller1.jpg')`,
                      backgroundSize: "cover",
                    }}
                    // image="https://source.unsplash.com/random?wallpapers"
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Session Name
                    </Typography>
                    <Typography>session description</Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">view</Button>
                    <Button size="small">edit</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>
    </>
  );
}
