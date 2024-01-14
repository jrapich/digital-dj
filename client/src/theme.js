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
          color: theme.palette.text.main,
          //   if we want a background image later
          //   backgroundImage: `url('')`,
          //   backgroundRepeat: 'no-repeat',
          //   backgroundAttachment: 'fixed',
          //   backgroundSize: 'cover'
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.contrastText,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.contrastText,
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
            borderColor: theme.palette.primary.contrastText,
          },
          "& .MuiOutlinedInput-input": {
            color: theme.palette.primary.contrastText,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderColor: theme.palette.primary.contrastText,
          color: theme.palette.primary.contrastText,
          "&:hover": {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
          },
        },
      },
    },
  },
});

export default theme;
