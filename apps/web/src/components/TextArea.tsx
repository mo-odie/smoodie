import { css } from "@emotion/react";

const areaStyle = css({
	backgroundColor: "black",
	width: "100%",
	height: "45vh",
});

export function TextArea() {
	return <div css={areaStyle}>안녕 안녕하세요</div>;
}
