import { z } from "zod";
import { BaseRouter } from "./router";

const sampleScript = Object.freeze([
	"노을 진 저녁길을 걷다 보면 마음속에도 작은 빛이 스며드는 듯하다.",
	"별 하나 없는 밤 고요함 속에서 나도 모르게 누군가를 떠올렸다.",
	"유리창에 맺힌 빗물처럼 흐르는 생각을 가만히 바라본다.",
	"잊혀진 약속이 문득 떠오르는 밤 그리움도 이따금 안부를 전한다.",
	"무심히 지나가는 바람결에 내일을 향한 작은 기대를 실어본다.",
	"좋아하는 노래 한 곡에 마음이 왠지 가벼워지는 날이 있다.",
	"오래된 편지 한 장을 꺼내 읽으며 시간을 거슬러 걷는다.",
	"따뜻한 햇살에 눈을 감으면 마음 한켠이 포근해진다.",
	"우연히 스친 시선에도 하루의 피로가 사르르 녹는다.",
	"잎새 사이로 스며드는 아침 햇살이 오늘의 시작을 응원한다.",
	"작은 꽃 한 송이가 내게 말을 건네는 듯 오늘은 왠지 특별하다.",
	"익숙한 길을 걷다가도 낯선 풍경을 마주하는 순간이 있다.",
	"커피 한 잔에 담긴 향기처럼 소소한 일상도 때로는 위로가 된다.",
	"밤하늘의 달을 바라보며 멀리 있는 이에게 안부를 전해본다.",
	"조용한 새벽 마음속 이야기가 살며시 깨어난다.",
	"가끔은 이유 없이 설레는 아침이 있다.",
	"잊힌 꿈이 다시 찾아와 마음을 두드린다.",
	"서랍 속 오래된 사진을 꺼내며 지난 추억을 만지작거린다.",
	"유난히 쓸쓸한 밤 창밖 바람 소리에 귀 기울인다.",
	"빛바랜 그림자 사이로 새로운 시작을 꿈꾼다.",
	"누군가의 미소가 오늘을 환하게 밝힌다.",
	"한참을 바라본 하늘 그 끝에는 무한한 가능성이 있다.",
	"오래된 책에서 나는 종이 냄새가 유난히 그리운 날이다.",
	"작은 우산 아래 둘만의 세계가 펼쳐진다.",
	"혼자 걷는 골목길도 추억이 스며들면 따뜻해진다.",
	"생각지 못한 선물처럼 좋은 하루가 찾아왔다.",
	"이름 모를 들꽃에 마음을 빼앗긴 오후였다.",
	"다정한 한마디에 하루가 환해지는 기분.",
	"문득 떠오른 노래 가사에 오래된 감정이 묻어난다.",
	"고요한 밤 별빛이 내 마음을 조용히 어루만진다.",
]);

export class ScriptRouter extends BaseRouter {
	static Metadata = {
		construct: () => new ScriptRouter(),
	};

	create() {
		return this.router({
			getRandom: this.getRandom(),
		});
	}

	/**
	 * @returns 이전 스크립트(prev)를 제외하고 랜덤 스크립트 반환
	 */
	getRandom() {
		return this.publicProcedure
			.meta({
				openApi: {
					method: "GET",
					path: "/trpc/script.getRandom",
					summary: "랜덤 스크립트 반환",
				},
			})
			.input(
				z.object({
					prev: z.number(),
				}),
			)
			.query(({ input }) => {
				const candidates = sampleScript
					.map((_, idx) => idx)
					.filter((idx) => idx !== input.prev);

				if (candidates.length === 0) {
					return null;
				}

				const randomIdx =
					candidates[Math.floor(Math.random() * candidates.length)];
				return {
					index: randomIdx,
					script: sampleScript[randomIdx],
				};
			});
	}
}
