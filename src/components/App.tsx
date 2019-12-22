import React, { useReducer } from "react";
import data from "../rtk-kanji.json";

type Kanji = {
  keyword: string;
  kanji: string;
};

type State = {
  score: number;
  kanji: Kanji[];
  selectedKanji: Kanji;
  numOfKanji: number;
};

type Action = {
  type: "select";
  score?: number;
  numOfKanji?: number;
};

const take = (n: number): Kanji[] => {
  let shuffled: any = data;
  return shuffled.sort(() => 0.5 - Math.random()).slice(0, n);
};

const init = () => {
  const kanji = take(12);
  const selectedKanji = kanji[(kanji.length * Math.random()) << 0];
  return {
    score: 0,
    kanji,
    selectedKanji,
    numOfKanji: 12
  };
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "select": {
      const newKanji = take(action.numOfKanji || state.numOfKanji);
      return {
        score: action.score || state.score,
        kanji: newKanji,
        selectedKanji: newKanji[(newKanji.length * Math.random()) << 0],
        numOfKanji: action.numOfKanji || state.numOfKanji
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
      <select
        className="absolute mt-6 lg:mt-8 ml-8 px-2 py-1"
        onChange={e => {
          dispatch({ type: "select", numOfKanji: parseInt(e.target.value) });
        }}
      >
        {[...Array(21).keys()]
          .map(x => x + 4)
          .map(x => (
            <option selected={x === 12 ? true : undefined} key={x}>
              {x}
            </option>
          ))}
      </select>
      <div className="my-2 text-3xl lg:text-6xl">{`${selectedKanji.keyword
        .charAt(0)
        .toUpperCase()}${selectedKanji.keyword.substring(1)}`}</div>
      <div className="absolute right-0 mt-2 mr-8 text-3xl lg:mr-32 lg:text-6xl">
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
