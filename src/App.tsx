import React, { useReducer, useState } from "react";
import kanjiSets from "./kanji";

function take(kanjiSet: string, n: number): Kanji[] {
  let shuffled: Kanji[] = kanjiSets[kanjiSet][kanjiSet];
  return shuffled.sort(() => 0.5 - Math.random()).slice(0, n);
}

let lsGet = (name: string) => localStorage.getItem(name) ?? "";

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "right": {
      let newKanji = take(state.kanjiSet, state.numOfKanji);
      let newSelectedKanji = newKanji[(newKanji.length * Math.random()) << 0];
      return {
        ...state,
        score: action.score,
        kanji: newKanji,
        selectedKanji: newSelectedKanji
      };
    }
    case "wrong": {
      let newKanji = take(state.kanjiSet, state.numOfKanji);
      let newSelectedKanji = newKanji[(newKanji.length * Math.random()) << 0];
      return {
        ...state,
        kanji: newKanji,
        selectedKanji: newSelectedKanji
      };
    }
    case "numOfKanji": {
      let newKanji = take(state.kanjiSet, state.numOfKanji);
      let newSelectedKanji = newKanji[(newKanji.length * Math.random()) << 0];
      return {
        ...state,
        kanji: newKanji,
        selectedKanji: newSelectedKanji,
        numOfKanji: action.numOfKanji
      };
    }
    case "kanjiSet": {
      let newKanji = take(state.kanjiSet, state.numOfKanji);
      let newSelectedKanji = newKanji[(newKanji.length * Math.random()) << 0];
      return {
        ...state,
        kanji: newKanji,
        selectedKanji: newSelectedKanji,
        kanjiSet: action.kanjiSet
      };
    }
    default: {
      return state;
    }
  }
}

function init() {
  let defaultNumOfKanji = parseInt(lsGet("numOfKanji")) || 24;
  let defaultKanjiSet = lsGet("kanjiSet") || "allGrades";
  let kanji = take(defaultKanjiSet, defaultNumOfKanji);
  let selectedKanji = kanji[(kanji.length * Math.random()) << 0];
  return {
    score: 0,
    kanji,
    selectedKanji,
    numOfKanji: defaultNumOfKanji,
    kanjiSet: defaultKanjiSet
  };
}

let initialState = init();

export default function App() {
  let [state, dispatch] = useReducer(reducer, initialState);
  let [changeBG, setChangeBG] = useState(false);
  let { score, kanji, selectedKanji, kanjiSet } = state;

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
          {Object.entries(kanjiSets).map(e => (
            <option value={e[0]} key={e[0]}>
              {e[1].name} ({e[1][Object.keys(e[1])[0]].length})
            </option>
          ))}
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
          {[...Array(27).keys()]
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
}

let styles = {
  select: "self-center",
  keyword: "inline-block w-full text-center text-4xl lg:text-5xl xl:text-6xl",
  score: "inline-block self-center text-4xl lg:text-6xl",
  kanjiContainer: `text-6xl sm:text-6xl md:text-6xl lg:text-6xl xl:text-6xl
        w-full md:w-2/3 lg:w-2/3 xl:w-1/2 flex flex-wrap justify-center`,
  kanji: `flex justify-center items-center w-32 h-32 p-2 rounded-lg cursor-pointer
        hover:bg-white hover:shadow-none lg:hover:shadow-xl lg:hover:bg-gray-200`,
  kanjiSelected:
    "flex justify-center items-center w-32 h-32 p-2 rounded-lg bg-green-200"
};

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
