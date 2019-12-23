import React, { useReducer, useState } from "react";
import data from "./rtk-kanji.json";

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

type Action =
  | {
      type: "right";
      score: number;
    }
  | { type: "wrong" }
  | { type: "numOfKanji"; numOfKanji: number };

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
    case "right": {
      const newKanji = take(state.numOfKanji);
      return {
        ...state,
        score: action.score,
        kanji: newKanji,
        selectedKanji: newKanji[(newKanji.length * Math.random()) << 0]
      };
    }
    case "wrong": {
      const newKanji = take(state.numOfKanji);
      return {
        ...state,
        kanji: newKanji,
        selectedKanji: newKanji[(newKanji.length * Math.random()) << 0]
      };
    }
    case "numOfKanji": {
      const newKanji = take(action.numOfKanji);
      return {
        ...state,
        kanji: newKanji,
        selectedKanji: newKanji[(newKanji.length * Math.random()) << 0],
        numOfKanji: action.numOfKanji
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
  const [changeBG, setChangeBG] = useState(false);
  const { score, kanji, selectedKanji } = state;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        justifyItems: "center"
      }}
    >
      <div className="mt-4 flex flex-wrap w-full justify-around">
        <select
          defaultValue={12}
          className={styles.select}
          onChange={e => {
            dispatch({
              type: "numOfKanji",
              numOfKanji: parseInt(e.target.value)
            });
          }}
        >
          {[...Array(21).keys()]
            .map(x => x + 4)
            .map(x => (
              <option key={x}>{x}</option>
            ))}
        </select>
        <div className={styles.keyword}>
          {`${selectedKanji.keyword
            .charAt(0)
            .toUpperCase()}${selectedKanji.keyword.substring(1)}`}
        </div>
        <div className={styles.score}>{score}</div>
      </div>
      <div className={styles.kanjiContainer}>
        {kanji.map(k => (
          <div
            style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              pointerEvents: changeBG ? "none" : undefined
            }}
            className={
              k === selectedKanji && changeBG
                ? styles.kanjiSelected
                : styles.kanji
            }
            key={k.keyword}
            onClick={() => {
              k === selectedKanji
                ? dispatch({ type: "right", score: score + 1 })
                : (async () => {
                    console.log(selectedKanji.kanji);
                    setChangeBG(true);
                    await new Promise(r => setTimeout(r, 1500));
                    setChangeBG(false);
                    dispatch({ type: "wrong" });
                  })();
            }}
          >
            {k.kanji}
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  select: "inline-block self-center",
  keyword: "inline-block w-full lg:w-1/2 text-center my-2 text-4xl lg:text-6xl",
  score: "inline-block self-center text-3xl lg:text-6xl",
  kanjiContainer: "text-6xl sm:w-auto lg:w-1/3 flex flex-wrap justify-center",
  kanji: `flex justify-center items-center w-32 h-32 p-2 rounded-lg cursor-pointer
          hover:bg-white hover:shadow-none lg:hover:shadow-xl lg:hover:bg-gray-200`,
  kanjiSelected:
    "flex justify-center items-center w-32 h-32 p-2 rounded-lg border-2 border-green-200"
};
