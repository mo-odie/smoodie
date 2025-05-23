import { css, useTheme } from "@emotion/react";
import type { Theme } from "@/styles/theme";
import { TextArea } from "./TextArea";
import { TypingArea } from "./TypingArea";
import { Widget } from "./Widget";

const monitorStyle = (theme: Theme) =>
	css({
		backgroundColor: theme.colors.primary,
		padding: "1vh 2vh",
		width: "1280px",
		height: "720px",
		fontFamily: theme.fonts.primary,
		color: theme.colors.text,

		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: "1.5vh",
	});

const dividerStyle = css({
	backgroundColor: "white",
	width: "100%",
	height: "1vh",
});

function Divider() {
	return <div css={dividerStyle} />;
}

export function Monitor() {
	const theme = useTheme();
	return (
		<div css={monitorStyle(theme as Theme)}>
			<Widget />
			<Divider />
			<TextArea />
			<Divider />
			<TypingArea />
			<Divider />
		</div>
	);
}
