import { css } from "@emotion/react";

const areaStyle = css({
	backgroundColor: "white",
	width: "100%",
	height: "10vh",
});

export function TypingArea() {
	return <div css={areaStyle}>TypingArea</div>;
}
