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
      let newKanji = take(state.kanjiSet, action.numOfKanji);
      let newSelectedKanji = newKanji[(newKanji.length * Math.random()) << 0];
      return {
        ...state,
        kanji: newKanji,
        selectedKanji: newSelectedKanji,
        numOfKanji: action.numOfKanji
      };
    }
    case "kanjiSet": {
      let newKanji = take(action.kanjiSet, state.numOfKanji);
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
  let { score, kanji, selectedKanji } = state;

  return (
    <div
      style={{ fontFamily: "'Roboto', sans-serif" }}
      className="flex flex-column items-center"
    >
      <div className="mv3">
        <select
          className="mh2 bg-light-gray"
          style={{
            pointerEvents: changeBG ? "none" : undefined
          }}
          defaultValue={lsGet("kanjiSet") || "allGrades"}
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
          className="bg-light-gray"
          style={{
            pointerEvents: changeBG ? "none" : undefined
          }}
          defaultValue={parseInt(lsGet("numOfKanji")) || 24}
          onChange={e => {
            localStorage.setItem("numOfKanji", e.target.value);
            dispatch({
              type: "numOfKanji",
              numOfKanji: parseInt(e.target.value)
            });
          }}
        >
          {[...Array(21).keys()]
            .map(x => x + 5)
            .map(x => (
              <option key={x}>{x}</option>
            ))}
        </select>
      </div>
      <div className="f1 flex flex-column items-center">
        <div>
          {`${selectedKanji.keyword
            .charAt(0)
            .toUpperCase()}${selectedKanji.keyword.substring(1)}`}
        </div>
        <div className="mt2">{score}</div>
      </div>
      <div className="w-100 w-80-ns w-33-l flex flex-wrap justify-center f1">
        {kanji.map(k => (
          <div
            style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              pointerEvents: changeBG ? "none" : undefined,
              cursor: "pointer"
            }}
            className={
              k === selectedKanji && changeBG
                ? "flex items-center justify-center fl w-third w-25-ns w-20-l h4 bg-light-green br4"
                : "flex items-center justify-center fl w-third w-25-ns w-20-l h4 grow br4"
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
