import React, { useReducer, useState } from "react";
import kanji from "./kanji.js";

type Kanji = {
  keyword: string;
  kanji: string;
};

type State = {
  score: number;
  kanji: Kanji[];
  selectedKanji: Kanji;
  numOfKanji: number;
  kanjiSet: string;
};

type Action =
  | { type: "right"; score: number }
  | { type: "wrong" }
  | { type: "numOfKanji"; numOfKanji: number }
  | { type: "kanjiSet"; kanjiSet: string };

const take = (kanjiSet: string, n: number): Kanji[] => {
  let shuffled: Kanji[] = kanji[kanjiSet];
  return shuffled.sort(() => 0.5 - Math.random()).slice(0, n);
};

const lsGet = (name: string) => localStorage.getItem(name) ?? "";

const init = () => {
  const defaultNumOfKanji = parseInt(lsGet("numOfKanji")) || 24;
  const defaultKanjiSet = lsGet("kanjiSet") || "allGrades";
  const kanji = take(defaultKanjiSet, defaultNumOfKanji);
  const selectedKanji = kanji[(kanji.length * Math.random()) << 0];
  return {
    score: 0,
    kanji,
    selectedKanji,
    numOfKanji: defaultNumOfKanji,
    kanjiSet: defaultKanjiSet
  };
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "right": {
      const newKanji = take(state.kanjiSet, state.numOfKanji);
      return {
        ...state,
        score: action.score,
        kanji: newKanji,
        selectedKanji: newKanji[(newKanji.length * Math.random()) << 0]
      };
    }
    case "wrong": {
      const newKanji = take(state.kanjiSet, state.numOfKanji);
      return {
        ...state,
        kanji: newKanji,
        selectedKanji: newKanji[(newKanji.length * Math.random()) << 0]
      };
    }
    case "numOfKanji": {
      const newKanji = take(state.kanjiSet, action.numOfKanji);
      return {
        ...state,
        kanji: newKanji,
        selectedKanji: newKanji[(newKanji.length * Math.random()) << 0],
        numOfKanji: action.numOfKanji
      };
    }
    case "kanjiSet": {
      const newKanji = take(action.kanjiSet, state.numOfKanji);
      return {
        ...state,
        kanji: newKanji,
        selectedKanji: newKanji[(newKanji.length * Math.random()) << 0],
        kanjiSet: action.kanjiSet
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
      <div className="mt-4">
        <select
          style={{
            pointerEvents: changeBG ? "none" : undefined
          }}
          defaultValue={lsGet("kanjiSet") || "allGrades"}
          className={styles.select}
          onChange={e => {
            localStorage.setItem("kanjiSet", e.target.value);
            dispatch({
              type: "kanjiSet",
              kanjiSet: e.target.value
            });
          }}
        >
          <option value="allGrades">Jōyō kanji</option>
          {[...Array(6).keys()]
            .map(x => x + 1)
            .map(x => (
              <option value={`grade${x}`} key={x}>{`Grade ${x}`}</option>
            ))}
          <option value="gradeS">Secondary School</option>
          <option value="rtk">RTK 1+3</option>
        </select>
        <select
          style={{
            pointerEvents: changeBG ? "none" : undefined
          }}
          defaultValue={parseInt(lsGet("numOfKanji")) || 24}
          className={styles.select + " ml-2"}
          onChange={e => {
            localStorage.setItem("numOfKanji", e.target.value);
            dispatch({
              type: "numOfKanji",
              numOfKanji: parseInt(e.target.value)
            });
          }}
        >
          {[...Array(57).keys()]
            .map(x => x + 4)
            .map(x => (
              <option key={x}>{x}</option>
            ))}
        </select>
      </div>
      <div className={styles.keyword}>
        {`${selectedKanji.keyword
          .charAt(0)
          .toUpperCase()}${selectedKanji.keyword.substring(1)}`}
      </div>
      <div className={styles.score}>{score}</div>
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
            key={`${k.keyword}${Math.random() * 100000}`}
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
  select: "self-center",
  keyword: "inline-block w-full text-center text-4xl lg:text-5xl xl:text-6xl",
  score: "inline-block self-center text-4xl lg:text-6xl",
  kanjiContainer: `text-6xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-6xl
        w-auto md:w-2/3 lg:w-2/3 xl:w-1/2 flex flex-wrap justify-center`,
  kanji: `flex justify-center items-center w-32 h-32 p-2 rounded-lg cursor-pointer
        hover:bg-white hover:shadow-none lg:hover:shadow-xl lg:hover:bg-gray-200`,
  kanjiSelected:
    "flex justify-center items-center w-32 h-32 p-2 rounded-lg bg-green-200"
};
