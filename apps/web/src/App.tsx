import { ThemeProvider } from "@emotion/react";
import "./App.css";
import "./styles/font.css";
import { retroTheme } from "./styles/theme";
import { Monitor } from "./components/Monitor";

function App() {
	return (
		<>
			<ThemeProvider theme={retroTheme}>
				<Monitor />
			</ThemeProvider>
		</>
	);
}

export default App;
