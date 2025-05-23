import { css } from "@emotion/react";

const areaStyle = css({
	backgroundColor: "white",
	width: "100%",
	height: "8vh",
});

export function Widget() {
	return <div css={areaStyle}>Widget</div>;
}
