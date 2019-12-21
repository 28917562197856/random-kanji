import React, { useReducer } from "react";
import data from "../rtk-kanji.json";

for (let e of data) if (typeof e === "boolean") console.log(e);

type Kanji = {
  keyword: string;
  kanji: string;
};

type State = {
  score: number;
  kanji: Kanji[];
  selectedKanji: Kanji;
};

type Action = {
  type: "select";
  score?: number;
};

const take = (): Kanji[] => {
  let shuffled: any = data;
  return shuffled.sort(() => 0.5 - Math.random()).slice(0, 18);
};

const init = () => {
  const kanji = take();
  const selectedKanji = kanji[(kanji.length * Math.random()) << 0];
  return {
    score: 0,
    kanji,
    selectedKanji
  };
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "select": {
      const newKanji = take();
      return {
        score: action.score || state.score,
        kanji: newKanji,
        selectedKanji: newKanji[(newKanji.length * Math.random()) << 0]
      };
    }
    default: {
      return state;
    }
  }
};

const initialState = init();

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { score, kanji, selectedKanji } = state;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        justifyItems: "center"
      }}
    >
      <div className="my-2 text-3xl lg:text-6xl">{`${selectedKanji.keyword
        .charAt(0)
        .toUpperCase()}${selectedKanji.keyword.substring(1)}`}</div>
      <div className="absolute top-0 right-0 mt-2 mr-8 text-3xl lg:mr-32 lg:text-6xl">
        {score}
      </div>
      <div className="text-6xl sm:w-auto lg:w-1/3 flex flex-wrap justify-center">
        {kanji.map(k => (
          <div
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
            className="flex justify-center items-center w-32 h-32 p-2 rounded-lg cursor-pointer hover:bg-white hover:shadow-none lg:hover:shadow-2xl lg:hover:bg-gray-200"
            key={k.keyword}
            onClick={() => {
              k === selectedKanji
                ? dispatch({ type: "select", score: score + 1 })
                : dispatch({ type: "select" });
            }}
          >
            {k.kanji}
          </div>
        ))}
      </div>
    </div>
  );
};
