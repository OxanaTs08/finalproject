import { createGlobalStyle } from "styled-components";
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0 40px;
    font-family: 'Montserrat', sans-serif;
    color: rgba(40, 40, 40, 1);
    box-sizing: border-box;
  }

  * {
    box-sizing: inherit;
  }

  .MuiAppBar-root, .MuiToolbar-root {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
`;

export default GlobalStyle;
