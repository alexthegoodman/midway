import { ThemeOptions } from "@mui/material";
import { amber, deepOrange, grey } from "@mui/material/colors";

// import NextLink from "next/link";
// import { forwardRef } from "react";
import { merge } from "ts-deepmerge";

// const LinkBehaviour = forwardRef(function LinkBehaviour(props, ref) {
//   return <NextLink ref={ref} {...props} />;
// });

export const getThemeOptions = (mode: string) => {
  let options: ThemeOptions = {
    palette: {
      mode: "dark",
      primary: {
        main: "#FFFFFF", // neon blue? 1F51FF
      },
      secondary: {
        main: "#E5E5E5",
      },
      background: {
        default: "#333333",
        paper: "#333333",
      },
      success: {
        main: "#99c7a2",
        dark: "#99c7a2",
      },
    },
    typography: {
      allVariants: {
        color: "white",
        fontFamily: "Inter",
      },
      button: {
        textTransform: "none",
      },
      h1: {
        fontSize: "4rem",
        fontWeight: 700,
      },
      h4: {
        fontSize: "2rem",
        lineHeight: "3rem",
        fontWeight: 700,
      },
      body1: {
        fontSize: "1rem",
      },
    },

    spacing: 8,

    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: "white",
            color: "#333333",
            boxShadow: "0px 15px 15px 4px rgba(0, 0, 0, 0.12)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: "white",
            borderRadius: "20px !important",
            textTransform: "none",
            minHeight: "70px",
            boxShadow: "none",
            fontSize: "18px",
            padding: "0px 15px",
            "&:hover": {
              boxShadow: "none",
            },
          },
          outlinedSecondary: {
            color: "#515151",
            borderColor: "#515151",
            "&:hover": {
              borderColor: "black",
            },
          },
          textPrimary: {
            color: "#515151",
            textAlign: "left",
            justifyContent: "flex-start",
            paddingLeft: "20px",
            paddingRight: "20px",
            "&:hover": {
              backgroundColor: "#515151 !important",
              color: "white !important",
              "& p, & span": {
                color: "white !important",
              },
            },
          },
          containedSuccess: {
            border: "1px solid #74ad7f",
            background: "linear-gradient(145deg, #99c7a2 65%, #c8cc7c 100%)",
            fontWeight: 600,
            transition: "0.2s all",
            minWidth: "100px",
            "&:hover": {
              background: "linear-gradient(145deg, #99c7a2 25%, #c8cc7c 100%)",
              transition: "0.2s all",
            },
          },
          sizeSmall: {
            minHeight: "50px",
            minWidth: "120px",
            fontSize: "15px",
          },
        },
      },
      MuiLink: {
        // defaultProps: {
        //   component: LinkBehaviour,
        // },
        styleOverrides: {
          root: {
            fontFamily: "Inter",
          },
        },
      },
      MuiButtonBase: {
        defaultProps: {
          //   LinkComponent: LinkBehaviour,
          disableRipple: true,
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            borderRadius: "25px !important",
            // border: "1px solid white !important",
            border: "none",
            backgroundColor: "#FFF",
            color: "#515151",
          },
          input: {
            borderRadius: "25px !important",
            boxSizing: "border-box",
            minHeight: "70px",
            // boxShadow: "0px 6px 12px 1px rgba(0, 0, 0, 0.2)",
            boxShadow: "0px 15px 15px 4px rgba(0, 0, 0, 0.12)",
            border: "none",
            padding: "0px 25px !important",
            outline: "none",
            "&::placeholder": {
              color: "#515151",
              opacity: 0.5,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            borderRadius: "25px !important",
            boxSizing: "border-box",
            minHeight: "50px",
            boxShadow: "0px 15px 15px 4px rgba(0, 0, 0, 0.12)",
            border: "none",
            padding: "0px 25px !important",
            outline: "none",
            display: "flex",
            alignItems: "center",
            "&::placeholder": {
              color: "#515151",
              opacity: 0.5,
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          notchedOutline: {
            borderColor: "white",
            borderWidth: "2px",
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            opacity: 0.5,
          },
          shrink: {
            display: "none",
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          input: {
            backgroundColor: "transparent",
            border: "none",
          },
        },
      },
      // MuiPaper: {
      //   root: {
      //     borderRadius: "25px",
      //   },
      // },
      MuiTypography: {
        styleOverrides: {
          h3: {
            fontWeight: "600",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "25px",
            boxShadow: "0px 15px 15px 4px rgba(0, 0, 0, 0.12)",
          },
        },
      },
      MuiCardActionArea: {
        styleOverrides: {
          root: {
            padding: "15px",
          },
        },
      },
    },
  };

  if (mode === "dark") {
    options = merge(options, {
      palette: {
        // mode: "dark",
        primary: {
          main: "#FFFFFF",
        },
        secondary: {
          main: "#FFFFFF",
        },
        background: {
          default: "#333333",
          paper: "#333333",
        },
        success: {
          main: "#38ef7d", // 56, 239, 125
          dark: "#38ef7d",
        },
      },
      typography: {
        allVariants: {
          color: "#FFFFFF",
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              color: "#FFFFFF",
            },
            containedSecondary: {
              color: "#000000",
              "&:hover": {
                backgroundColor: "#E5E5E5",
              },
            },
          },
        },
      },
    });
    console.log(options);
  } else if (mode === "light") {
    options = merge(options, {
      palette: {
        // mode: "light",
        primary: {
          main: "#99c7a2",
        },
        secondary: {
          main: "#E5E5E5",
        },
        background: {
          default: "#FFFFFF",
          paper: "#FFFFFF",
        },
        // success: {
        //   main: "#38ef7d",
        //   dark: "#38ef7d",
        // },
      },
      typography: {
        allVariants: {
          color: "#515151",
        },
      },
      components: {
        // MuiButton: {
        //   styleOverrides: {
        //     textPrimary: {
        //       color: "#515151",
        //       backgroundColor: "white",
        //       "&:hover": {
        //         color: "white",
        //         backgroundColor: "#515151",
        //       },
        //     },
        //   },
        // },
        // MuiLink: {
        //   root: {
        //     color: "#515151",
        //   },
        // },
      },
    });
  }

  return options;
};

// const theme = createTheme(themeOptions);

// export default theme;
