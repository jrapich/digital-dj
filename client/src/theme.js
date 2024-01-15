import { createTheme } from "@mui/material/styles";

//color palette object, might export this to other places or import it from somewhere else
const colors = {
  silver: "#c2c2c2",
  jade: "#5bae6a",
  airForceBlue: "#597e9b",
  spaceCadetBlue: "#27293f",
  raisinBlack: "#181d27",
};

// Create our theme palette
let theme = createTheme({
  palette: {
    text: {
      main: colors.jade,
    },
    background: {
      main: colors.spaceCadetBlue,
    },
    primary: {
      main: colors.airForceBlue,
      contrastText: colors.jade,
    },
    secondary: {
      main: colors.raisinBlack,
      contrastText: colors.jade,
    },
    tertiary: {
      main: colors.silver,
    },
    accent: {
      main: colors.jade,
    },
  },
});

//create the theme with MUI
theme = createTheme(theme, {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: theme.palette.background.main,
          color: theme.palette.text.main,
          //   if we want a background image later
          //   backgroundImage: `url('')`,
          //   backgroundRepeat: 'no-repeat',
          //   backgroundAttachment: 'fixed',
          //   backgroundSize: 'cover'
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: theme.palette.secondary.main,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderTop: `solid ${theme.palette.primary.dark}`,
          borderBottom: `solid ${theme.palette.primary.dark}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.secondary.main,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          color: theme.palette.text.main,
          backgroundColor: theme.palette.primary.dark,
          borderColor: theme.palette.secondary.main,
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          color: theme.palette.text.main,
          backgroundColor: theme.palette.secondary.main,
          borderColor: theme.palette.secondary.main,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.main,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: theme.palette.text.main,
          marginBottom: "5px",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.secondary,
          },
          "&.Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              "& legend": {
                overflow: "initial",
                textAlign: "right",
                "& span": {
                  opacity: "100",
                },
              },
            },
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.main,
          },
          "& .MuiOutlinedInput-input": {
            color: theme.palette.text.main,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.tertiary.main,
          color: theme.palette.text.main,
          "&:hover": {
            color: theme.palette.warning.main,
            backgroundColor: theme.palette.secondary.dark,
          },
        },
      },
    },
  },
});

export default theme;
