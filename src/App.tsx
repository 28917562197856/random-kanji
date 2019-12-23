import React, { useReducer, useState } from "react";
import data from "./kanji.json";

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
  | {
      type: "right";
      score: number;
    }
  | { type: "wrong" }
  | { type: "numOfKanji"; numOfKanji: number }
  | { type: "kanjiSet"; kanjiSet: string };

const take = (kanjiSet: string, n: number): Kanji[] => {
  let shuffled: any = data[kanjiSet];
  return shuffled.sort(() => 0.5 - Math.random()).slice(0, n);
};

const init = () => {
  const kanji = take("allGrades", 24);
  const selectedKanji = kanji[(kanji.length * Math.random()) << 0];
  return {
    score: 0,
    kanji,
    selectedKanji,
    numOfKanji: 24,
    kanjiSet: "allGrades"
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
  const { score, kanji, selectedKanji, numOfKanji } = state;

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
          defaultValue="allGrades"
          className={styles.select}
          onChange={e => {
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
          defaultValue={24}
          className={styles.select + " ml-2"}
          onChange={e => {
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
      <div
        className={(() => {
          let k = styles.kanjiContainer;
          if (numOfKanji >= 20 && numOfKanji < 30) k += styles.over20;
          else if (numOfKanji >= 30 && numOfKanji < 40) k += styles.over30;
          else if (numOfKanji >= 40 && numOfKanji < 50) k += styles.over40;
          else if (numOfKanji >= 50) k += styles.over50;
          else k += styles.under20;
          return k;
        })()}
      >
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
  keyword: "inline-block w-full text-center text-4xl lg:text-6xl",
  score: "inline-block self-center text-3xl lg:text-6xl",
  kanjiContainer: "text-6xl w-auto flex flex-wrap justify-center ",
  under20: "lg:w-1/3",
  over20: "lg:w-1/2",
  over30: "lg:w-2/3",
  over40: "lg:w-4/5",
  over50: "lg:w-full",
  kanji: `flex justify-center items-center w-32 h-32 p-2 rounded-lg cursor-pointer
          hover:bg-white hover:shadow-none lg:hover:shadow-xl lg:hover:bg-gray-200`,
  kanjiSelected:
    "flex justify-center items-center w-32 h-32 p-2 rounded-lg bg-green-200"
};
